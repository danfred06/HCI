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

Bearer tokens are stored in `localStorage` and sent by the axios interceptor. A `401` response clears the token and logs the user out in the UI. CORS allows any `localhost`/`127.0.0.1` dev origin on any port (`backend/config/cors.php`), so Vite port changes cannot break signup again.

## Notes on the spec

- The wireframe navbar links to **Settings**, but the original document had no route for it; a protected Settings page and `PUT /api/profile` were added.
- Avatars and post images are served from `storage/app/public` via `php artisan storage:link`; `APP_URL` must match the API origin for generated image URLs.
- The composer shows an image preview and the feed offers a delete button for your own posts.
- The app logo (`frontend/public/logo.png`) is taken directly from the user-supplied logo image — a blue graphic mark above the dark navy `#021C5B` "My Blue App" wordmark, extracted onto a transparent background. `frontend/public/logo-mark.png` is the cropped graphic used as the favicon. Both appear in the navbar and on Login/Sign Up.
- The UI follows the supplied screenshots: a Facebook-style layout with top nav (logo, Dashboard / My Profile / Friends / Logout), left sidebar (search, profile, News Feed, Saved, Groups, Chats), center feed and right widget. Palette sampled directly from the screenshots: `#DBF2F6` background, `#C0E5F8` nav, `#FFF8F8` cards, `#EFEAEA` inputs and `#4D8BE9` blue.
- The 102 × 119 right-hand box is kept as a reserved widget placeholder, as in the wireframe.
- Lint (`npm run lint`) reports only advisory React fast-refresh/effect warnings from the standard provider and data-fetching patterns used in the spec.
