# SurgiConnect - Local Development Backend

This project includes a minimal backend for local development located at `server/index.js`.

Features:
- GET /api/directory -> returns hospitals and specialists (mock data)
- GET /api/videos -> returns a small video library (mock data)
- GET /api/patients/:id -> returns a mock patient object with tasks
- POST /api/auth/login -> accepts JSON { username, password } and returns a mock token

How to run locally (Windows PowerShell):

1. Start the backend server:

```powershell
npm run start:server
```

2. In a separate terminal start the frontend dev server:

```powershell
npm run dev
```

Vite is configured to proxy `/api` to `http://localhost:5000` during development.

Notes and next steps:
- This backend is intentionally minimal and uses in-memory mock data for rapid frontend development.
- For production, replace with a proper Node/Express server and persistent storage (Postgres, MongoDB, etc.).
- Add authentication, input validation, and rate limiting before exposing to the internet.
