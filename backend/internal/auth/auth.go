// Package auth provides password hashing and stateless signed session tokens
// for the client portal. Tokens are HMAC-SHA256 signed and carry the user id
// and an expiry, so no server-side session store is needed.
package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// TokenTTL is how long a login stays valid.
const TokenTTL = 7 * 24 * time.Hour

// HashPassword returns a bcrypt hash of the plaintext password.
func HashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

// CheckPassword reports whether pw matches the stored bcrypt hash.
func CheckPassword(hash, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)) == nil
}

// Token builds a signed token "uid.exp.sig" for the given user id.
func Token(secret string, userID int64) string {
	exp := time.Now().Add(TokenTTL).Unix()
	payload := fmt.Sprintf("%d.%d", userID, exp)
	return payload + "." + sign(secret, payload)
}

// Verify checks a token's signature and expiry, returning the user id.
func Verify(secret, token string) (int64, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return 0, fmt.Errorf("malformed token")
	}
	payload := parts[0] + "." + parts[1]
	if !hmac.Equal([]byte(sign(secret, payload)), []byte(parts[2])) {
		return 0, fmt.Errorf("bad signature")
	}
	uid, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return 0, fmt.Errorf("bad uid")
	}
	exp, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil || time.Now().Unix() > exp {
		return 0, fmt.Errorf("expired")
	}
	return uid, nil
}

// AdminToken builds a signed token for the single office/admin session. It uses
// the reserved subject "admin" so it can never collide with a numeric user id,
// and so the client Verify (which expects a numeric subject) rejects it.
func AdminToken(secret string) string {
	exp := time.Now().Add(TokenTTL).Unix()
	payload := fmt.Sprintf("admin.%d", exp)
	return payload + "." + sign(secret, payload)
}

// VerifyAdmin checks an admin token's signature and expiry.
func VerifyAdmin(secret, token string) error {
	parts := strings.Split(token, ".")
	if len(parts) != 3 || parts[0] != "admin" {
		return fmt.Errorf("malformed token")
	}
	payload := parts[0] + "." + parts[1]
	if !hmac.Equal([]byte(sign(secret, payload)), []byte(parts[2])) {
		return fmt.Errorf("bad signature")
	}
	exp, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil || time.Now().Unix() > exp {
		return fmt.Errorf("expired")
	}
	return nil
}

func sign(secret, payload string) string {
	m := hmac.New(sha256.New, []byte(secret))
	m.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(m.Sum(nil))
}
