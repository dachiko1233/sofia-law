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
)

// New builds the HTTP handler for the whole application.
func New(cfg config.Config, h *handlers.Handler, log *slog.Logger) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), middleware.Logger(log), middleware.CORS(cfg.AllowedOrigin))

	rl := middleware.NewRateLimiter(rateLimit, rateWindow)

	api := r.Group("/api")
	{
		api.GET("/health", h.Health)

		limited := api.Group("")
		limited.Use(rl.Middleware())
		limited.POST("/contact", h.Contact)
		limited.POST("/newsletter", h.Newsletter)
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
