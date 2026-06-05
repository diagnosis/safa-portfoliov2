package authhandler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/go-toolkit/validator"
)

type verifyRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

func (h *AuthHandler) HandleVerify(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req verifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		responder.Error(w, errors.BadRequest("invalid body", "failed to decode body"), correlationID)
		return
	}

	v := validator.New()
	v.Required("email", req.Email)
	v.Required("code", req.Code)
	if err := v.Errors(); err != nil {
		responder.Error(w, err, correlationID)
		return
	}

	authCode, err := h.authStore.GetValidationCode(ctx, req.Email)
	if err != nil {
		responder.Error(w, errors.Unauthorized("invalid or expired code", "code lookup failed"), correlationID)
		return
	}

	if !secure.VerifyOTP(req.Code, authCode.CodeHash) {
		responder.Error(w, errors.Unauthorized("invalid or expired code", "otp mismatch"), correlationID)
		return
	}

	if err := h.authStore.MarkCodeUsed(ctx, authCode.ID); err != nil {
		logger.Error(ctx, "failed to mark code used", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to mark code used"), correlationID)
		return
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

	responder.JSON(w, http.StatusOK, map[string]string{
		"message": "authenticated",
	}, correlationID)

}
