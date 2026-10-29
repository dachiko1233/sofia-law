package handlers

import (
	"errors"
	"io"
	"log/slog"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"polykarpoulaw/internal/auth"
	"polykarpoulaw/internal/store"
)

// MaxUploadBytes is the per-file upload limit (10 MB).
const MaxUploadBytes = 10 << 20

var emailRe = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

// PortalHandler serves the authenticated client portal (accounts + documents).
type PortalHandler struct {
	store  store.PortalStore
	secret string
	log    *slog.Logger
}

func NewPortal(s store.PortalStore, secret string, log *slog.Logger) *PortalHandler {
	return &PortalHandler{store: s, secret: secret, log: log}
}

type credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type registration struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Phone    string `json:"phone"`
}

// phoneRe accepts digits, spaces and common separators, 6–20 chars.
var phoneRe = regexp.MustCompile(`^[0-9+()\-.\s]{6,20}$`)

// Register creates a new account and returns a session token. Name, surname and
// phone are mandatory so the office knows who a request comes from.
func (h *PortalHandler) Register(c *gin.Context) {
	var in registration
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	in.Name = strings.TrimSpace(in.Name)
	in.Surname = strings.TrimSpace(in.Surname)
	in.Phone = strings.TrimSpace(in.Phone)

	if !emailRe.MatchString(in.Email) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "invalid_email"})
		return
	}
	if len(in.Password) < 8 {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "weak_password"})
		return
	}
	if in.Name == "" || in.Surname == "" {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "missing_name"})
		return
	}
	if len(in.Name) > 100 || len(in.Surname) > 100 {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "missing_name"})
		return
	}
	if !phoneRe.MatchString(in.Phone) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "invalid_phone"})
		return
	}

	hash, err := auth.HashPassword(in.Password)
	if err != nil {
		h.log.Error("hash password failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}

	id, err := h.store.CreateUser(in.Email, hash, in.Name, in.Surname, in.Phone)
	if errors.Is(err, store.ErrEmailTaken) {
		c.JSON(http.StatusConflict, gin.H{"error": "email_taken"})
		return
	}
	if err != nil {
		h.log.Error("create user failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}

	h.log.Info("portal account created", "user", id)
	c.JSON(http.StatusOK, gin.H{"token": auth.Token(h.secret, id), "email": in.Email})
}

// Login verifies credentials and returns a session token.
func (h *PortalHandler) Login(c *gin.Context) {
	var in credentials
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_json"})
		return
	}
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))

	u, err := h.store.GetUserByEmail(in.Email)
	if err != nil {
		h.log.Error("lookup user failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	// Same response whether the email is unknown or the password is wrong.
	if u == nil || !auth.CheckPassword(u.PasswordHash, in.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": auth.Token(h.secret, u.ID), "email": u.Email})
}

// Auth is middleware that validates the Bearer token and sets "uid" in context.
func (h *PortalHandler) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authz := c.GetHeader("Authorization")
		token := strings.TrimPrefix(authz, "Bearer ")
		if token == authz || token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		uid, err := auth.Verify(h.secret, token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Set("uid", uid)
		c.Next()
	}
}

func uidFrom(c *gin.Context) int64 {
	v, _ := c.Get("uid")
	id, _ := v.(int64)
	return id
}

// Me returns the authenticated user's profile (used to greet them and confirm
// a valid session).
func (h *PortalHandler) Me(c *gin.Context) {
	u, err := h.store.GetUserByID(uidFrom(c))
	if err != nil {
		h.log.Error("lookup profile failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if u == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"uid": u.ID, "email": u.Email, "name": u.Name, "surname": u.Surname, "phone": u.Phone,
	})
}

// Upload stores a single file for the authenticated user.
func (h *PortalHandler) Upload(c *gin.Context) {
	uid := uidFrom(c)

	// Allow headroom above the file limit for the multipart envelope (boundary,
	// field headers) so a legitimate near-limit file isn't rejected by the body
	// reader. The real per-file cap is enforced by the fileHeader.Size check
	// below. Anything past this hard ceiling trips MaxBytesReader inside
	// FormFile; we detect that and report "too large" rather than "no file".
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadBytes+1<<20)
	fileHeader, err := c.FormFile("file")
	if err != nil {
		var maxErr *http.MaxBytesError
		if errors.As(err, &maxErr) {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file_too_large"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "no_file"})
		return
	}
	if fileHeader.Size > MaxUploadBytes {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file_too_large"})
		return
	}

	f, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_file"})
		return
	}
	defer f.Close()
	data, err := io.ReadAll(io.LimitReader(f, MaxUploadBytes+1))
	if err != nil || int64(len(data)) > MaxUploadBytes {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "file_too_large"})
		return
	}

	name := sanitizeName(fileHeader.Filename)
	mime := fileHeader.Header.Get("Content-Type")
	if mime == "" {
		mime = "application/octet-stream"
	}

	id, err := h.store.AddDocument(uid, name, mime, int64(len(data)), data)
	if err != nil {
		h.log.Error("store document failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	h.log.Info("portal document uploaded", "user", uid, "doc", id, "bytes", len(data))
	c.JSON(http.StatusOK, gin.H{"id": id, "name": name, "mime": mime, "size": len(data)})
}

// List returns the authenticated user's document metadata, including whether
// the office has seen each file and any office comments.
func (h *PortalHandler) List(c *gin.Context) {
	docs, err := h.store.ListDocuments(uidFrom(c))
	if err != nil {
		h.log.Error("list documents failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"documents": DocumentsJSON(docs)})
}

// Delete removes one of the authenticated user's documents.
func (h *PortalHandler) Delete(c *gin.Context) {
	docID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_id"})
		return
	}
	deleted, err := h.store.DeleteDocument(uidFrom(c), docID)
	if err != nil {
		h.log.Error("delete document failed", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// DocumentJSON serialises a document's metadata (seen status + comments) for
// both the client and admin APIs.
func DocumentJSON(d store.Document) gin.H {
	comments := make([]gin.H, 0, len(d.Comments))
	for _, cm := range d.Comments {
		comments = append(comments, gin.H{"id": cm.ID, "body": cm.Body, "createdAt": cm.CreatedAt})
	}
	return gin.H{
		"id": d.ID, "name": d.Name, "mime": d.Mime, "size": d.Size,
		"createdAt": d.CreatedAt, "seenAt": d.SeenAt, "comments": comments,
	}
}

// DocumentsJSON serialises a slice of documents.
func DocumentsJSON(docs []store.Document) []gin.H {
	out := make([]gin.H, 0, len(docs))
	for _, d := range docs {
		out = append(out, DocumentJSON(d))
	}
	return out
}

// Download streams a document back to its owner.
func (h *PortalHandler) Download(c *gin.Context) {
	docID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad_id"})
		return
	}
	doc, data, err := h.store.GetDocument(uidFrom(c), docID)
	if err != nil {
		h.log.Error("get document failed", "error", err)
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

// sanitizeName strips path components and keeps a reasonable filename.
func sanitizeName(name string) string {
	name = strings.ReplaceAll(name, "\\", "/")
	if i := strings.LastIndex(name, "/"); i >= 0 {
		name = name[i+1:]
	}
	name = strings.TrimSpace(name)
	if name == "" {
		name = "file"
	}
	if len(name) > 200 {
		name = name[len(name)-200:]
	}
	return name
}
