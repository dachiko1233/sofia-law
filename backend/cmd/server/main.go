// Command server runs the Polykarpou Law API (and, in production, serves the
// built frontend). Configuration comes entirely from environment variables.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"polykarpoulaw/internal/config"
	"polykarpoulaw/internal/handlers"
	"polykarpoulaw/internal/mailer"
	"polykarpoulaw/internal/server"
	"polykarpoulaw/internal/store"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

	// Load a local .env for development (repo root or backend/). Real env vars
	// always take precedence and are the norm in production.
	config.LoadEnvFile(".env", "../.env")

	cfg := config.Load()

	db, err := store.NewSQLite(cfg.DBPath)
	if err != nil {
		log.Error("failed to open database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	mail := mailer.New(cfg, log)
	h := handlers.New(mail, db, log)
	portal := handlers.NewPortal(db, cfg.SessionSecret, log)
	admin := handlers.NewAdmin(db, cfg.AdminEmail, cfg.AdminPassword, cfg.SessionSecret, log)
	router := server.New(cfg, h, portal, admin, log)

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
	}

	// Run the server in the background so we can wait for a shutdown signal.
	go func() {
		log.Info("server listening", "port", cfg.Port, "serveFrontend", cfg.ServeFrontend)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	// Graceful shutdown on SIGINT/SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info("shutting down…")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Error("graceful shutdown failed", "error", err)
	}
	log.Info("server stopped")
}
