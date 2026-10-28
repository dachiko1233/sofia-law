// Package config loads all runtime configuration from environment variables.
// No secrets are ever hard-coded; see .env.example at the repo root.
package config

import "os"

type Config struct {
	Port string

	// Email is sent via the Resend API (https://resend.com).
	ResendAPIKey string
	MailFrom     string
	MailTo       string
	// DomainVerified gates the visitor confirmation email. Until the sending
	// domain is verified in Resend, Resend only delivers to your own address,
	// so confirmations to visitors are skipped. Set DOMAIN_VERIFIED=true once
	// your domain is verified.
	DomainVerified bool

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
	return Config{
		Port:           getenv("PORT", "8080"),
		ResendAPIKey:   os.Getenv("RESEND_API_KEY"),
		MailFrom:       os.Getenv("MAIL_FROM"),
		MailTo:         os.Getenv("MAIL_TO"),
		DomainVerified: os.Getenv("DOMAIN_VERIFIED") == "true",
		AllowedOrigin:  getenv("ALLOWED_ORIGIN", "http://localhost:5173"),
		DBPath:         getenv("DB_PATH", "./data/polykarpou.db"),
		ServeFrontend:  os.Getenv("SERVE_FRONTEND") == "true",
		FrontendDir:    getenv("FRONTEND_DIR", "../frontend/dist"),
	}
}

// ResendConfigured reports whether enough settings exist to actually send mail.
func (c Config) ResendConfigured() bool {
	return c.ResendAPIKey != "" && c.MailFrom != "" && c.MailTo != ""
}
