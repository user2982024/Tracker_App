# Tracker App

A full-stack personal productivity dashboard.

## Structure
- Frontend: React (Vite)
- Backend: Node.js, Express, MongoDB

## Development
Run the frontend and backend in separate terminals from the project root:

```sh
npm run dev:backend
npm run dev:frontend
```

The backend reads `Backend/.env` and needs a valid `MONGO_URI` and `JWT_SECRET`.
The frontend proxies `/api` requests to `http://127.0.0.1:5000` in development.
The API reports its database readiness at `/api/health`.

## Deployment

Deploy `Backend` as a Node service and `Frontend` as a static Vite site. Set
`PORT`, `MONGO_URI`, and `JWT_SECRET` on the backend. Set `FRONTEND_URL` to the
exact deployed frontend origin (and `CORS_ORIGINS` to any additional origins,
comma-separated). Build the frontend with `VITE_API_URL` set to the backend's
origin, such as `https://api.example.com`; leave it empty when a same-origin
reverse proxy forwards `/api` to the backend. Production cookies require HTTPS.
For a cross-origin frontend/backend pair, the default production cookie policy
uses `SameSite=None`; set `COOKIE_SAME_SITE=lax` when the app is served through
the same site/reverse proxy.

Before accepting traffic, check `GET /api/health`; it returns HTTP 200 only
when MongoDB is connected and HTTP 503 while the database is unavailable.

## Features
- Authentication (JWT)
- Notes, Todos, Goals, Habits
- Drag & Drop Dashboard
