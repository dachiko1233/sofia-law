package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	"polykarpoulaw/internal/validation"
)

// ---- test doubles -----------------------------------------------------------

type mockMailer struct {
	enquiries     int
	confirmations int
	failEnquiry   error
}

func (m *mockMailer) SendContactEnquiry(validation.ContactInput) error {
	m.enquiries++
	return m.failEnquiry
}
func (m *mockMailer) SendContactConfirmation(validation.ContactInput) error {
	m.confirmations++
	return nil
}

type mockStore struct {
	calls   int
	added   bool
	failErr error
	lastEty string
}

func (s *mockStore) AddSubscriber(email string) (bool, error) {
	s.calls++
	s.lastEty = email
	return s.added, s.failErr
}
func (s *mockStore) Close() error { return nil }

func testHandler(m *mockMailer, s *mockStore) (*Handler, *gin.Engine) {
	gin.SetMode(gin.TestMode)
	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	h := New(m, s, log)
	r := gin.New()
	r.GET("/api/health", h.Health)
	r.POST("/api/contact", h.Contact)
	r.POST("/api/newsletter", h.Newsletter)
	return h, r
}

func postJSON(r *gin.Engine, path string, body any) *httptest.ResponseRecorder {
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, path, bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func validContactBody() gin.H {
	return gin.H{
		"firstName": "Sofia", "lastName": "Polykarpou", "email": "sofia@example.com",
		"phone": "+357", "area": "Corporate", "message": "Hello", "consent": true,
	}
}

// ---- health -----------------------------------------------------------------

func TestHealth(t *testing.T) {
	_, r := testHandler(&mockMailer{}, &mockStore{})
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("health status = %d", w.Code)
	}
}

// ---- contact ----------------------------------------------------------------

func TestContact_OK(t *testing.T) {
	m := &mockMailer{}
	_, r := testHandler(m, &mockStore{})
	w := postJSON(r, "/api/contact", validContactBody())
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d body = %s", w.Code, w.Body)
	}
	if m.enquiries != 1 || m.confirmations != 1 {
		t.Fatalf("expected 1 enquiry + 1 confirmation, got %d/%d", m.enquiries, m.confirmations)
	}
}

func TestContact_ValidationFails(t *testing.T) {
	m := &mockMailer{}
	_, r := testHandler(m, &mockStore{})
	body := validContactBody()
	body["email"] = "bad"
	body["consent"] = false
	w := postJSON(r, "/api/contact", body)
	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d", w.Code)
	}
	var resp struct {
		Error  string            `json:"error"`
		Fields map[string]string `json:"fields"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp.Error != "validation_failed" || resp.Fields["email"] == "" || resp.Fields["consent"] == "" {
		t.Fatalf("unexpected response %s", w.Body)
	}
	if m.enquiries != 0 {
		t.Fatalf("mailer should not be called on invalid input")
	}
}

func TestContact_Honeypot(t *testing.T) {
	m := &mockMailer{}
	_, r := testHandler(m, &mockStore{})
	body := validContactBody()
	body["company"] = "spam-bot"
	w := postJSON(r, "/api/contact", body)
	if w.Code != http.StatusOK {
		t.Fatalf("honeypot status = %d", w.Code)
	}
	if m.enquiries != 0 {
		t.Fatalf("honeypot must not send mail, got %d", m.enquiries)
	}
}

func TestContact_MailFailure(t *testing.T) {
	m := &mockMailer{failEnquiry: errors.New("resend down")}
	_, r := testHandler(m, &mockStore{})
	w := postJSON(r, "/api/contact", validContactBody())
	if w.Code != http.StatusBadGateway {
		t.Fatalf("status = %d", w.Code)
	}
}

func TestContact_BadJSON(t *testing.T) {
	_, r := testHandler(&mockMailer{}, &mockStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewReader([]byte("{not json")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d", w.Code)
	}
}

// ---- newsletter -------------------------------------------------------------

func TestNewsletter_OK(t *testing.T) {
	s := &mockStore{added: true}
	_, r := testHandler(&mockMailer{}, s)
	w := postJSON(r, "/api/newsletter", gin.H{"email": "a@b.co"})
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d", w.Code)
	}
	if s.calls != 1 || s.lastEty != "a@b.co" {
		t.Fatalf("store not called correctly: %+v", s)
	}
}

func TestNewsletter_Duplicate(t *testing.T) {
	s := &mockStore{added: false} // already existed
	_, r := testHandler(&mockMailer{}, s)
	w := postJSON(r, "/api/newsletter", gin.H{"email": "a@b.co"})
	if w.Code != http.StatusOK {
		t.Fatalf("duplicate should still be 200, got %d", w.Code)
	}
}

func TestNewsletter_InvalidEmail(t *testing.T) {
	s := &mockStore{}
	_, r := testHandler(&mockMailer{}, s)
	w := postJSON(r, "/api/newsletter", gin.H{"email": "nope"})
	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d", w.Code)
	}
	if s.calls != 0 {
		t.Fatalf("store must not be called on invalid email")
	}
}

func TestNewsletter_Honeypot(t *testing.T) {
	s := &mockStore{}
	_, r := testHandler(&mockMailer{}, s)
	w := postJSON(r, "/api/newsletter", gin.H{"email": "a@b.co", "company": "bot"})
	if w.Code != http.StatusOK || s.calls != 0 {
		t.Fatalf("honeypot failed: code=%d calls=%d", w.Code, s.calls)
	}
}
