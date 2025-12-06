# School Competitions - Next.js App Router (Tailwind v4)

This repository is a starter School Competition Management Platform built with Next.js App Router, Tailwind CSS (v4 assumed already installed and configured), SQLite (`better-sqlite3`), bcrypt for passwords, and `pdf-lib` for certificate generation.

Features implemented so far:
- Roles: `admin`, `teacher`, `student`
- Email/password authentication with sessions stored in SQLite
- Competitions CRUD (API)
- Student registrations with duplicate prevention and automatic closed state based on dates
- Results posting and leaderboard endpoints
- Certificate PDF generation (stored in `public/certificates`)

Core files and folders
- `lib/db.js` — SQLite initialization and helper functions (tables created automatically)
- `lib/auth.js` — password hashing and session helpers
- `lib/pdf.js` — certificate PDF generation using `pdf-lib`
- `app/api/*` — route handlers for auth, competitions, registrations, results, certificates, users
- `scripts/seed.js` — creates an admin user and sample competition

Available API endpoints

- `POST /api/auth/login` — body: `{ email, password }` (sets an HttpOnly `session` cookie)
- `POST /api/auth/logout` — clears session cookie
- `GET /api/competitions` — list competitions
- `POST /api/competitions` — create competition
- `GET /api/competitions/[id]` — get competition
- `PUT /api/competitions/[id]` — update competition
- `DELETE /api/competitions/[id]` — delete competition
- `GET /api/registrations?competition_id=...` — list registrations (or all registrations if omitted)
- `POST /api/registrations` — register student for competition `{ student_id, competition_id }`
- `GET /api/results?competition_id=...&q=searchText` — list results, optional search by student name
- `POST /api/results` — add result `{ competition_id, student_id, position, score }`
- `POST /api/certificates/generate` — generate certificate PDF `{ result_id }`
- `GET /api/certificates/[id]` — lookup certificate record
- `GET /api/users` — list users (optional `?role=teacher`)
- `POST /api/users` — create user `{ name, email, password, role }`

Getting started (developer)

1. Install dependencies (Tailwind v4 is assumed already installed — do not reinstall Tailwind):

```powershell
cd "c:\\Users\\Mohamed Salah\\Desktop\\project"
npm install
```

2. Seed the database (creates admin user and sample competition):

```powershell
npm run seed
```

Admin seed credentials: `admin@example.com` / `password123`

3. Start the dev server:

```powershell
npm run dev
```

4. Useful pages to try:
- `/competitions` — public competitions list
- `/competitions/[id]` — competition details and registration status
- `/login` — login page
- `/dashboard` — placeholder dashboard

Notes and next steps
- This scaffold focuses on server-side API, DB layer, and core helpers. It provides minimal example pages. Protecting admin pages, adding server-side session middleware, and a full admin UI are next steps.
- Certificates are created in `public/certificates` and are served statically by Next.js at `/certificates/<filename>.pdf`.
- For production, secure sessions, HTTPS cookies, stronger password policies, and rate limiting should be added.

If you'd like, I can now:
- (A) Build the admin UI (manage competitions, registrations, results, users)
- (B) Add server-side session middleware and protect routes/pages
- (C) Implement client-side form validation and nicer UX

Tell me which next step you prefer and I will continue.
