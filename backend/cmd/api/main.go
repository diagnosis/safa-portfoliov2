package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/safa-portfolio/internal/application"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file, reading from environment")
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	app, err := application.NewApplication()
	if err != nil {
		logger.Error(ctx, "failed to start application", "err", err)
		os.Exit(1)
	}

	r := application.SetupRoutes(app)

	server := &http.Server{
		Addr:              fmt.Sprintf(":%s", "8080"),
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
		WriteTimeout:      0,
		IdleTimeout:       120 * time.Second,
	}

	go func() {
		logger.Info(ctx, "server starting", "addr", server.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error(ctx, "server error", "err", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit

	logger.Info(ctx, "shutdown signal received", "signal", sig)

	shutdownCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error(ctx, "graceful shutdown failed", "err", err)
		os.Exit(1)
	}

	logger.Info(ctx, "server stopped gracefully")
}
