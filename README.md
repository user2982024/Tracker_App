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

The backend reads `Backend/.env` and needs a valid `MONGO_URI`. The frontend
proxies `/api` requests to `http://127.0.0.1:5000`. The API stays available
during a temporary MongoDB outage and reports its status at `/api/health`.

## Features
- Authentication (JWT)
- Notes, Todos, Goals, Habits
- Drag & Drop Dashboard

<!-- sheikhabrar2171@gmail.com -->
<!-- sscx9Sky1 -->
