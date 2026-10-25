// Package mailer sends the contact enquiry to the office and a confirmation to
// the client. The Mailer interface lets handlers be tested without real SMTP.
package mailer

import (
	"fmt"
	"log/slog"
	"net/smtp"
	"strings"

	"polykarpoulaw/internal/config"
	"polykarpoulaw/internal/validation"
)

type Mailer interface {
	// SendContactEnquiry delivers the enquiry to the office inbox.
	SendContactEnquiry(c validation.ContactInput) error
	// SendContactConfirmation delivers a short acknowledgement to the client.
	SendContactConfirmation(c validation.ContactInput) error
}

// New returns an SMTP-backed mailer when SMTP is configured, otherwise a
// logging mailer so local development works without a mail server.
func New(cfg config.Config, log *slog.Logger) Mailer {
	if cfg.SMTPConfigured() {
		return &smtpMailer{cfg: cfg, log: log}
	}
	log.Warn("SMTP not configured — emails will be logged, not sent")
	return &logMailer{log: log}
}

// ---- SMTP implementation ----------------------------------------------------

type smtpMailer struct {
	cfg config.Config
	log *slog.Logger
}

func (m *smtpMailer) auth() smtp.Auth {
	if m.cfg.SMTPUser == "" {
		return nil
	}
	return smtp.PlainAuth("", m.cfg.SMTPUser, m.cfg.SMTPPass, m.cfg.SMTPHost)
}

func (m *smtpMailer) addr() string {
	return fmt.Sprintf("%s:%d", m.cfg.SMTPHost, m.cfg.SMTPPort)
}

func buildMessage(from, to, replyTo, subject, body string) []byte {
	var b strings.Builder
	fmt.Fprintf(&b, "From: %s\r\n", from)
	fmt.Fprintf(&b, "To: %s\r\n", to)
	if replyTo != "" {
		fmt.Fprintf(&b, "Reply-To: %s\r\n", replyTo)
	}
	fmt.Fprintf(&b, "Subject: %s\r\n", subject)
	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: text/plain; charset=\"utf-8\"\r\n")
	b.WriteString("\r\n")
	b.WriteString(body)
	return []byte(b.String())
}

func (m *smtpMailer) SendContactEnquiry(c validation.ContactInput) error {
	subject := fmt.Sprintf("New enquiry — %s (%s %s)", c.Area, c.FirstName, c.LastName)
	body := fmt.Sprintf(
		"New website enquiry\r\n\r\n"+
			"Name:    %s %s\r\n"+
			"Email:   %s\r\n"+
			"Phone:   %s\r\n"+
			"Area:    %s\r\n\r\n"+
			"Message:\r\n%s\r\n",
		c.FirstName, c.LastName, c.Email, c.Phone, c.Area, c.Message,
	)
	msg := buildMessage(m.cfg.MailFrom, m.cfg.MailTo, c.Email, subject, body)
	return smtp.SendMail(m.addr(), m.auth(), m.cfg.MailFrom, []string{m.cfg.MailTo}, msg)
}

func (m *smtpMailer) SendContactConfirmation(c validation.ContactInput) error {
	subject := "Thank you — we received your enquiry"
	body := fmt.Sprintf(
		"Dear %s,\r\n\r\n"+
			"Thank you for contacting Polykarpou Law. We have received your enquiry "+
			"and will reply within one business day.\r\n\r\n"+
			"For reference, this is a copy of your message:\r\n%s\r\n\r\n"+
			"Kind regards,\r\nPolykarpou Law\r\nLimassol, Cyprus\r\n",
		c.FirstName, c.Message,
	)
	msg := buildMessage(m.cfg.MailFrom, c.Email, "", subject, body)
	return smtp.SendMail(m.addr(), m.auth(), m.cfg.MailFrom, []string{c.Email}, msg)
}

// ---- Logging fallback -------------------------------------------------------

type logMailer struct {
	log *slog.Logger
}

func (m *logMailer) SendContactEnquiry(c validation.ContactInput) error {
	m.log.Info("contact enquiry (not sent — no SMTP)",
		"from", c.Email, "area", c.Area, "name", c.FirstName+" "+c.LastName)
	return nil
}

func (m *logMailer) SendContactConfirmation(c validation.ContactInput) error {
	m.log.Info("contact confirmation (not sent — no SMTP)", "to", c.Email)
	return nil
}
