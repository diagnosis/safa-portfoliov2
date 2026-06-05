package authhandler

import (
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
)

func (h *AuthHandler) HandleRefresh(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		responder.Error(w, errors.Unauthorized("unauthorized", "no refresh token cookie"), correlationID)
		return
	}

	hash := secure.HashRefreshToken(cookie.Value)
	_, err = h.authStore.GetRefreshToken(ctx, hash)
	if err != nil {
		responder.Error(w, errors.Unauthorized("invalid or expired token", "refresh token lookup failed"), correlationID)
		return
	}

	// delete all, issue fresh pair
	if err := h.authStore.DeleteAllRefreshTokens(ctx); err != nil {
		logger.Warn(ctx, "failed to delete old refresh tokens", "err", err)
	}

	accessToken, err := h.jwt.SignAccess("admin")
	if err != nil {
		logger.Error(ctx, "failed to sign access token", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to sign access token"), correlationID)
		return
	}

	rawRefresh, err := secure.GenerateRefreshToken()
	if err != nil {
		logger.Error(ctx, "failed to generate refresh token", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to generate refresh token"), correlationID)
		return
	}

	if err := h.authStore.CreateRefreshToken(ctx, secure.HashRefreshToken(rawRefresh), time.Now().Add(h.cfg.JWT.RefreshTokenExpiry)); err != nil {
		logger.Error(ctx, "failed to save refresh token", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to save refresh token"), correlationID)
		return
	}

	h.setAccessCookie(w, accessToken)
	h.setRefreshCookie(w, rawRefresh)

	responder.JSON(w, http.StatusOK, map[string]string{"message": "refreshed"}, correlationID)
}
