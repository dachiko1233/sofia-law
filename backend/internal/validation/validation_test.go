package validation

import (
	"strings"
	"testing"
)

func validContact() ContactInput {
	return ContactInput{
		FirstName: "Sofia",
		LastName:  "Polykarpou",
		Email:     "sofia@example.com",
		Phone:     "+357 00 000000",
		Area:      "Corporate",
		Message:   "Please advise on forming a company.",
		Consent:   true,
	}
}

func TestValidEmail(t *testing.T) {
	cases := map[string]bool{
		"a@b.co":                            true,
		"  trim@example.com  ":              true,
		"":                                  false,
		"no-at":                             false,
		"missing@domain":                    false,
		"spaces in@email.com":               false,
		strings.Repeat("a", 260) + "@x.com": false, // too long
	}
	for in, want := range cases {
		if got := ValidEmail(in); got != want {
			t.Errorf("ValidEmail(%q) = %v, want %v", in, got, want)
		}
	}
}

func TestContactValidate_OK(t *testing.T) {
	if errs := validContact().Validate(); !errs.Empty() {
		t.Fatalf("expected no errors, got %v", errs)
	}
}

func TestContactValidate_Required(t *testing.T) {
	errs := ContactInput{}.Validate()
	for _, f := range []string{"firstName", "lastName", "email", "area", "message", "consent"} {
		if _, ok := errs[f]; !ok {
			t.Errorf("expected error for %q, got %v", f, errs)
		}
	}
}

func TestContactValidate_ConsentRequired(t *testing.T) {
	c := validContact()
	c.Consent = false
	errs := c.Validate()
	if errs["consent"] != "required" {
		t.Errorf("expected consent required, got %v", errs)
	}
	if len(errs) != 1 {
		t.Errorf("expected only consent error, got %v", errs)
	}
}

func TestContactValidate_TooLong(t *testing.T) {
	c := validContact()
	c.Message = strings.Repeat("x", MaxMessage+1)
	if errs := c.Validate(); errs["message"] != "too_long" {
		t.Errorf("expected message too_long, got %v", errs)
	}
}

func TestContactValidate_BadEmail(t *testing.T) {
	c := validContact()
	c.Email = "not-an-email"
	if errs := c.Validate(); errs["email"] != "invalid" {
		t.Errorf("expected email invalid, got %v", errs)
	}
}

func TestNewsletterValidate(t *testing.T) {
	if errs := (NewsletterInput{Email: "a@b.co"}).Validate(); !errs.Empty() {
		t.Errorf("expected valid, got %v", errs)
	}
	if errs := (NewsletterInput{Email: ""}).Validate(); errs["email"] != "required" {
		t.Errorf("expected required, got %v", errs)
	}
	if errs := (NewsletterInput{Email: "bad"}).Validate(); errs["email"] != "invalid" {
		t.Errorf("expected invalid, got %v", errs)
	}
}
