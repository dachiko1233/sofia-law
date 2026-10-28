// Package store persists newsletter subscribers in SQLite with a unique email.
package store

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "modernc.org/sqlite" // pure-Go SQLite driver (no cgo), registers "sqlite"
)

// Store is the subset of persistence the handlers depend on.
type Store interface {
	// AddSubscriber inserts an email. added is false when it already existed.
	AddSubscriber(email string) (added bool, err error)
	Close() error
}

type SQLiteStore struct {
	db *sql.DB
}

// NewSQLite opens (creating if needed) the database at path and migrates the schema.
func NewSQLite(path string) (*SQLiteStore, error) {
	if dir := filepath.Dir(path); dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return nil, fmt.Errorf("create db dir: %w", err)
		}
	}

	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	db.SetMaxOpenConns(1) // SQLite: serialise writers

	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS subscribers (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
			created_at DATETIME NOT NULL
		);
		CREATE TABLE IF NOT EXISTS users (
			id            INTEGER PRIMARY KEY AUTOINCREMENT,
			email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
			password_hash TEXT NOT NULL,
			name          TEXT NOT NULL DEFAULT '',
			surname       TEXT NOT NULL DEFAULT '',
			phone         TEXT NOT NULL DEFAULT '',
			created_at    DATETIME NOT NULL
		);
		CREATE TABLE IF NOT EXISTS documents (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id    INTEGER NOT NULL REFERENCES users(id),
			name       TEXT NOT NULL,
			mime       TEXT NOT NULL,
			size       INTEGER NOT NULL,
			data       BLOB NOT NULL,
			seen_at    DATETIME,
			created_at DATETIME NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
		CREATE TABLE IF NOT EXISTS comments (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			document_id INTEGER NOT NULL REFERENCES documents(id),
			body        TEXT NOT NULL,
			created_at  DATETIME NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_comments_document ON comments(document_id);
	`); err != nil {
		db.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}

	// Backfill columns on databases created before these fields existed.
	// ALTER TABLE ADD COLUMN is a no-op error ("duplicate column") once applied.
	for _, stmt := range []string{
		`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE users ADD COLUMN surname TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE documents ADD COLUMN seen_at DATETIME`,
	} {
		if _, err := db.Exec(stmt); err != nil && !strings.Contains(err.Error(), "duplicate column") {
			db.Close()
			return nil, fmt.Errorf("migrate alter: %w", err)
		}
	}

	return &SQLiteStore{db: db}, nil
}

// User is a registered portal account.
type User struct {
	ID           int64
	Email        string
	PasswordHash string
	Name         string
	Surname      string
	Phone        string
	CreatedAt    string
}

// Comment is an office note left on a document (admin-authored, append-only).
type Comment struct {
	ID        int64
	Body      string
	CreatedAt string
}

// Document is an uploaded file's metadata (bytes fetched separately). SeenAt is
// nil until the office marks it reviewed; Comments are ordered oldest-first.
type Document struct {
	ID        int64
	Name      string
	Mime      string
	Size      int64
	CreatedAt string
	SeenAt    *string
	Comments  []Comment
}

// Client is a user together with their uploaded documents, for the admin view.
type Client struct {
	User
	Documents []Document
}

// PortalStore is the persistence the client portal depends on. The existing
// Store interface is kept small so the newsletter/contact mocks stay valid;
// *SQLiteStore satisfies both.
type PortalStore interface {
	CreateUser(email, passwordHash, name, surname, phone string) (int64, error)
	GetUserByEmail(email string) (*User, error)
	AddDocument(userID int64, name, mime string, size int64, data []byte) (int64, error)
	ListDocuments(userID int64) ([]Document, error)
	GetDocument(userID, docID int64) (*Document, []byte, error)
	DeleteDocument(userID, docID int64) (bool, error)
}

// AdminStore is the persistence the office/admin view depends on.
type AdminStore interface {
	ListClients() ([]Client, error)
	AdminGetDocument(docID int64) (*Document, []byte, error)
	SetDocumentSeen(docID int64, seen bool) (bool, error)
	AddComment(docID int64, body string) (*Comment, error)
}

// ErrEmailTaken is returned when registering an email that already exists.
var ErrEmailTaken = fmt.Errorf("email already registered")

func (s *SQLiteStore) CreateUser(email, passwordHash, name, surname, phone string) (int64, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	res, err := s.db.Exec(
		`INSERT INTO users (email, password_hash, name, surname, phone, created_at)
		 VALUES (?, ?, ?, ?, ?, ?)
		 ON CONFLICT(email) DO NOTHING;`,
		email, passwordHash, name, surname, phone, time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return 0, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}
	if n == 0 {
		return 0, ErrEmailTaken
	}
	return res.LastInsertId()
}

func (s *SQLiteStore) GetUserByEmail(email string) (*User, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	row := s.db.QueryRow(
		`SELECT id, email, password_hash, name, surname, phone FROM users WHERE email = ?;`, email)
	var u User
	if err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.Name, &u.Surname, &u.Phone); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (s *SQLiteStore) AddDocument(userID int64, name, mime string, size int64, data []byte) (int64, error) {
	res, err := s.db.Exec(
		`INSERT INTO documents (user_id, name, mime, size, data, created_at)
		 VALUES (?, ?, ?, ?, ?, ?);`,
		userID, name, mime, size, data, time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// scanDocuments reads metadata rows (id, name, mime, size, seen_at, created_at)
// and attaches each document's comments in a single follow-up query.
func (s *SQLiteStore) scanDocuments(rows *sql.Rows) ([]Document, error) {
	defer rows.Close()
	docs := []Document{}
	for rows.Next() {
		var d Document
		if err := rows.Scan(&d.ID, &d.Name, &d.Mime, &d.Size, &d.SeenAt, &d.CreatedAt); err != nil {
			return nil, err
		}
		d.Comments = []Comment{}
		docs = append(docs, d)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	byID := make(map[int64]*Document, len(docs))
	for i := range docs {
		byID[docs[i].ID] = &docs[i]
	}
	for id := range byID {
		cs, err := s.commentsFor(id)
		if err != nil {
			return nil, err
		}
		byID[id].Comments = cs
	}
	return docs, nil
}

func (s *SQLiteStore) commentsFor(docID int64) ([]Comment, error) {
	rows, err := s.db.Query(
		`SELECT id, body, created_at FROM comments
		 WHERE document_id = ? ORDER BY created_at ASC, id ASC;`, docID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []Comment{}
	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.Body, &c.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

func (s *SQLiteStore) ListDocuments(userID int64) ([]Document, error) {
	rows, err := s.db.Query(
		`SELECT id, name, mime, size, seen_at, created_at FROM documents
		 WHERE user_id = ? ORDER BY created_at DESC, id DESC;`, userID)
	if err != nil {
		return nil, err
	}
	return s.scanDocuments(rows)
}

func (s *SQLiteStore) GetDocument(userID, docID int64) (*Document, []byte, error) {
	return s.getDocument(docID, &userID)
}

// AdminGetDocument fetches any document regardless of owner.
func (s *SQLiteStore) AdminGetDocument(docID int64) (*Document, []byte, error) {
	return s.getDocument(docID, nil)
}

// getDocument loads one document's bytes; when userID is non-nil the lookup is
// scoped to that owner (so clients can only read their own files).
func (s *SQLiteStore) getDocument(docID int64, userID *int64) (*Document, []byte, error) {
	var row *sql.Row
	if userID != nil {
		row = s.db.QueryRow(
			`SELECT id, name, mime, size, data, created_at FROM documents
			 WHERE id = ? AND user_id = ?;`, docID, *userID)
	} else {
		row = s.db.QueryRow(
			`SELECT id, name, mime, size, data, created_at FROM documents WHERE id = ?;`, docID)
	}
	var d Document
	var data []byte
	if err := row.Scan(&d.ID, &d.Name, &d.Mime, &d.Size, &data, &d.CreatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, nil
		}
		return nil, nil, err
	}
	return &d, data, nil
}

// DeleteDocument removes a document (and its comments) owned by userID.
// deleted is false when no such document exists for that owner.
func (s *SQLiteStore) DeleteDocument(userID, docID int64) (bool, error) {
	res, err := s.db.Exec(
		`DELETE FROM documents WHERE id = ? AND user_id = ?;`, docID, userID)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	if n == 0 {
		return false, nil
	}
	// Orphaned comments: best-effort cleanup, ignore error (document is gone).
	_, _ = s.db.Exec(`DELETE FROM comments WHERE document_id = ?;`, docID)
	return true, nil
}

// ListClients returns every user with their documents (newest first), for the
// admin dashboard. Users are ordered by most recent signup.
func (s *SQLiteStore) ListClients() ([]Client, error) {
	rows, err := s.db.Query(
		`SELECT id, email, name, surname, phone, created_at FROM users
		 ORDER BY created_at DESC, id DESC;`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	clients := []Client{}
	for rows.Next() {
		var c Client
		if err := rows.Scan(&c.ID, &c.Email, &c.Name, &c.Surname, &c.Phone, &c.CreatedAt); err != nil {
			return nil, err
		}
		clients = append(clients, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	for i := range clients {
		docs, err := s.ListDocuments(clients[i].ID)
		if err != nil {
			return nil, err
		}
		clients[i].Documents = docs
	}
	return clients, nil
}

// SetDocumentSeen marks (or unmarks) a document as reviewed by the office.
// ok is false when the document does not exist.
func (s *SQLiteStore) SetDocumentSeen(docID int64, seen bool) (bool, error) {
	var seenAt any
	if seen {
		seenAt = time.Now().UTC().Format(time.RFC3339)
	}
	res, err := s.db.Exec(`UPDATE documents SET seen_at = ? WHERE id = ?;`, seenAt, docID)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	return n > 0, err
}

// AddComment appends an office note to a document. Returns nil when the
// document does not exist.
func (s *SQLiteStore) AddComment(docID int64, body string) (*Comment, error) {
	var exists int
	if err := s.db.QueryRow(`SELECT 1 FROM documents WHERE id = ?;`, docID).Scan(&exists); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	now := time.Now().UTC().Format(time.RFC3339)
	res, err := s.db.Exec(
		`INSERT INTO comments (document_id, body, created_at) VALUES (?, ?, ?);`,
		docID, body, now)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	return &Comment{ID: id, Body: body, CreatedAt: now}, nil
}

func (s *SQLiteStore) AddSubscriber(email string) (bool, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	res, err := s.db.Exec(
		`INSERT INTO subscribers (email, created_at) VALUES (?, ?)
		 ON CONFLICT(email) DO NOTHING;`,
		email, time.Now().UTC().Format(time.RFC3339),
	)
	if err != nil {
		return false, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

func (s *SQLiteStore) Close() error {
	return s.db.Close()
}
