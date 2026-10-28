// Package server wires the Gin engine: middleware, API routes and (in
// production) static serving of the built frontend with SPA fallback.
package server

import (
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"polykarpoulaw/internal/config"
	"polykarpoulaw/internal/handlers"
	"polykarpoulaw/internal/middleware"
)

const (
	rateLimit  = 5
	rateWindow = 10 * time.Minute

	// Portal auth gets its own, more generous budget: logins and registration
	// must tolerate legitimate retries (password typos, re-login) without
	// sharing the small anti-spam quota used by the contact/newsletter forms.
	authRateLimit  = 15
	authRateWindow = 5 * time.Minute
)

// New builds the HTTP handler for the whole application.
func New(cfg config.Config, h *handlers.Handler, p *handlers.PortalHandler, a *handlers.AdminHandler, log *slog.Logger) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), middleware.Logger(log), middleware.CORS(cfg.AllowedOrigin))

	rl := middleware.NewRateLimiter(rateLimit, rateWindow)
	authRL := middleware.NewRateLimiter(authRateLimit, authRateWindow)

	api := r.Group("/api")
	{
		api.GET("/health", h.Health)

		limited := api.Group("")
		limited.Use(rl.Middleware())
		limited.POST("/contact", h.Contact)
		limited.POST("/newsletter", h.Newsletter)

		// Client portal: auth is rate-limited; document routes require a token.
		portal := api.Group("/portal")
		{
			portal.POST("/register", authRL.Middleware(), p.Register)
			portal.POST("/login", authRL.Middleware(), p.Login)

			secure := portal.Group("")
			secure.Use(p.Auth())
			secure.GET("/me", p.Me)
			secure.POST("/documents", p.Upload)
			secure.GET("/documents", p.List)
			secure.GET("/documents/:id", p.Download)
			secure.DELETE("/documents/:id", p.Delete)
		}

		// Office/admin review area: login is rate-limited; everything else
		// requires a valid admin token.
		admin := api.Group("/admin")
		{
			admin.POST("/login", authRL.Middleware(), a.Login)

			secure := admin.Group("")
			secure.Use(a.Auth())
			secure.GET("/clients", a.Clients)
			secure.GET("/documents/:id", a.Download)
			secure.POST("/documents/:id/seen", a.SetSeen)
			secure.POST("/documents/:id/comments", a.AddComment)
		}
	}

	if cfg.ServeFrontend {
		serveFrontend(r, cfg.FrontendDir)
	}

	return r
}

// serveFrontend serves files from dist, falling back to index.html for client
// routes. API 404s stay JSON.
func serveFrontend(r *gin.Engine, distDir string) {
	dist, err := filepath.Abs(distDir)
	if err != nil {
		dist = distDir
	}
	index := filepath.Join(dist, "index.html")

	r.NoRoute(func(c *gin.Context) {
		p := c.Request.URL.Path
		if strings.HasPrefix(p, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		}

		full := filepath.Join(dist, filepath.Clean(p))
		// Guard against path traversal outside the dist directory.
		if !strings.HasPrefix(full, dist) {
			c.Status(http.StatusForbidden)
			return
		}

		if fi, statErr := os.Stat(full); statErr == nil && !fi.IsDir() {
			c.File(full)
			return
		}
		c.File(index)
	})
}
