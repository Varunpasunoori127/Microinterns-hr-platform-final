## MicroInterns HR - Playbook

This repository contains a small Spring Boot backend and a Vite + React frontend for HR onboarding/offboarding. The project is intended as a demo/prototype with production-ready hardening suggestions included.

This README highlights the most common tasks: running locally, building for production, Docker tips, and troubleshooting.

Prerequisites
- Node.js (recommended >= 20) for the frontend
- JDK 17 for the backend (Spring Boot 3 / Spring Framework 6 require Java 17+)
- Docker (optional) for containerized builds and running images

Quick start (development)

Frontend (dev server)
```bash
cd frontend
npm ci
npm start
# opens http://localhost:5173 by default
```

Backend (dev)
```bash
cd backend
# use your JDK 17 installation or set JAVA_HOME to a JDK 17 path
mvn spring-boot:run
# or run the built jar (see build section)
```

Run the integrated app
- Start the backend on port 8080 (default)
- Start the frontend dev server (port 5173) or build+preview (4173)
- The frontend is configured to read `VITE_API_URL` to locate the backend API (see `frontend/.env.example`).

Building for production

Backend (maven)
```bash
cd backend
# ensure JDK 17 is used for the build
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -DskipTests package
# produces target/hrplatform-0.0.1-SNAPSHOT.jar (repackaged by spring-boot-maven-plugin)
```

If you don't have JDK 17 installed locally, you can use a Maven Docker builder image:
```bash
# run from repo root
docker run --rm -v "$PWD/backend":/src -w /src maven:3.9.5-eclipse-temurin-17 mvn -DskipTests package
```

Frontend (Vite)
```bash
cd frontend
npm ci
npm run build
# preview built site:
npm run preview
# or serve `dist/` behind an nginx/TLS reverse proxy in production
```

Docker images
- Frontend: multi-stage build that produces static files and serves them with nginx (see `frontend/Dockerfile` and `frontend/nginx/nginx.conf`).
- Backend: create an image after building the jar (see `backend/README.md` for example docker run usage).

CI
- This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml`. It already targets Node 20 and JDK 17; ensure your CI runners match those versions.

Security & production notes
- Java runtime: use JDK 17+ for the backend build and run. CI must use Java 17.
- Authentication: The project currently includes an in-memory bootstrap admin user for development — replace this with an OIDC/SSO provider (Keycloak/Okta/Azure AD) in production.
- CSRF: backend uses a cookie-based CSRF token (`XSRF-TOKEN`) — the frontend reads this cookie and sends it as `X-XSRF-TOKEN` for mutating requests. CORS must allow credentials when front and back are on different origins.
- Database: switch from H2 (dev) to PostgreSQL in production and add schema migrations (Flyway or Liquibase).

Troubleshooting
- "error: release version 17 not supported" — make sure Maven and the java used for compilation are Java 17. Set `JAVA_HOME` to a Java 17 JDK.
- "no main manifest attribute" — ensure the Spring Boot maven plugin is included in `backend/pom.xml`; the project already includes it and the `target/*-SNAPSHOT.jar` is repackaged at build time.
- CORS/cookie problems — verify `frontend.origin`, `VITE_API_URL`, and that the frontend fetches with `credentials: 'include'`.

Next steps (recommended)
1. Replace in-memory auth with OIDC/SSO.
2. Add Flyway/Liquibase migrations and switch to PostgreSQL for production.
3. Add `spring-boot-starter-actuator` for health/metrics and secure actuator endpoints.
4. Harden CI to run unit/integration tests and build/publish Docker images.

For more details see `backend/README.md` and `frontend/README.md`.
# MicroInterns HR - Playbook

This repository contains a small Spring Boot backend and a Vite + React frontend for HR onboarding/offboarding.

Quick start (development):

Frontend
```
cd frontend
npm install
npm start
```

Backend
```
cd backend
mvn spring-boot:run
```

Production notes
- The backend now includes Spring Security and validation. There is an in-memory admin user (default `admin` / `adminpass`) configured via `app.admin.user` and `app.admin.pass` properties — replace with a proper auth provider in production (OIDC/SSO).
- Frontend expects `VITE_API_URL` to point to the backend API.
- Dockerfiles are provided for both frontend and backend; the frontend Docker image uses nginx with security headers.

CI
-- This repo includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs two jobs:
	- `frontend`: uses Node 20 to run `npm ci` and `npm run build` (uploads `frontend/dist` as an artifact)
	- `backend`: uses JDK 17 to run `mvn -DskipTests package` and uploads the built jar as an artifact

Local builds (if you don't have JDK 17 locally)
- Frontend (Node): use the standard `npm ci` / `npm run build` commands in the `frontend/` directory.
- Backend (JDK 17 required): if you cannot install JDK 17 locally, build the backend using a Docker builder image with JDK 17:

```bash
# from repo root
docker run --rm -v "$PWD/backend":/src -w /src maven:3.9.5-eclipse-temurin-17 mvn -DskipTests package
```

This produces the `target/*.jar` built inside the `backend/target` directory on the host.
# MicroInterns HR Onboarding/Offboarding Platform

Modern HR SaaS platform for managing MicroInterns onboarding, offboarding, document uploads, HR ownership, reassignment, surveys and certificates.

## Tech Stack
- Frontend: React
- Backend: Spring Boot (Java)
- Database: PostgreSQL

## Folders
- `frontend/` — React app
- `backend/` — Spring Boot app

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```