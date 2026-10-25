// Package config loads all runtime configuration from environment variables.
// No secrets are ever hard-coded; see .env.example at the repo root.
package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port          string
	SMTPHost      string
	SMTPPort      int
	SMTPUser      string
	SMTPPass      string
	MailFrom      string
	MailTo        string
	AllowedOrigin string
	DBPath        string

	// ServeFrontend controls whether Gin also serves frontend/dist (production).
	ServeFrontend bool
	FrontendDir   string
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// Load reads configuration from the environment, applying sensible dev defaults.
func Load() Config {
	port := getenv("SMTP_PORT", "587")
	smtpPort, err := strconv.Atoi(port)
	if err != nil {
		smtpPort = 587
	}

	return Config{
		Port:          getenv("PORT", "8080"),
		SMTPHost:      os.Getenv("SMTP_HOST"),
		SMTPPort:      smtpPort,
		SMTPUser:      os.Getenv("SMTP_USER"),
		SMTPPass:      os.Getenv("SMTP_PASS"),
		MailFrom:      os.Getenv("MAIL_FROM"),
		MailTo:        os.Getenv("MAIL_TO"),
		AllowedOrigin: getenv("ALLOWED_ORIGIN", "http://localhost:5173"),
		DBPath:        getenv("DB_PATH", "./data/polykarpou.db"),
		ServeFrontend: os.Getenv("SERVE_FRONTEND") == "true",
		FrontendDir:   getenv("FRONTEND_DIR", "../frontend/dist"),
	}
}

// SMTPConfigured reports whether enough SMTP settings exist to actually send mail.
func (c Config) SMTPConfigured() bool {
	return c.SMTPHost != "" && c.MailFrom != "" && c.MailTo != ""
}
