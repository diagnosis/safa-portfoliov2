package authhandler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/mailer"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/go-toolkit/validator"
)

type loginRequest struct {
	Email string `json:"email"`
}

func (h *AuthHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		responder.Error(w, errors.BadRequest("invalid body", "failed to decode body"), correlationID)
		return
	}

	v := validator.New()
	v.Required("email", req.Email)
	v.Email("email", req.Email)
	if verr := v.Errors(); verr != nil {
		responder.Error(w, verr, correlationID)
		return
	}

	if req.Email != h.cfg.Admin.Email {
		logger.Warn(ctx, "wrong email attempt detected")
		responder.JSON(w, http.StatusOK, map[string]string{
			"message": "if that email is registered, a code has been sent",
		}, correlationID)
		return
	}

	code, err := secure.GenerateOTP()
	if err != nil {
		logger.Error(ctx, "failed to generate otp", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to generate otp"), correlationID)
		return
	}
	codeHash := secure.HashOTP(code)

	if err := h.authStore.CreateCode(ctx, req.Email, codeHash, time.Now().Add(10*time.Minute)); err != nil {
		logger.Error(ctx, "failed to save code", "err", err)
		responder.Error(w, errors.Internal("something went wrong", "failed to save code"), correlationID)
		return
	}

	m := mailer.NewResendMailer(
		h.cfg.Resend.APIKey,
		h.cfg.Resend.FromEmail,
	)
	body := `<h2>Your login code</h2><p style="font-size:32px;letter-spacing:8px;"><strong>` + code + `</strong></p><p>Expires in 10 minutes.</p>`
	if err := m.Send([]string{req.Email}, "Portfolio Admin Login Code", body); err != nil {
		logger.Error(ctx, "failed to send email", "err", err)
		responder.Error(w, errors.Internal("failed to send email", "zepto send failed"), correlationID)
		return
	}

	logger.Info(ctx, "login code sent", "email", req.Email)
	responder.JSON(w, http.StatusOK, map[string]string{
		"message": "if that email is registered, a code has been sent",
	}, correlationID)

}
