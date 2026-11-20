# HCI — My Blue App

React (Vite) frontend + Laravel 12 REST API (Sanctum), built from the wireframe specification.

```
.
├── backend/    # Laravel API — http://127.0.0.1:8100
└── frontend/   # React SPA — http://127.0.0.1:5400
```

Ports 5173/5174/5180 and 8000 are used by other apps on this machine, so this app
uses a dedicated fixed port **5400** for the SPA and **8100** for the API. The SPA
port is pinned with `strictPort: true` in `frontend/vite.config.js`, so it will
never silently switch to a different port again. API requests from the browser use
`http://127.0.0.1:8100/api` (set in `frontend/.env`).

## Quick start

SQLite is configured by default, so no database server is needed.

**Easiest option — from the project root in PowerShell:**

```powershell
.\start-dev.ps1
```

It opens one terminal for the API and one for the SPA, and skips any server that is
already running. Both servers must stay up for signup/login to work; if either one
stops, the forms now show a "Cannot connect to the server" message instead of failing
silently.

**Manual option:**

```bash
# Terminal 1 — API
cd backend
php artisan migrate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8100

# Terminal 2 — SPA
cd frontend
npm install
npm run dev
```

Open <http://127.0.0.1:5400>. Sign up, create a post (text and/or image), visit Settings, then log out and log back in with either the username or the email address.

> Both servers must be running. If account creation fails with a network/CORS error,
> check that the API on port 8100 is up and that the SPA is on port 5400.

### Using MySQL instead

In `backend/.env`, switch the connection and provide credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_blue_app
DB_USERNAME=root
DB_PASSWORD=
```

Create the `my_blue_app` database first, then run `php artisan migrate` again.

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/register` | No | Create an account |
| POST | `/api/login` | No | Login with username or email |
| GET | `/api/me` | Yes | Current user |
| PUT | `/api/profile` | Yes | Update username, email, password, avatar |
| POST | `/api/logout` | Yes | Revoke the current token |
| GET | `/api/posts` | Yes | Paginated feed (10 per page) |
| POST | `/api/posts` | Yes | Create a post with text and/or image |
| DELETE | `/api/posts/{id}` | Yes | Delete your own post |

Bearer tokens are stored in `localStorage` and sent by the axios interceptor. A `401` response clears the token and logs the user out in the UI. CORS allows any `localhost`/`127.0.0.1` dev origin on any port (`backend/config/cors.php`), so Vite port changes cannot break signup again. Login and registration are rate-limited to 10 requests/minute per IP.

Passwords are hashed by Laravel's `hashed` cast and never returned. Public registration only accepts validated `username`, `email` and `password` fields, so a submitted `role`/admin flag is ignored. Login errors are identical for an unknown account and a wrong password.

## Tests and checks

```bash
# Backend (uses an in-memory SQLite database — never touches your data)
cd backend
php artisan test

# Frontend
cd frontend
npm run build
npm run lint
```

`tests/Feature/AuthTest.php` covers registration (success, required/invalid/duplicate fields, hashed passwords, ignored privilege fields), login (username, email, invalid credentials, empty fields), protected routes, and token revocation on logout.

## Deploy to Render

`render.yaml` at the repository root is a Render Blueprint that provisions all three
pieces automatically:

| Service | Type | Public URL |
|---|---|---|
| `hci-blue-app-db` | Render Postgres (free) | private |
| `hci-blue-app-api` | Docker web service (nginx + PHP-FPM 8.4.27) | `https://hci-blue-app-api.onrender.com` |
| `hci-blue-app` | Static site (Vite build) | `https://hci-blue-app.onrender.com` |

### Steps

1. Push everything to `main` (Blueprint deploys read from Git).
2. In the Render Dashboard, click **New → Blueprint**.
3. Connect `https://github.com/danfred06/HCI.git` and select branch `main`.
4. Render detects `render.yaml`; review the three resources and click **Deploy Blueprint**.
5. Wait for both web services to become **Live**, then open the frontend URL above.

Render generates `APP_KEY` automatically, injects the Postgres connection string as
`DB_URL`, and supplies `FRONTEND_URL` / `VITE_API_URL` so CORS and the API base URL
work out of the box. Migrations, config/route caching and the `public/storage` link
run from `backend/scripts/00-laravel-deploy.sh` on every container start.

### If you rename a service or add a custom domain

Keep these three values consistent (they are set in `render.yaml`):

- API service: `APP_URL` → your API's public URL
- Frontend service: `FRONTEND_URL` (on the API) → your frontend's public URL
- Frontend build: `VITE_API_URL` → `<your API URL>/api`

Then trigger a manual deploy of both services.

### Free-plan caveats

- Render's free Postgres database is deleted after **30 days**; create a new one or
  upgrade to a paid instance for a permanent deployment.
- Free web services spin down when idle, so the first request after inactivity can
  take ~30–60 seconds while the container and migrations start.
- Uploaded images use the local `public/storage` disk, which resets on each deploy.
  Move `FILESYSTEM_DISK` to S3 (or similar) before relying on permanent uploads.

## Notes on the spec

- The wireframe navbar links to **Settings**, but the original document had no route for it; a protected Settings page and `PUT /api/profile` were added.
- Avatars and post images are served from `storage/app/public` via `php artisan storage:link`; `APP_URL` must match the API origin for generated image URLs.
- The composer shows an image preview and the feed offers a delete button for your own posts.
- The app logo (`frontend/public/logo.png`) is taken directly from the user-supplied logo image — a blue graphic mark above the dark navy `#021C5B` "My Blue App" wordmark, extracted onto a transparent background. `frontend/public/logo-mark.png` is the cropped graphic used as the favicon. Both appear in the navbar and on Login/Sign Up.
- The UI follows the supplied screenshots: a Facebook-style layout with top nav (logo, Dashboard / My Profile / Friends / Logout), left sidebar (search, profile, News Feed, Saved, Groups, Chats), center feed and right widget. Palette sampled directly from the screenshots: `#DBF2F6` background, `#C0E5F8` nav, `#FFF8F8` cards, `#EFEAEA` inputs and `#4D8BE9` blue.
- The 102 × 119 right-hand box is kept as a reserved widget placeholder, as in the wireframe.
- Lint (`npm run lint`) reports only advisory React fast-refresh/effect warnings from the standard provider and data-fetching patterns used in the spec.
