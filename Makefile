# ===========================================================================
# Polykarpou Law — project Makefile
# ===========================================================================
.DEFAULT_GOAL := help
.PHONY: help install dev dev-frontend dev-backend build build-frontend \
        build-backend start test test-frontend test-backend lint \
        lint-frontend lint-backend clean docker

FRONTEND_DIR := frontend
BACKEND_DIR  := backend
BIN          := $(BACKEND_DIR)/bin/server

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## Install frontend (npm) and backend (go mod) dependencies
	cd $(FRONTEND_DIR) && npm install
	cd $(BACKEND_DIR) && go mod download

dev: ## Run the Vite dev server and the Gin API together
	@echo "Starting frontend (Vite) and backend (Gin)…"
	@trap 'kill 0' INT TERM; \
		$(MAKE) dev-backend & \
		$(MAKE) dev-frontend & \
		wait

dev-frontend: ## Run only the frontend (Vite, proxies /api to Gin)
	cd $(FRONTEND_DIR) && npm run dev

dev-backend: ## Run only the backend (Gin)
	cd $(BACKEND_DIR) && go run ./cmd/server

build: build-frontend build-backend ## Build the frontend and compile the Go binary

build-frontend: ## Build the React app to frontend/dist
	cd $(FRONTEND_DIR) && npm run build

build-backend: ## Compile the Go server binary
	cd $(BACKEND_DIR) && go build -o bin/server ./cmd/server

start: build ## Run the production build (Gin serving frontend/dist)
	cd $(BACKEND_DIR) && GIN_MODE=release SERVE_FRONTEND=true ./bin/server

test: test-frontend test-backend ## Run frontend and backend tests

test-frontend: ## Run frontend tests
	cd $(FRONTEND_DIR) && npm test

test-backend: ## Run backend tests
	cd $(BACKEND_DIR) && go test ./...

lint: lint-frontend lint-backend ## Lint frontend and backend

lint-frontend: ## eslint + prettier check for the frontend
	cd $(FRONTEND_DIR) && npm run lint && npm run format:check

lint-backend: ## go vet + gofmt check for the backend
	cd $(BACKEND_DIR) && go vet ./... && test -z "$$(gofmt -l .)"

clean: ## Remove build outputs
	rm -rf $(FRONTEND_DIR)/dist
	rm -rf $(BACKEND_DIR)/bin

docker: ## Build the multi-stage Docker image
	docker build -t polykarpou-law .
