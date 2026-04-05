# MicroInterns HR — Frontend

This is the Vite + React frontend for the MicroInterns HR Portal.

Overview
- Built with React 18 and Vite.
- Small SPA that talks to the backend API (see `VITE_API_URL`).

Prerequisites
- Node.js >= 18 (tested with Node 20)
- npm >= 9 (or yarn/pnpm)

# MicroInterns HR — Frontend

This is the Vite + React frontend for the MicroInterns HR Portal.

Overview
- React 18 + Vite. Small SPA that talks to the backend API.

Prerequisites
- Node.js >= 18 (Node 20 recommended) and npm (>=9) or an alternative package manager.

Environment variables
- `VITE_API_URL` — base URL for backend API (example: `http://localhost:8080`). See `frontend/.env.example` for a template.

Common commands
- Install dependencies
```bash
cd frontend
npm ci
```

- Run the development server (hot reload)
```bash
npm start
# opens http://localhost:5173 by default
```

- Build for production
```bash
npm run build
# outputs to dist/
```

- Preview the built app locally
```bash
npm run preview
# preview served on port 4173 by default
```

Docker (production static hosting)
- The `frontend/Dockerfile` builds the app and serves it with nginx with a small set of security headers. Example build:
```bash
docker build -t microinterns-hr-frontend:latest ./frontend
docker run --rm -p 80:80 microinterns-hr-frontend:latest
```

CSRF & CORS notes
- The frontend reads a cookie named `XSRF-TOKEN` (set by the backend) and sends it in the `X-XSRF-TOKEN` header for mutating requests (POST/PUT/DELETE).
- If frontend and backend are on different origins, the backend must allow the frontend origin and allow credentials; frontend fetches should use `credentials: 'include'`.

Production tips
- Serve the built `dist/` behind a TLS-terminating reverse proxy or CDN.
- Set `VITE_API_URL` to the production backend API URL at build time or provide it via environment injection in your hosting platform.

Troubleshooting
- If you run into CORS/cookie problems:
  - Verify `VITE_API_URL` is correct.
  - Verify backend `frontend.origin` includes the frontend origin and CORS allows credentials.
  - Ensure cookies are not blocked by browser privacy settings.

Next steps
- Integrate the frontend with an authenticated backend (OIDC/SSO) and deploy both behind HTTPS.
