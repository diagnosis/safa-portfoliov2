package authhandler

import (
	"net/http"
	"strings"

	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/safa-portfolio/internal/config"
	authstore "github.com/diagnosis/safa-portfolio/internal/store/auth"
)

type AuthHandler struct {
	cfg       *config.Config
	jwt       *secure.JWTSigner
	authStore authstore.AuthStore
}

func NewAuthHandler(
	cfg *config.Config,
	jwt *secure.JWTSigner,
	authStore authstore.AuthStore,
) *AuthHandler {
	return &AuthHandler{
		cfg:       cfg,
		jwt:       jwt,
		authStore: authStore,
	}
}

func (h *AuthHandler) AuthFunc(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			claims, err := h.jwt.VerifyAccess(parts[1])
			if err != nil {
				return "", err
			}
			return claims.Sub, nil
		}
	}

	cookie, err := r.Cookie("access_token")
	if err != nil {
		return "", err
	}

	claims, err := h.jwt.VerifyAccess(cookie.Value)
	if err != nil {
		return "", err
	}
	return claims.Sub, nil
}
