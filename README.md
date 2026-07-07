# URL Shortener

A full-stack URL shortener with React, Vite, Express, PostgreSQL, and analytics.

---

## Contents

- Project overview
- Frontend features
- Tech stack
- Architecture and flow
- API Endpoints
- Database schema
- Environment variables
- Install & run
- Design decisions

---

## Project overview

This repository implements a URL shortening service with a user-friendly frontend and a backend API.

Key functionality:

- Shorten long URLs into compact shared links
- Optional custom alias support with collision handling
- Redirect service that increments click counts
- Click analytics for single and bulk short codes
- History of recent shortened links stored in browser localStorage
- QR code generation, download, and native sharing support
- Bulk delete of selected links from history

The backend lives in `server/` and the frontend lives in `client/`.

## Frontend features

The React UI provides:

- URL input and optional custom alias input
- Short link generation with copy-to-clipboard
- Local history of recent shortened links saved in `localStorage`
- Refresh analytics for all stored links via `/api/analytics`
- Bulk delete of selected short links
- QR code generation and download using `client/src/utils/generateQr.js`
- Native share support for modern browsers

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL (via `pg`)
- Short-code generation: `nanoid`
- Request validation: `express-validator`
- API client: Axios

## Architecture and flow

### Backend structure

- Routes: `server/src/routes/urlRoutes.js`
- Controllers: `server/src/controllers/urlController.js`, `server/src/controllers/analyticController.js`
- Models: `server/src/models/urlModel.js`
- Config: `server/src/config/db.js`
- Utils: `server/src/utils/generateCode.js`
- Validation middleware: `server/src/middlewares/validateUrl.js`

### Sequence

1. User submits a URL and optional alias in the frontend.
2. Frontend calls `POST /api/shorten`.
3. Backend validates the URL, optionally checks alias collisions, and inserts a new record.
4. Backend returns a short URL built from `BASE_URL` and the generated code.
5. User can click the short URL, which calls `GET /:code` and redirects to the original URL while incrementing clicks.
6. The frontend loads analytics by calling `GET /api/analytics/:code` or `POST /api/analytics`.

## API endpoints

Base: the backend mounts routes under `/api` in `server/server.js`, and the redirect handler runs on `GET /:code`.

### POST /api/shorten

- Description: Create a new short URL.
- Request body:
  ```json
  {
    "originalUrl": "https://example.com/long-link",
    "customAlias": "optional-alias"
  }
  ```
- Success response:
  ```json
  {
    "success": true,
    "short_url": "<BASE_URL>/<shortCode>",
    "shortCode": "abc1234",
    "originalUrl": "https://example.com/long-link"
  }
  ```
- Notes: If `customAlias` is provided and already exists, the backend appends a short suffix to avoid collision.

### GET /:code

- Description: Redirect to the original URL for the given short code.
- Behavior: increments the `clicks` counter for the matched record.
- Response: `301` redirect to the original URL, or `404` JSON when not found.

### GET /api/analytics/:code

- Description: Retrieve click count for one short code.
- Response:
  ```json
  {
    "success": true,
    "data": { "clicks": 123 }
  }
  ```

### POST /api/analytics

- Description: Retrieve click counts for multiple codes at once.
- Request body:
  ```json
  { "codes": ["abc1234", "xyz6789"] }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": [
      { "short_code": "abc1234", "clicks": 12 },
      { "short_code": "xyz6789", "clicks": 8 }
    ]
  }
  ```

### DELETE /api/url

- Description: Delete multiple shortened URLs by code.
- Request body:
  ```json
  { "codes": ["abc1234", "xyz6789"] }
  ```
- Response:
  ```json
  {
    "success": true,
    "deleted": [{ "short_code": "abc1234" }, { "short_code": "xyz6789" }]
  }
  ```

## Database schema

The backend expects a `urls` table with the following columns:

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(255) UNIQUE NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

Notes:

- `short_code` must be unique.
- Model queries depend on `original_url`, `short_code`, and `clicks`.

## Environment variables

Backend environment variables (`server/.env`):

- `PORT` — server port, e.g. `5000`
- `DATABASE_URL` — PostgreSQL connection string
- `BASE_URL` — public base URL used in short link responses

Frontend environment variables:

- `VITE_API_URL` — backend base URL for API requests

## Install & run

### Backend

```bash
cd server
npm install
# create .env with PORT, DATABASE_URL, BASE_URL
npm run server
```

### Frontend

```bash
cd client
npm install
# create .env with VITE_API_URL or set the variable in your environment
npm run dev
```

## Design decisions

### Why PostgreSQL

- PostgreSQL is reliable and supports structured relational data.
- Unique constraints and stable query semantics are ideal for short-code storage.
- It handles analytics counters safely and can scale with more records.

### Why nanoid

- `nanoid` generates compact, collision-resistant short codes.
- The project uses `nanoid(7)` for a large enough namespace while keeping links short.
- Collisions on a custom alias are resolved by appending a short suffix.

### Why localStorage on the frontend

- Recent shortened links are preserved between page reloads.
- Local history enables refreshable analytics and bulk delete from the UI.

### Why Axios and Express

- Axios simplifies frontend API requests and JSON handling.
- Express keeps the backend lightweight and easy to extend.

## Notes

- The frontend stores the last 10 shortened links in localStorage.
- Click analytics can be refreshed manually from the UI.
- QR generation and native sharing improve link distribution.
