# syntax=docker/dockerfile:1

# ---- Stage 1: build the frontend ------------------------------------------
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: build the Go binary -----------------------------------------
FROM golang:1.27-alpine AS backend
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum* ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

# ---- Stage 3: minimal runtime ---------------------------------------------
FROM alpine:3.20
RUN apk add --no-cache ca-certificates && adduser -D -u 10001 app
WORKDIR /app
COPY --from=backend /server /app/server
COPY --from=frontend /app/frontend/dist /app/frontend/dist

ENV PORT=8080 \
    GIN_MODE=release \
    SERVE_FRONTEND=true \
    FRONTEND_DIR=/app/frontend/dist \
    DB_PATH=/app/data/polykarpou.db

RUN mkdir -p /app/data && chown -R app:app /app/data
USER app
EXPOSE 8080
ENTRYPOINT ["/app/server"]
