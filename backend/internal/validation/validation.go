// Package validation holds request validation rules shared by the handlers.
// It is deliberately free of Gin/HTTP types so it can be unit-tested directly.
package validation

import (
	"regexp"
	"strings"
)

// Field length limits (runes).
const (
	MaxName    = 100
	MaxEmail   = 254
	MaxPhone   = 40
	MaxArea    = 60
	MaxMessage = 5000
)

var emailRe = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// FieldErrors maps a field name to a short, machine-readable error code.
type FieldErrors map[string]string

func (f FieldErrors) Empty() bool { return len(f) == 0 }

// ValidEmail performs an RFC-lite format and length check.
func ValidEmail(s string) bool {
	s = strings.TrimSpace(s)
	return len([]rune(s)) <= MaxEmail && emailRe.MatchString(s)
}

// ContactInput is the validated shape of a contact enquiry.
type ContactInput struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Area      string `json:"area"`
	Message   string `json:"message"`
	Consent   bool   `json:"consent"`
	// Company is a honeypot: it must stay empty for genuine submissions.
	Company string `json:"company"`
}

func required(v string) bool { return strings.TrimSpace(v) != "" }

func tooLong(v string, max int) bool { return len([]rune(v)) > max }

// Validate returns a map of field → error code. Empty means valid.
func (c ContactInput) Validate() FieldErrors {
	errs := FieldErrors{}

	if !required(c.FirstName) {
		errs["firstName"] = "required"
	} else if tooLong(c.FirstName, MaxName) {
		errs["firstName"] = "too_long"
	}

	if !required(c.LastName) {
		errs["lastName"] = "required"
	} else if tooLong(c.LastName, MaxName) {
		errs["lastName"] = "too_long"
	}

	if !required(c.Email) {
		errs["email"] = "required"
	} else if !ValidEmail(c.Email) {
		errs["email"] = "invalid"
	}

	if tooLong(c.Phone, MaxPhone) {
		errs["phone"] = "too_long"
	}

	if !required(c.Area) {
		errs["area"] = "required"
	} else if tooLong(c.Area, MaxArea) {
		errs["area"] = "too_long"
	}

	if !required(c.Message) {
		errs["message"] = "required"
	} else if tooLong(c.Message, MaxMessage) {
		errs["message"] = "too_long"
	}

	if !c.Consent {
		errs["consent"] = "required"
	}

	return errs
}

// NewsletterInput is the validated shape of a newsletter subscription.
type NewsletterInput struct {
	Email string `json:"email"`
	// Company is a honeypot: it must stay empty for genuine submissions.
	Company string `json:"company"`
}

// Validate returns a map of field → error code. Empty means valid.
func (n NewsletterInput) Validate() FieldErrors {
	errs := FieldErrors{}
	if !required(n.Email) {
		errs["email"] = "required"
	} else if !ValidEmail(n.Email) {
		errs["email"] = "invalid"
	}
	return errs
}
