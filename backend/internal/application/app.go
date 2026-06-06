package application

import (
	"context"
	"fmt"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/safa-portfolio/internal/config"
	"github.com/diagnosis/safa-portfolio/internal/database"
	authhandler "github.com/diagnosis/safa-portfolio/internal/handlers/auth"
	bloghandler "github.com/diagnosis/safa-portfolio/internal/handlers/blog"
	projecthandler "github.com/diagnosis/safa-portfolio/internal/handlers/project"
	uploadhandler "github.com/diagnosis/safa-portfolio/internal/handlers/upload"
	authstore "github.com/diagnosis/safa-portfolio/internal/store/auth"
	blogstore "github.com/diagnosis/safa-portfolio/internal/store/blog"
	projectstore "github.com/diagnosis/safa-portfolio/internal/store/project"
)

type Application struct {
	//
	jwt *secure.JWTSigner
	cfg *config.Config
	//stores
	authStore    authstore.AuthStore
	projectStore projectstore.ProjectStore
	blogStore    blogstore.BlogStore
	//handlers
	authHandler    *authhandler.AuthHandler
	projectHandler *projecthandler.ProjectHandler
	blogHandler    *bloghandler.BlogHandler
	uploadHandler  *uploadhandler.UploadHandler
}

func NewApplication() (*Application, error) {
	ctx := context.Background()
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %w", err)
	}

	logger.Init()
	pool, err := database.OpenPool(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to connect db: %w", err)
	}
	jwtConfig := secure.JWTConfig{
		AccessSecret:       cfg.JWT.AccessSecret,
		RefreshSecret:      cfg.JWT.RefreshSecret,
		AccessTokenExpiry:  cfg.JWT.AccessTokenExpiry,
		RefreshTokenExpiry: cfg.JWT.RefreshTokenExpiry,
		Issuer:             cfg.JWT.Issuer,
		Audience:           cfg.JWT.Audience,
		Leeway:             0, //default 30s
	}
	jwt, err := secure.NewJWTSigner(jwtConfig)
	if err != nil {
		logger.Fatal(ctx, "failed to set admin jwt signer", "err", err)
	}

	//stores
	authStore := authstore.NewPGAuthStore(pool)
	projectStore := projectstore.NewPGProjectStore(pool)
	blogStore := blogstore.NewPGBlogStore(pool)
	//handlers
	authHandler := authhandler.NewAuthHandler(cfg, jwt, authStore)
	projectHandler := projecthandler.NewProjectHandler(projectStore)
	blogHandler := bloghandler.NewBlogHandler(blogStore)
	uploadHandler := uploadhandler.NewUploadHandler(cfg)
	return &Application{
		jwt:          jwt,
		cfg:          cfg,
		authStore:    authStore,
		projectStore: projectStore,
		blogStore:    blogStore,

		authHandler:    authHandler,
		projectHandler: projectHandler,
		blogHandler:    blogHandler,
		uploadHandler:  uploadHandler,
	}, nil
}

func (a *Application) Port() string {
	return a.cfg.App.Port
}
