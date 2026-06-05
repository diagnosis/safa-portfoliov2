package authhandler

import (
	"net/http"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
)

func (h *AuthHandler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	if err := h.authStore.DeleteAllRefreshTokens(ctx); err != nil {
		logger.Warn(ctx, "failed to delete refresh tokens on logout", "err", err)
	}

	h.clearAccessCookie(w)
	h.clearRefreshCookie(w)

	responder.JSON(w, http.StatusOK, map[string]string{"message": "logged out"}, correlationID)
}
