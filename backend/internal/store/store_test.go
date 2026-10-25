package store

import (
	"path/filepath"
	"testing"
)

func TestSQLiteStore_AddAndDedupe(t *testing.T) {
	path := filepath.Join(t.TempDir(), "test.db")
	s, err := NewSQLite(path)
	if err != nil {
		t.Fatalf("NewSQLite: %v", err)
	}
	defer s.Close()

	added, err := s.AddSubscriber("a@example.com")
	if err != nil || !added {
		t.Fatalf("first add: added=%v err=%v", added, err)
	}

	// Duplicate (case-insensitive, trimmed) must not be added again.
	added, err = s.AddSubscriber("  A@Example.com ")
	if err != nil {
		t.Fatalf("duplicate add err: %v", err)
	}
	if added {
		t.Fatal("duplicate email should not be added")
	}

	added, err = s.AddSubscriber("b@example.com")
	if err != nil || !added {
		t.Fatalf("second distinct add: added=%v err=%v", added, err)
	}
}

func TestSQLiteStore_CreatesDir(t *testing.T) {
	path := filepath.Join(t.TempDir(), "nested", "dir", "test.db")
	s, err := NewSQLite(path)
	if err != nil {
		t.Fatalf("should create nested dir: %v", err)
	}
	s.Close()
}
