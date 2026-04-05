# MicroInterns HR — Backend

This is the Spring Boot backend for the MicroInterns HR Portal. It provides simple REST endpoints for managing students and cases.

Overview
- Spring Boot 3.2.x, Spring Framework 6 (requires Java 17+)
- JPA (Spring Data JPA) for persistence
- Spring Security configured (basic/in-memory for bootstrapping; replace with OIDC/SSO in production)
- Validation (Jakarta Validation)

Prerequisites
- JDK 17 (required to build and run Spring Boot 3.x)
- Maven 3.8+ (or use the included Maven wrapper if present)

Dependencies (selected)
- org.springframework.boot:spring-boot-starter-web (Spring Boot 3.2.0)
- org.springframework.boot:spring-boot-starter-security
- org.springframework.boot:spring-boot-starter-data-jpa
- org.springframework.boot:spring-boot-starter-validation
- org.postgresql:postgresql (runtime)

Important project settings
- Java version: 17 (set in `pom.xml`)

Configuration and environment
- `src/main/resources/application.properties` contains defaults used in development. Important properties:
  - `frontend.origin` — allowed origin for CORS (default: `http://localhost:5173`)
  - `server.port` — application port (default: `8080`)

- Runtime / Production environment variables (recommended)
  - `app.admin.user` — admin username for the bootstrap in-memory user (default `admin`)
  - `app.admin.pass` — admin password for the bootstrap in-memory user (default `adminpass`) — override in production using secrets manager
  - Database connection properties: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`

Security notes
- CSRF protection is enabled and a cookie-based CSRF token repository is used. The frontend must read `XSRF-TOKEN` cookie and send it in the `X-XSRF-TOKEN` header for POST/PUT/DELETE calls.
- CORS is configured to allow the configured `frontend.origin`; update in production to your actual frontend URL.
- Currently an in-memory admin user is provided for bootstrapping; do not use in production. Integrate with an OIDC provider (Keycloak, Okta, Azure AD) or another identity provider.

Build & Run (development)
# MicroInterns HR — Backend

This is the Spring Boot backend for the MicroInterns HR Portal. It provides REST endpoints for managing students and cases and includes security and validation wiring suitable for development and easy hardening for production.

Key details
- Spring Boot 3.2.x (Spring Framework 6) — requires Java 17+
- Spring Security (cookie-based CSRF token + CORS configuration)
- Spring Data JPA (H2 default in dev; Postgres recommended for production)
- Jakarta Validation for request validation

Prerequisites
- JDK 17 installed and available (set JAVA_HOME to the JDK 17 path).
- Maven 3.8+ (or use the Maven Docker builder if JDK 17 is not available locally).

Configuration
- Main properties file: `src/main/resources/application.properties`.
  - `frontend.origin` — allowed origin(s) for CORS (comma-separated). Dev defaults include `http://localhost:5173` and preview port `http://localhost:4173`.
  - `server.port` — application port (default: `8080`).

Recommended runtime environment variables (production)
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` — Postgres connection for production.
- `app.admin.user` and `app.admin.pass` — admin bootstrap credentials (development only). Store secrets in a secret manager in production.

Security notes
- CSRF: the app uses a cookie-based CSRF token (cookie name `XSRF-TOKEN`). The frontend must read that cookie and send it in `X-XSRF-TOKEN` for mutating requests.
- CORS: configured based on `frontend.origin` and allows credentials. Ensure you set a strict origin in production.
- Auth: currently an in-memory admin user is used for bootstrap — replace with an OIDC provider (Keycloak/Okta/Azure AD) for production.

Build & Run (development)
```bash
# from repository root
cd backend
# build (ensure JDK 17 is used)
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -DskipTests package

# run using Maven (dev)
mvn spring-boot:run

# or run the repackaged jar (requires Java 17 to run)
/usr/lib/jvm/java-17-openjdk-amd64/bin/java -jar target/hrplatform-0.0.1-SNAPSHOT.jar
```

Build without local JDK 17 (Docker builder)
```bash
docker run --rm -v "$PWD/backend":/src -w /src maven:3.9.5-eclipse-temurin-17 mvn -DskipTests package
```

Docker (example)
```bash
# build jar then an image (Dockerfile expected in backend/)
cd backend
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -DskipTests package
docker build -t microinterns-hr-backend:latest .

# run the container (example connecting to a Postgres DB)
docker run -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/hrdb \
  -e SPRING_DATASOURCE_USERNAME=postgres -e SPRING_DATASOURCE_PASSWORD=secret \
  -e app.admin.user=admin -e app.admin.pass=secret -p 8080:8080 microinterns-hr-backend:latest
```

Testing
- The repository contains a basic integration test file under `src/test`. The `pom.xml` includes test-scoped dependencies (`spring-boot-starter-test` and `spring-security-test`). CI should run tests on JDK 17.

Observability
- For production, add `spring-boot-starter-actuator` and secure actuator endpoints.

Troubleshooting
- Build error "release version 17 not supported": set `JAVA_HOME` to a JDK 17 installation or use the Docker builder image.
- If you see "no main manifest attribute" when running the jar, ensure the spring-boot-maven-plugin is present in `pom.xml` (this project already includes it) and that the repackaged artifact exists at `target/*.jar`.
- CORS/cookie problems: verify `frontend.origin`, `VITE_API_URL`, and that frontend requests include credentials when front and back are on different origins.

Next steps (recommended)
1. Replace in-memory auth with OIDC/SSO provider (Keycloak/Okta/Azure AD).
2. Add schema migrations (Flyway or Liquibase) and target Postgres in production.
3. Add Actuator and centralized logging/metrics.
4. Add CI job to build and publish Docker images for both frontend and backend.
