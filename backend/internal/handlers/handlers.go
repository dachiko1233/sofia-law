// Package handlers implements the JSON API endpoints.
package handlers

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"polykarpoulaw/internal/mailer"
	"polykarpoulaw/internal/store"
	"polykarpoulaw/internal/validation"
)

type Handler struct {
	mailer mailer.Mailer
	store  store.Store
	log    *slog.Logger
}

func New(m mailer.Mailer, s store.Store, log *slog.Logger) *Handler {
	return &Handler{mailer: m, store: s, log: log}
}

// Health is a simple liveness probe.
func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Contact validates a contact enquiry, emails the office and confirms to the client.
func (h *Handler) Contact(c *gin.Context) {
	var in validation.ContactInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	// Honeypot: pretend success so bots get no signal, but do nothing.
	if in.Company != "" {
		h.log.Warn("contact honeypot triggered", "ip", c.ClientIP())
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
		return
	}

	if errs := in.Validate(); !errs.Empty() {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":  "validation_failed",
			"fields": errs,
		})
		return
	}

	if err := h.mailer.SendContactEnquiry(in); err != nil {
		h.log.Error("send enquiry failed", "error", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "mail_failed"})
		return
	}

	// Confirmation to the client is best-effort — don't fail the request on it.
	if err := h.mailer.SendContactConfirmation(in); err != nil {
		h.log.Warn("send confirmation failed", "error", err)
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Newsletter validates and stores a subscriber, avoiding duplicates.
func (h *Handler) Newsletter(c *gin.Context) {
	var in validation.NewsletterInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}

	if in.Company != "" {
		h.log.Warn("newsletter honeypot triggered", "ip", c.ClientIP())
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
		return
	}

	if errs := in.Validate(); !errs.Empty() {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":  "validation_failed",
			"fields": errs,
		})
		return
	}

	added, err := h.store.AddSubscriber(in.Email)
	if err != nil {
		h.log.Error("store subscriber failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "store_failed"})
		return
	}

	// Idempotent: a duplicate is still a success from the user's perspective.
	h.log.Info("newsletter subscribe", "added", added)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
