# LITAM API Contract

This document defines how the React website and Django backend stay aligned.

## Public website API

The SPA consumes **only** endpoints under `/api/updates/`.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/updates/content/` | CMS sections keyed by section name |
| GET | `/api/updates/` | Updates feed |
| GET | `/api/updates/student-placements/?top=N` | Student placement cards |
| POST | `/api/updates/contact-inquiries/` | Contact form submissions |

Frontend helpers live in [`frontend/src/api.ts`](../frontend/src/api.ts). TypeScript shapes live in [`frontend/src/types/api.ts`](../frontend/src/types/api.ts).

## Internal / admin-only APIs

These exist for Django Admin, seed scripts, and future staff tools. The public website must **not** call them.

| Prefix | App | Notes |
|--------|-----|-------|
| `/api/litam/` | `litam` | Structured courses, news, events, inquiries, users |
| `/admin/` | Django Admin | CMS editing for `updates` models |

`litam.Inquiry` is separate from public `updates.ContactInquiry`.

## CMS content model

Admins manage website content through Django Admin on the `Update` model:

- Sections: `hero`, `notice`, `event`, `course`, `placement`, `recruiter`, `gallery`, `faculty`, `testimonial`, `student_life`, `about`, `stats`, `unique_feature`, `campus`
- Fields: `title`, `message`, optional `image`

Student placement cards use the `StudentPlacement` model (`student_name`, `company_name`, `package_lpa`, optional `photo`).

## Environment variables

### Frontend

```env
VITE_API_URL=http://127.0.0.1:8000
```

Do not include `/api` in `VITE_API_URL`. The client appends `/api` automatically.

### Backend

Required for local development:

- `SECRET_KEY`
- `DATABASE_URL`
- Cloudinary vars when uploading images

Local CORS allows:

- `http://127.0.0.1:4174`
- `http://localhost:4174`

Production allows `https://litam.vercel.app`.

## Development workflow

From the repo root:

```bash
npm install
npm run dev
```

This starts:

- Django API on `http://127.0.0.1:8000`
- Vite frontend on `http://127.0.0.1:4174`

Vite proxies `/api` and `/media` to Django during local development.

## OpenAPI and generated types

OpenAPI schema: `GET /api/schema/`  
Swagger UI: `GET /api/docs/`

Regenerate frontend types after serializer changes:

```bash
npm run generate:api-types
```

Requires the Django server to be running locally.

Hand-written aliases in `frontend/src/types/api.ts` should stay in sync with generated output for CMS-specific shapes.

## Deferred: Results feature

The Results PDF upload and hall-ticket lookup feature is **deferred**.

- Backend `results` app references were removed so Django boots cleanly
- Frontend components under `frontend/src/components/Results/` are intentionally not routed

To restore later:

1. Re-add the `results` Django app and Celery task
2. Mount `/api/results/` routes
3. Wire Results components into the React router

## Contract guardrails

Backend integration tests live in [`backend/backend/updates/tests.py`](../backend/backend/updates/tests.py).

When changing public endpoints:

1. Update serializers/views
2. Regenerate OpenAPI types
3. Update `frontend/src/api.ts` helpers
4. Run backend tests
