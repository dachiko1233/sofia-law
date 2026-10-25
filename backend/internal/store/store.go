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
	`); err != nil {
		db.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}

	return &SQLiteStore{db: db}, nil
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
