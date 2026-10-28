package handlers

import (
	"crypto/subtle"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"polykarpoulaw/internal/auth"
	"polykarpoulaw/internal/store"
)

// MaxCommentBytes caps the length of a single office comment.
const MaxCommentBytes = 4000

// AdminHandler serves the office/admin view: it lists every client with their
// uploads and lets the office mark files seen and leave comments. There is a
// single admin identity, configured via ADMIN_EMAIL / ADMIN_PASSWORD.
type AdminHandler struct {
	store    store.AdminStore
	email    string
	password string
	secret   string
	log      *slog.Logger
}

func NewAdmin(s store.AdminStore, email, password, secret string, log *slog.Logger) *AdminHandler {
	return &AdminHandler{
		store:    s,
		email:    strings.ToLower(strings.TrimSpace(email)),
		password: password,
		secret:   secret,
		log:      log,
	}
}

// Enabled reports whether admin credentials are configured.
func (h *AdminHandler) Enabled() bool {
	return h.email != "" && h.password != ""
}

// Login verifies the configured admin credentials and returns a session token.
func (h *AdminHandler) Login(c *gin.Context) {
	if !h.Enabled() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "admin_disabled"})
		return
	}
	var in credentials
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	email := strings.ToLower(strings.TrimSpace(in.Email))
	// Constant-time compare on both fields to avoid leaking which one is wrong.
	emailOK := subtle.ConstantTimeCompare([]byte(email), []byte(h.email)) == 1
	passOK := subtle.ConstantTimeCompare([]byte(in.Password), []byte(h.password)) == 1
	if !emailOK || !passOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": auth.AdminToken(h.secret)})
}

// Auth is middleware that validates the admin Bearer token.
func (h *AdminHandler) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authz := c.GetHeader("Authorization")
		token := strings.TrimPrefix(authz, "Bearer ")
		if token == authz || token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		if err := auth.VerifyAdmin(h.secret, token); err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Next()
	}
}

// Clients returns every client with their documents, seen status and comments.
func (h *AdminHandler) Clients(c *gin.Context) {
	clients, err := h.store.ListClients()
	if err != nil {
		h.log.Error("admin list clients failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	out := make([]gin.H, 0, len(clients))
	for _, cl := range clients {
		out = append(out, gin.H{
			"id":        cl.ID,
			"email":     cl.Email,
			"name":      cl.Name,
			"surname":   cl.Surname,
			"phone":     cl.Phone,
			"createdAt": cl.CreatedAt,
			"documents": DocumentsJSON(cl.Documents),
		})
	}
	c.JSON(http.StatusOK, gin.H{"clients": out})
}

// Download streams any client's document back to the office.
func (h *AdminHandler) Download(c *gin.Context) {
	docID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_id"})
		return
	}
	doc, data, err := h.store.AdminGetDocument(docID)
	if err != nil {
		h.log.Error("admin get document failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if doc == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
		return
	}
	c.Header("Content-Disposition", "attachment; filename=\""+doc.Name+"\"")
	c.Data(http.StatusOK, doc.Mime, data)
}

type seenInput struct {
	Seen bool `json:"seen"`
}

// SetSeen marks a document as seen (or not) by the office.
func (h *AdminHandler) SetSeen(c *gin.Context) {
	docID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_id"})
		return
	}
	var in seenInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	ok, err := h.store.SetDocumentSeen(docID, in.Seen)
	if err != nil {
		h.log.Error("admin set seen failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"seen": in.Seen})
}

type commentInput struct {
	Body string `json:"body"`
}

// AddComment appends an office comment to a document.
func (h *AdminHandler) AddComment(c *gin.Context) {
	docID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_id"})
		return
	}
	var in commentInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	in.Body = strings.TrimSpace(in.Body)
	if in.Body == "" {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "empty_comment"})
		return
	}
	if len(in.Body) > MaxCommentBytes {
		in.Body = in.Body[:MaxCommentBytes]
	}
	cm, err := h.store.AddComment(docID, in.Body)
	if err != nil {
		h.log.Error("admin add comment failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if cm == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": cm.ID, "body": cm.Body, "createdAt": cm.CreatedAt})
}
