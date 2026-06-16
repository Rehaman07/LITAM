# Implementation Plan: LITAM Full-Stack Enterprise Architecture Redesign

We will migrate the existing Vite + React project to a robust, scalable, and secure full-stack enterprise monorepo using the stack:
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Lenis, GSAP, Shadcn UI.
- **Backend**: Django 5, Django REST Framework, PostgreSQL, Redis, Simple JWT.
- **DevOps**: Docker, Nginx, Gunicorn.

---

## User Review Required

> [!IMPORTANT]
> **Aesthetic Philosophy**: We will follow a dark-themed high-fidelity aesthetic inspired by Apple, Stripe, Vercel, and Linear. This means minimal lines, high-contrast layouts, custom micro-interactions, smooth scroll interpolation via Lenis, and GSAP ScrollTrigger effects.
> **Admin Panel**: All page copy, courses, placement rates, testimonials, news articles, events, and inquiries will be saved in PostgreSQL and managed from custom Django Admin panels.

---

## Open Questions

> [!WARNING]
> Please review the following questions and provide your feedback:
>
> 1. **Tailwind CSS Version**: Which version of Tailwind CSS should we configure? (Recommend: **Tailwind v4** for clean architecture and built-in CSS variable engines, or **Tailwind v3** for compatibility).
> 2. **Project Setup Scope**: Shall we reorganize the root directory into a monorepo format:
>    - `frontend/` (containing the React app)
>    - `backend/` (containing the Django app)
>    - `docker-compose.yml` & `nginx/` (in the root)
> 3. **Database Migration**: Do you want us to write Python migration seed scripts to prepopulate the course categories, recruiters, news, and stats into PostgreSQL automatically?

---

## Proposed Changes

### Monorepo Architecture

```
litam-monorepo/
├── backend/                  # Django & DRF Backend
│   ├── config/               # Django Settings & WSGI
│   ├── litam/                # App for courses, placements, news, events, inquiries
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React 19 + TypeScript Frontend
│   ├── src/                  # React Components, Hooks, Styles
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── package.json
├── nginx/                    # Reverse Proxy Configuration
│   └── nginx.conf
└── docker-compose.yml        # Orchestrates App, Db, Cache & Web Server
```

---

### Backend Component

#### [NEW] [backend/requirements.txt](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/requirements.txt)
- Packages: `django`, `djangorestframework`, `djangorestframework-simplejwt`, `psycopg2-binary`, `django-cors-headers`, `redis`, `gunicorn`.

#### [NEW] [backend/config/settings.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/config/settings.py)
- Configuration of PostgreSQL database, Redis connection, JWT authentication keys, Django Admin security settings, CORS allowed origins, and static folder links.

#### [NEW] [backend/litam/models.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/litam/models.py)
- **User**: Custom user extending AbstractUser with roles (Admin, AdmissionOfficer, Student).
- **Course**: Title, category (B.Tech, M.Tech, Diploma, PostGrad), code, duration, description, fee, and eligibility.
- **Placement**: HighestPackage, AveragePackage, Year, Recruiters, and TrainingHours.
- **Inquiry**: Name, email, phone, courseOfInterest, message, status (New, Processing, Answered), and timestamp.
- **News**: Date, title, content, tag.
- **Event**: Date, title, description, venue.
- **Testimonial**: Quote, studentName, metadata (placement info).

#### [NEW] [backend/litam/views.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/litam/views.py)
- REST APIs for Course lists, Placement stats, News feeds, Event announcements, and Inquiry creation (with captcha or validation). Caching implemented using Redis.

---

### Frontend Component

#### [NEW] [frontend/package.json](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/package.json)
- Dependency upgrades: React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, `@studio-freight/lenis`, and UI libraries.

#### [NEW] [frontend/tsconfig.json](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/tsconfig.json)
- TypeScript settings, paths config (`@/*` pointing to `src/*`).

#### [NEW] [frontend/src/main.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/main.tsx)
- Bootstrapping React 19, importing Lenis smooth-scroll provider.

#### [NEW] [frontend/src/App.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/App.tsx)
- Redesigned site utilizing Shadcn UI components.
- Implementation of Lenis + GSAP ScrollTrigger for parallax scrolling and scroll-bound animations.
- Integration of Axios hooks connecting components to the Django API backend endpoints.

---

### Deployment & DevOps Component

#### [NEW] [docker-compose.yml](file:///d:/RehamanWorkSpace/Projects/LITAM/docker-compose.yml)
- Sets up PostgreSQL container, Redis container, backend Gunicorn container, and frontend Nginx container in a single bridge network.

#### [NEW] [nginx/nginx.conf](file:///d:/RehamanWorkSpace/Projects/LITAM/nginx/nginx.conf)
- Configures caching headers, serving compiled React files directly, and routing API paths `/api/` and `/admin/` to the Gunicorn Django backend.

---

## Verification Plan

### Automated Tests
1. **Docker Compilation**: Run `docker-compose up --build -d` to verify compilation, database connection, and Redis cache.
2. **API Verification**: Perform curl requests to backend endpoints:
   - `/api/courses/`
   - `/api/news/`
3. **Frontend Build Verification**: Run `npm run build` in the `frontend` container to confirm TS/Tailwind compilation.

### Manual Verification
- Access `/admin/` and create mock courses or news items; verify they instantly populate the React frontend layout.
- Test responsive grids and touch gestures on mobile simulator view.
- Perform an inquiry submission and check that the inquiry enters the database and is visible under the Django admin portal.
