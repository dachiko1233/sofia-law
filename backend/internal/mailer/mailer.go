// Package mailer sends the contact enquiry to the office and a confirmation to
// the client, using the Resend API (https://resend.com). The Mailer interface
// lets handlers be tested without real network calls.
package mailer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"polykarpoulaw/internal/config"
	"polykarpoulaw/internal/validation"
)

const resendEndpoint = "https://api.resend.com/emails"

type Mailer interface {
	// SendContactEnquiry delivers the enquiry to the office inbox.
	SendContactEnquiry(c validation.ContactInput) error
	// SendContactConfirmation delivers a short acknowledgement to the client.
	SendContactConfirmation(c validation.ContactInput) error
}

// New returns a Resend-backed mailer when Resend is configured, otherwise a
// logging mailer so local development works without an API key.
func New(cfg config.Config, log *slog.Logger) Mailer {
	if cfg.ResendConfigured() {
		return &resendMailer{cfg: cfg, log: log, http: &http.Client{Timeout: 15 * time.Second}}
	}
	log.Warn("Resend not configured (need RESEND_API_KEY, MAIL_FROM, MAIL_TO) — emails will be logged, not sent")
	return &logMailer{log: log}
}

// languageName turns an i18n code (en/gr/ru) into a readable label for the email.
func languageName(code string) string {
	switch strings.ToLower(strings.TrimSpace(code)) {
	case "en":
		return "English"
	case "gr", "el":
		return "Greek"
	case "ru":
		return "Russian"
	case "":
		return "unknown"
	default:
		return code
	}
}

// ---- Resend implementation --------------------------------------------------

type resendMailer struct {
	cfg  config.Config
	log  *slog.Logger
	http *http.Client
}

// resendPayload is the JSON body for POST https://api.resend.com/emails.
type resendPayload struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	ReplyTo string   `json:"reply_to,omitempty"`
	Subject string   `json:"subject"`
	Text    string   `json:"text"`
}

func (m *resendMailer) send(p resendPayload) error {
	buf, err := json.Marshal(p)
	if err != nil {
		return err
	}
	req, err := http.NewRequest(http.MethodPost, resendEndpoint, bytes.NewReader(buf))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+m.cfg.ResendAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := m.http.Do(req)
	if err != nil {
		return fmt.Errorf("resend request failed: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(io.LimitReader(resp.Body, 8192))
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("resend returned HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	return nil
}

func (m *resendMailer) SendContactEnquiry(c validation.ContactInput) error {
	received := time.Now().Format("2006-01-02 15:04:05 MST")
	subject := fmt.Sprintf("New enquiry — %s (%s %s)", c.Area, c.FirstName, c.LastName)
	body := fmt.Sprintf(
		"New website enquiry\n\n"+
			"Name:      %s %s\n"+
			"Email:     %s\n"+
			"Phone:     %s\n"+
			"Area:      %s\n"+
			"Language:  %s\n"+
			"Received:  %s\n\n"+
			"Message:\n%s\n",
		c.FirstName, c.LastName, c.Email, c.Phone, c.Area,
		languageName(c.Language), received, c.Message,
	)

	// Reply-To is the visitor so the office can just hit "Reply".
	err := m.send(resendPayload{
		From:    m.cfg.MailFrom,
		To:      []string{m.cfg.MailTo},
		ReplyTo: c.Email,
		Subject: subject,
		Text:    body,
	})
	if err == nil {
		m.log.Info("contact enquiry sent", "to", m.cfg.MailTo, "replyTo", c.Email, "area", c.Area)
	}
	return err
}

func (m *resendMailer) SendContactConfirmation(c validation.ContactInput) error {
	// Before the sending domain is verified, Resend only delivers to your own
	// address, so a confirmation to the visitor would bounce. Skip it until
	// DOMAIN_VERIFIED=true.
	if !m.cfg.DomainVerified {
		m.log.Info("confirmation skipped — domain not verified (set DOMAIN_VERIFIED=true once verified in Resend)",
			"to", c.Email)
		return nil
	}

	subject := "Thank you — we received your enquiry"
	body := fmt.Sprintf(
		"Dear %s,\n\n"+
			"Thank you for contacting Polykarpou Law. We have received your enquiry "+
			"and will reply within one business day.\n\n"+
			"For reference, this is a copy of your message:\n%s\n\n"+
			"Kind regards,\nPolykarpou Law\nLimassol, Cyprus\n",
		c.FirstName, c.Message,
	)
	return m.send(resendPayload{
		From:    m.cfg.MailFrom,
		To:      []string{c.Email},
		Subject: subject,
		Text:    body,
	})
}

// ---- Logging fallback (no API key) ------------------------------------------

type logMailer struct {
	log *slog.Logger
}

func (m *logMailer) SendContactEnquiry(c validation.ContactInput) error {
	m.log.Info("contact enquiry (NOT sent — Resend not configured)",
		"name", c.FirstName+" "+c.LastName,
		"email", c.Email,
		"phone", c.Phone,
		"area", c.Area,
		"language", languageName(c.Language),
		"message", c.Message,
	)
	return nil
}

func (m *logMailer) SendContactConfirmation(c validation.ContactInput) error {
	m.log.Info("contact confirmation (NOT sent — Resend not configured)", "to", c.Email)
	return nil
}
