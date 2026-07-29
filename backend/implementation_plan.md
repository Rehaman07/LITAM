# Complete Backend Integration & Production-Readiness Plan for LITAM Website

This plan details the full technical strategy to connect the React frontend seamlessly with the Django backend, eliminate static/hardcoded data, fix all broken backend integration workflows (Events, Contact Inquiries, Testimonials, Placements, Courses, Users), consolidate duplicate APIs/models, implement unified UI components, add OpenAPI/Swagger docs, and make the application production-ready.

---

## User Review Required

> [!IMPORTANT]
> **Database Models Harmonization**: The backend currently has overlapping models across two apps (`litam` and `updates`). For example:
> - `litam.Event` vs `updates.Update(section='event')`
> - `litam.Inquiry` vs `updates.ContactInquiry`
> - `litam.Testimonial` vs `updates.Update(section='testimonial')`
> - `litam.Placement` vs `updates.StudentPlacement`
> 
> We will consolidate and standardize these into explicit, full-featured Django models with proper REST ViewSets and admin registrations so that adding an item in Django Admin immediately reflects on the frontend.

> [!NOTE]
> **Authentication & User Management**: Custom User model (`litam.User`) with roles (`ADMIN`, `ADMISSION_OFFICER`, `STUDENT`) is already defined. We will implement session/token login (`/api/litam/auth/login/`, `/api/litam/auth/logout/`, `/api/litam/auth/me/`) and admin permissions management.

---

## Open Questions

None at present. All requirements have been analyzed and mapped to concrete technical tasks.

---

## Proposed Changes

### Backend (Django)

#### 1. Models & Database Schema Harmonization
- **[litam/models.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/litam/models.py)**:
  - Update `Event`: Add `image` (ImageField, optional), `is_featured` (boolean), `created_at`.
  - Update `Testimonial`: Add `role_or_company` (char), `photo` (ImageField, optional), `rating` (integer), `is_active` (boolean, default True), `order` (integer), `created_at`.
  - Update `Course`: Add `is_featured` (boolean, default True), `created_at`.
  - Update `Inquiry`: Align fields (`name`, `email`, `phone`, `course`, `message`, `status`, `timestamp/created_at`).
  - Update `Placement` / `StudentPlacement`: Add student photo, company logo/name, package (LPA), student branch/department, graduation year, is_featured.
  - Maintain `User`: Keep `role` choices (`ADMIN`, `ADMISSION_OFFICER`, `STUDENT`) and add helper methods.

- **[updates/models.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/updates/models.py)**:
  - Keep `Update` for general announcements/notices with `category`/`section`, `title`, `message`, `image`, `created_at`.
  - Maintain alias models or proxies so legacy endpoints continue working without interruption.

#### 2. Serializers & API ViewSets
- **[litam/serializers.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/litam/serializers.py)**:
  - Add/Update serializers for `User`, `Course`, `Event`, `News`, `Testimonial`, `Inquiry`, `StudentPlacement`, `PlacementStats`. Include image URL resolution for Cloudinary/local media.
  - Create login/token authentication serializer.

- **[litam/views.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/litam/views.py)** & **[updates/views.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/updates/views.py)**:
  - `CourseViewSet`: Support list, detail, category filter (`?category=BTECH`), `?featured=true`.
  - `EventViewSet`: Support listing sorted by `event_date` (upcoming first, then past), search, category filter.
  - `NewsViewSet` / `UpdateViewSet`: Support search, category/section filtering, pagination, top/latest query param (`?limit=6`).
  - `TestimonialViewSet`: Filter `is_active=True`, ordered by `order` and `-created_at`.
  - `InquiryViewSet` / `ContactInquiryCreateAPIView`: Public `POST` creation with field validation and standard JSON response. `GET/PATCH` for authenticated admins.
  - `StudentPlacementViewSet`: Support top placement listings (`?top=6`), filtering by branch/year.
  - Auth Views: `LoginAPIView`, `LogoutAPIView`, `UserMeAPIView`.

#### 3. URLs & API Documentation
- **[litam/urls.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/litam/urls.py)** & **[backend/urls.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/backend/urls.py)**:
  - Register endpoints under `/api/litam/` and `/api/updates/` with backward-compatible aliases:
    - `/api/courses/`, `/api/events/`, `/api/updates/`, `/api/inquiries/`, `/api/testimonials/`, `/api/placements/`, `/api/users/`, `/api/auth/login/`, `/api/auth/logout/`.
  - Configure `drf-spectacular` OpenAPI schema generator and Swagger UI at `/api/docs/`.

#### 4. Django Admin Customizations
- **[litam/admin.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/litam/admin.py)** & **[updates/admin.py](file:///d:/RehamanWorkSpace/Projects/LITAM/backend/backend/updates/admin.py)**:
  - Add search fields, list filters, list display columns, image thumbnail previews, bulk actions, and ordering for `User`, `Course`, `Event`, `News`, `Testimonial`, `Placement`, and `Inquiry`.

---

### Frontend (React + TypeScript)

#### 1. Reusable Shared Updates Component
- **[NEW] [UpdatesFeed.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/components/UpdatesFeed.tsx)**:
  - Extracted common Updates component used by both the Home page (`App.tsx`) and dedicated `UpdatesPage.tsx`.
  - Maintains exact same UI design system: cards, spacing, responsive flex layout, badges, avatars, full-screen image modal preview, and Framer Motion animations.
  - Props: `limit` (e.g. 3–6 for Home), `showViewAll` (boolean for "View All Updates" button), `showSearchFilter` (boolean for filter/search on dedicated page).

#### 2. Complete API Integration Service
- **[frontend/src/api.ts](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/api.ts)** & **[types/api.ts](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/types/api.ts)**:
  - Define TypeScript types for `Course`, `Event`, `NewsItem`, `Testimonial`, `StudentPlacement`, `PlacementStats`, `ContactInquiry`, `User`.
  - Functions:
    - `fetchCourses(category?: string)`
    - `fetchEvents(upcomingOnly?: boolean)`
    - `fetchUpdates(params?: { search?: string; category?: string; page?: number; limit?: number })`
    - `fetchTestimonials()`
    - `fetchStudentPlacements(top?: number)`
    - `fetchPlacementStats()`
    - `submitContactInquiry(data: ContactInquiryPayload)`
    - `loginUser(credentials)`, `logoutUser()`, `fetchCurrentUser()`

#### 3. Frontend Pages Refactoring (Zero Hardcoded Data)
- **[frontend/src/App.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/App.tsx)**:
  - Replace hardcoded `courseCategories` with API-driven `fetchCourses()` data grouped by category.
  - Replace hardcoded `events` with `fetchEvents()` API data sorted by event date (upcoming first).
  - Replace hardcoded `HomeUpdates` with the new `<UpdatesFeed limit={6} showViewAll={true} />` component.
  - Replace hardcoded testimonials with `<TestimonialsSection />` driven by `fetchTestimonials()`.
  - Fix Contact Inquiry form submission flow: state handling, Django API post call, loading state, success toast, form reset, error alert.
- **[frontend/src/UpdatesPage.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/UpdatesPage.tsx)**:
  - Use `<UpdatesFeed showSearchFilter={true} />` so updates on Home and Updates page are 100% synchronized.
- **[frontend/src/PlacementsPage.tsx](file:///d:/RehamanWorkSpace/Projects/LITAM/frontend/src/PlacementsPage.tsx)**:
  - Connect with `fetchStudentPlacements()` and `fetchPlacementStats()`.
- **[NEW] UI Components**:
  - `LoadingSkeleton.tsx`: Pulsing skeletons for cards and tables during data fetching.
  - `EmptyState.tsx`: Reusable empty state display.
  - `ToastContainer.tsx`: Elegant toast system for instant user feedback.
  - `ErrorBoundary.tsx`: React error boundary wrapping routes.

---

## Verification Plan

### Automated Tests
1. **Django Backend Tests**:
   - Run `python manage.py test` to verify API status codes, data serialization, user authentication, event sorting, inquiry submission, and OpenAPI schema generation.

### Manual Verification
1. **Django Admin CRUD Test**:
   - Add a new Course, Event, News item, Testimonial, and Placement in Django Admin (`http://127.0.0.1:8000/admin/`).
   - Confirm that the new records instantly appear on the React frontend.
2. **Inquiry Form Submission Test**:
   - Fill out and submit the Contact Inquiry form on the Home page.
   - Verify success toast notification displays, form resets, and record is saved in Django database.
3. **Home vs. Updates Page Sync Test**:
   - Verify Home page displays latest 3–6 updates using the shared `UpdatesFeed` component with a "View All Updates" button linking to `/updates`.
4. **API Documentation**:
   - Access Swagger UI at `http://127.0.0.1:8000/api/docs/` and verify all endpoints are documented.
