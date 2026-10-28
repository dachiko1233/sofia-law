package config

import (
	"bufio"
	"os"
	"strings"
)

// LoadEnvFile loads KEY=VALUE pairs from the first existing path into the
// process environment, WITHOUT overriding variables that are already set.
// Lines that are blank or start with '#' are ignored, and surrounding quotes
// are stripped. Missing files are silently skipped. This is a convenience for
// local development; in production, set real environment variables instead.
func LoadEnvFile(paths ...string) {
	for _, p := range paths {
		f, err := os.Open(p)
		if err != nil {
			continue
		}
		sc := bufio.NewScanner(f)
		for sc.Scan() {
			line := strings.TrimSpace(sc.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			key, val, ok := strings.Cut(line, "=")
			if !ok {
				continue
			}
			key = strings.TrimSpace(key)
			val = strings.Trim(strings.TrimSpace(val), `"'`)
			if key == "" {
				continue
			}
			if _, exists := os.LookupEnv(key); !exists {
				_ = os.Setenv(key, val)
			}
		}
		_ = f.Close()
		return // only the first file found is loaded
	}
}
