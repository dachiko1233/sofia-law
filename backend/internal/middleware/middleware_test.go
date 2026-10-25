package middleware

import (
	"testing"
	"time"
)

func TestRateLimiter_Allows(t *testing.T) {
	rl := NewRateLimiter(3, time.Minute)
	now := time.Now()
	for i := 0; i < 3; i++ {
		if !rl.allow("1.2.3.4", now) {
			t.Fatalf("request %d should be allowed", i)
		}
	}
	if rl.allow("1.2.3.4", now) {
		t.Fatal("4th request should be blocked")
	}
}

func TestRateLimiter_PerIP(t *testing.T) {
	rl := NewRateLimiter(1, time.Minute)
	now := time.Now()
	if !rl.allow("a", now) || !rl.allow("b", now) {
		t.Fatal("different IPs must be tracked independently")
	}
	if rl.allow("a", now) {
		t.Fatal("second request from a should be blocked")
	}
}

func TestRateLimiter_WindowExpiry(t *testing.T) {
	rl := NewRateLimiter(1, time.Minute)
	now := time.Now()
	if !rl.allow("a", now) {
		t.Fatal("first allowed")
	}
	if rl.allow("a", now.Add(30*time.Second)) {
		t.Fatal("within window should be blocked")
	}
	if !rl.allow("a", now.Add(2*time.Minute)) {
		t.Fatal("after window should be allowed again")
	}
}
