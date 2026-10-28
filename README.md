# Polykarpou & Co. LLC — website

Production website for **Polykarpou & Co. LLC**, an independent law practice in
Limassol, Cyprus (advocate Sofia Polykarpou).

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router,
  with `react-i18next` (EN / GR / RU) and `react-helmet-async` for SEO.
- **Backend:** Go + Gin — contact and newsletter APIs, SQLite for subscribers,
  SMTP email, rate limiting and a honeypot. In production it also serves the
  built frontend.

```
.
├── frontend/     React app (components, pages, i18n, data)
├── backend/      Go + Gin API (cmd/server, internal/*)
├── Makefile      run / build / test everything
├── .env.example  backend configuration template
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 20.19 (developed on 24) and npm — required by Vite 8
- **Go** ≥ 1.27

## Quick start

```bash
# 1. Install dependencies (frontend npm + backend go modules)
make install

# 2. Configure the backend
cp .env.example .env        # then edit .env — see "Configuration" below

# 3. Run both dev servers (Vite on :5173, Gin on :8080)
make dev
```

Open <http://localhost:5173>. The Vite dev server proxies `/api/*` to the Gin
API on `:8080`, so the contact and newsletter forms work end-to-end in dev.

> Without SMTP configured, the backend **logs** emails instead of sending them,
> so you can develop the contact form without a mail server. Newsletter
> subscriptions are always written to SQLite.

---

## Configuration

All backend configuration comes from environment variables (never hard-coded).
Copy `.env.example` to `.env` and fill in real values.

| Variable         | Purpose                                                        | Dev default                |
| ---------------- | -------------------------------------------------------------- | -------------------------- |
| `PORT`           | Port the Gin server listens on                                 | `8080`                     |
| `SMTP_HOST`      | SMTP server hostname                                           | _(empty → emails logged)_  |
| `SMTP_PORT`      | SMTP server port                                               | `587`                      |
| `SMTP_USER`      | SMTP username                                                  | _(empty → no auth)_        |
| `SMTP_PASS`      | SMTP password                                                  | _(empty)_                  |
| `MAIL_FROM`      | `From` address for outgoing mail                               | _(empty)_                  |
| `MAIL_TO`        | Office inbox that receives enquiries                           | _(empty)_                  |
| `ALLOWED_ORIGIN` | CORS: exact frontend origin (no trailing slash)                | `http://localhost:5173`    |
| `DB_PATH`        | SQLite file for newsletter subscribers                         | `./data/polykarpou.db`     |

Production-only (set by `make start`):

| Variable          | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `SERVE_FRONTEND`  | `true` → Gin serves `frontend/dist` with SPA fallback |
| `FRONTEND_DIR`    | Path to the built frontend (default `../frontend/dist`) |
| `GIN_MODE`        | `release` in production                             |

Email requires `SMTP_HOST`, `MAIL_FROM` and `MAIL_TO` to all be set.

---

## Make targets

| Target             | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `make install`     | Install frontend (npm) and backend (go mod) dependencies  |
| `make dev`         | Run Vite + Gin together                                   |
| `make dev-frontend`| Run only the Vite dev server                              |
| `make dev-backend` | Run only the Gin API                                      |
| `make build`       | Build the frontend and compile the Go binary              |
| `make start`       | Run the production build (Gin serves `frontend/dist`)     |
| `make test`        | Run frontend (Vitest) and backend (`go test`) tests       |
| `make lint`        | eslint + prettier (frontend), `go vet` + `gofmt` (backend)|
| `make clean`       | Remove build outputs                                      |
| `make docker`      | Build the multi-stage Docker image                        |

---

## API

| Method | Path              | Body                                                                   |
| ------ | ----------------- | ---------------------------------------------------------------------- |
| `GET`  | `/api/health`     | —                                                                      |
| `POST` | `/api/contact`    | `firstName, lastName, email, phone, area, message, consent` (+ honeypot `company`) |
| `POST` | `/api/newsletter` | `email` (+ honeypot `company`)                                         |

**Validation** happens on the server for every field (required fields, email
format, max lengths, `consent` must be `true`). Invalid input returns
`422` with `{ "error": "validation_failed", "fields": { … } }`.

**Spam protection:** a hidden `company` honeypot field on both forms, plus
per-IP rate limiting (5 requests / 10 minutes) on the POST endpoints.

**Contact flow:** the enquiry is emailed to `MAIL_TO` (with the sender set as
`Reply-To`) and a short confirmation is emailed to the client.

**Newsletter:** stored in SQLite with a unique, case-insensitive email and a
`created_at` timestamp; duplicates are accepted idempotently.

---

## Internationalisation

`react-i18next` is set up with **English, Greek and Russian** as full
languages. The language switcher (EN / GR / RU) translates the **entire site**
— UI chrome, homepage, forms, cookie banner, all 8 expertise pages and the 3
legal policy pages — and persists the choice in `localStorage`, updating
`<html lang>`.

Translation sources:

- **UI chrome + homepage + forms + cookie banner** →
  `frontend/src/i18n/locales/{en,gr,ru}.json`
- **The 8 practice-area pages** → `frontend/src/data/practiceAreas.ts` (English,
  canonical) plus `practiceAreas.gr.ts` / `practiceAreas.ru.ts`, merged by a
  language-aware resolver and rendered by a single `ExpertisePage` template.
- **The 3 policy pages** → `frontend/src/data/policies.ts` (+ `.gr.ts` / `.ru.ts`),
  rendered generically by `PolicyArticle`.

> The Greek and Russian copy — especially the legal/policy wording — was
> produced as a first full translation and should be reviewed by a native
> legal professional before going live. Each non-English file carries a
> `_meta._note` / header comment to that effect. `[square-bracket]` placeholders
> are kept verbatim in every language.

To add or correct a translation, edit the matching value in the `gr`/`ru`
source; keys and structure must stay identical to English (tests enforce this).

---

## Cookies & privacy

A consent banner (Accept / Reject non-essential) stores the choice in
`localStorage`; a **Cookie settings** link in the footer reopens it. No
analytics are loaded unless the user accepts (see
`frontend/src/lib/cookieConsent.ts`).

---

## Deployment

1. Build everything:

   ```bash
   make build
   ```

   This produces `frontend/dist/` and `backend/bin/server`.

2. Run the server with production settings. It serves the API **and** the built
   frontend (with SPA fallback to `index.html`):

   ```bash
   cd backend
   GIN_MODE=release SERVE_FRONTEND=true FRONTEND_DIR=../frontend/dist \
     PORT=8080 ALLOWED_ORIGIN=https://your-domain SMTP_HOST=… MAIL_FROM=… MAIL_TO=… \
     ./bin/server
   ```

   or simply `make start` (reads your environment / `.env`).

3. Put a TLS-terminating reverse proxy (nginx, Caddy) in front, pointing at the
   Gin port. Set `ALLOWED_ORIGIN` to your public HTTPS origin.

### Docker

A multi-stage `Dockerfile` builds the frontend and the Go binary into one small
image that serves everything on `PORT`:

```bash
make docker
docker run -p 8080:8080 --env-file .env -e SERVE_FRONTEND=true polykarpou-law
```

---

## Notes & placeholders

Everything in `[square brackets]` (phone, email, address, Bar registration/VAT
numbers, retention periods, portrait photo, “Last updated” dates) is a
placeholder carried over verbatim from the original content. Replace them with
real values before going live. Update `https://polykarpoulaw.com` in
`frontend/src/components/Seo.tsx`, `frontend/public/sitemap.xml` and
`frontend/public/robots.txt` to the final domain.

The EN/GR/RU switcher appears in the top bar on the home page and inside the
mobile menu on every page (the switcher appears only in the home top bar on
desktop).

A pure-Go SQLite driver (`modernc.org/sqlite`) is used so the backend builds
without cgo/gcc.
