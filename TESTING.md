# Testing the MicroInterns HR Platform

This document explains how to run and test the MicroInterns HR application locally, including the new **JWT authentication** and **student onboarding workflow** features.

## Prerequisites

- **Java 17** installed (or use Docker builder to build the jar)
- **Node.js** (for the frontend) if you want to run the UI locally
- **MailDev** (optional, for testing email functionality): `npm install -g maildev`

---

## Quick Start

### 1. Start the Backend

```bash
# From repo root
cd backend

# Build the application
mvn -DskipTests=true clean package

# Run the JAR
java -jar target/hrplatform-0.0.1-SNAPSHOT.jar
```

Backend will start on: import.meta.env.VITE_API_URL ✅

### 2. Start the Frontend

```bash
# From repo root
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm start
```

Frontend will start on: **http://localhost:5173**

### 3. Start MailDev (Optional - for email testing)

```bash
# Install globally (first time only)
npm install -g maildev

# Start MailDev
maildev
```

- SMTP Server: **localhost:1025** (backend sends emails here)
- Web UI: **http://localhost:1080** (view captured emails)

---

## Authentication & Authorization

### JWT Token-Based Authentication

The application now uses **JWT (JSON Web Tokens)** for stateless authentication instead of Basic Auth + CSRF.

#### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| `hr1@example.com` | `hrpass` | HR_ADMIN |
| `admin@example.com` | `adminpass` | SUPER_ADMIN |

#### Login Flow

1. **Login** via frontend at `http://localhost:5173/login` or API:

```bash
curl -X import.meta.env.VITE_API_URL ✅\
  -H "Content-Type: application/json" \
  -d '{"email":"hr1@example.com","password":"hrpass"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "hr1@example.com",
  "roles": ["ROLE_HR_ADMIN"]
}
```

2. **Use the token** in subsequent requests:

```bash
TOKEN="your-jwt-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/students
```

#### Token Details

- **Expiration**: 24 hours (configurable via `jwt.expiration` property)
- **Storage**: Frontend stores token in `localStorage` with key `jwt_token`
- **Header Format**: `Authorization: Bearer {token}`

---

## Student Onboarding Workflow

### Overview

The new onboarding workflow allows HR admins to add students who then receive an email with a secure link to complete their profile.

### Complete Workflow Test

#### Step 1: HR Admin Adds Student

1. Login as HR admin (`hr1@example.com` / `hrpass`)
2. Navigate to Dashboard
3. Click **"Add Student"**
4. Fill in basic details:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Organization**: Tech Corp
5. Submit the form

**What happens:**
- Student record created with `PENDING_ONBOARDING` status
- Unique onboarding token generated (7-day validity)
- Case automatically created with logged-in HR user as owner
- Email sent to student with onboarding link
- Notification email sent to HR admin

#### Step 2: Check Email (MailDev)

1. Open **http://localhost:1080** (MailDev web interface)
2. You should see 2 emails:
   - **To student**: Onboarding link with instructions
   - **To HR**: Case assignment notification
3. Copy the onboarding link from student email (looks like: `http://localhost:5173/onboarding/{token}`)

#### Step 3: Student Completes Onboarding

1. Open the onboarding link in browser
2. Complete the **5-step form**:
   
   **Step 1: Personal Details**
   - Phone number
   - Date of birth
   - Complete address

   **Step 2: Emergency Contact**
   - Contact name
   - Phone number
   - Relationship

   **Step 3: Education History**
   - Degree/Qualification
   - Institution
   - Year of graduation
   - GPA/Percentage
   - (Can add multiple education entries)

   **Step 4: Work Experience & IDs**
   - Company, role, duration, description (optional, can add multiple)
   - National ID / Aadhaar number
   - Passport number (optional)

   **Step 5: Bank Details & Documents**
   - Bank account number
   - Bank name
   - IFSC code
   - Upload resume (PDF/DOC)
   - Upload additional documents (certificates, IDs, etc.)

3. Submit the form

**What happens:**
- All details saved to database
- Files uploaded to `backend/uploads/` directory
- Student status changes to `ONBOARDING_COMPLETE`
- Case status changes to `PENDING` for HR verification

#### Step 4: HR Verifies Student

1. Return to HR dashboard
2. Student now appears with **PENDING** status
3. HR can review details and approve/activate the case

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT token |
| GET | `/students/onboarding/{token}` | Get student details by onboarding token |
| POST | `/students/onboarding/{token}` | Submit onboarding form (multipart) |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/students` | List all students | HR_ADMIN, SUPER_ADMIN |
| GET | `/students/{id}` | Get student details | HR_ADMIN, SUPER_ADMIN |
| POST | `/students` | Add new student | HR_ADMIN, SUPER_ADMIN |
| DELETE | `/students/{id}` | Delete student | SUPER_ADMIN only |
| GET | `/cases` | List all cases | HR_ADMIN, SUPER_ADMIN |
| POST | `/cases` | Create new case | HR_ADMIN, SUPER_ADMIN |

---

## Database Access

### H2 Console (In-Memory Database)

- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:hrdb` (or check console output for actual DB name)
- **Username**: `sa`
- **Password**: (leave blank)

### Seeded Sample Data

The application automatically seeds demo data at startup:

**Students:**
- Alice (alice@example.com)
- Bob (bob@example.com)

**HR Users:**
- hr1@example.com (password: hrpass) - HR_ADMIN role
- admin@example.com (password: adminpass) - SUPER_ADMIN role

**Cases:**
- Case 1 (student: Alice, owner: HR1, status: ACTIVE)
- Case 2 (student: Bob, owner: Admin, status: PENDING)

---

## Testing Scenarios

### Scenario 1: JWT Authentication Flow

```bash
# 1. Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr1@example.com","password":"hrpass"}' \
  | jq -r '.token'

# 2. Save token
TOKEN="<paste-token-here>"

# 3. List students (authenticated)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/students

# 4. Add student (authenticated)
curl -X POST http://localhost:8080/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "org": "Startup Inc"
  }'
```

### Scenario 2: Complete Onboarding Workflow

1. **Login** as HR admin via frontend
2. **Add student** with valid email
3. **Check MailDev** at http://localhost:1080 for onboarding email
4. **Copy onboarding link** from email
5. **Open link** and complete all 5 steps
6. **Upload files** (resume + documents)
7. **Submit form**
8. **Verify** student appears in HR dashboard with PENDING status

### Scenario 3: Token Expiry & Validation

```bash
# Get onboarding link from email (token visible in URL)
TOKEN="<onboarding-token>"

# Fetch student by token (should work within 7 days)
curl http://localhost:5173/onboarding/$TOKEN

# After 7 days, should return 410 Gone error
# If onboarding already completed, should return 410 Gone
```

---

## File Storage

Uploaded files are stored in: `backend/uploads/`

**Naming convention:**
- Resumes: `student-{id}-resume-{original-filename}`
- Documents: `student-{id}-doc-{index}-{original-filename}`

---

## Email Configuration

### Development (MailDev)

Default configuration uses MailDev for local testing:

```properties
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
```

### Production SMTP

Update `application.properties` for production:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## Troubleshooting

### Backend Issues

**Problem**: Backend fails to start
- Check Java version: `java -version` (must be 17+)
- Rebuild: `mvn clean package`
- Check port 8080 is not in use

**Problem**: Emails not sending
- Ensure MailDev is running: `maildev`
- Check SMTP settings in `application.properties`
- View logs for email service errors

**Problem**: JWT token invalid
- Check token expiration (24 hours default)
- Verify token is sent in `Authorization: Bearer {token}` header format
- Check JWT secret in `application.properties`

### Frontend Issues

**Problem**: Login fails with 401
- Verify credentials (hr1@example.com / hrpass)
- Check backend is running on port 8080
- Clear browser localStorage and try again

**Problem**: Onboarding link shows error
- Verify token hasn't expired (7 days)
- Check if student already completed onboarding
- Verify backend `/students/onboarding/{token}` endpoint is accessible

**Problem**: File upload fails
- Check file size limits (default: Spring Boot max file size)
- Ensure `uploads/` directory exists and is writable
- Verify file types are allowed (.pdf, .doc, .docx, .jpg, .png)

### Database Issues

**Problem**: H2 console shows "Table not found"
- Verify Hibernate created schema (check startup logs)
- Check `spring.jpa.hibernate.ddl-auto=update` in properties

**Problem**: Seeded data missing
- Check `DataInitializer` logs in console output
- Verify database is empty on first startup
- Manually run `backend/db/seed-local.sql` in H2 console

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `backend/pom.xml` | Maven dependencies (JWT, Mail, JPA) |
| `backend/src/main/resources/application.properties` | App configuration (JWT, email, DB) |
| `backend/src/main/java/.../config/SecurityConfig.java` | Security, JWT filter, authorization |
| `backend/src/main/java/.../config/JwtUtil.java` | JWT token generation/validation |
| `backend/src/main/java/.../services/EmailService.java` | Email sending logic |
| `backend/src/main/java/.../models/Student.java` | Student entity with onboarding fields |
| `frontend/src/pages/StudentOnboardingPage.jsx` | 5-step onboarding form |
| `frontend/src/lib/api.js` | API client with JWT token handling |

---

## Advanced Testing

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Login and get token first
TOKEN="your-jwt-token"

# Test student listing endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/students
```

### Integration Testing

```bash
# Run backend tests
cd backend
mvn test

# Run with coverage
mvn test jacoco:report
```

---

## Security Notes

- **JWT Secret**: Change `jwt.secret` in production to a strong, random value (min 256 bits)
- **HTTPS**: Always use HTTPS in production
- **CORS**: Update `frontend.origin` in `application.properties` for production domain
- **File Upload**: Implement virus scanning for uploaded documents in production
- **Email**: Use authenticated SMTP with proper credentials in production
- **Database**: Switch from H2 to PostgreSQL in production

---

## Support

For issues or questions:
1. Check backend console logs for errors
2. Check browser console (F12) for frontend errors
3. Verify all services are running (backend, frontend, MailDev)
4. Review this testing guide for common solutions


```bash
# from repo root
cd backend
# Run the app with the `local` Spring profile which uses an in-memory H2 DB and loads `data.sql`.
# Option A: using your JDK 17 directly
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -Dspring-boot.run.profiles=local spring-boot:run

# Option B: run the built jar with the profile
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 /usr/lib/jvm/java-17-openjdk-amd64/bin/java -jar target/hrplatform-0.0.1-SNAPSHOT.jar --spring.profiles.active=local

# Option C: if you don't have JDK 17, use a Docker builder to produce the jar then run it on a JDK 17 runtime
docker run --rm -v "$PWD/backend":/src -w /src maven:3.9.5-eclipse-temurin-17 mvn -DskipTests package
```

H2 console (web UI)
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:hrdb`
- Username: `sa`
- Password: (leave blank)

- Seeded sample data (automatic)
- The application includes a JPA-based initializer (`DataInitializer`) that seeds demo data at startup when the database is empty. The seeded content is:
  - Students:
    - Alice — alice@example.com
    - Bob — bob@example.com
  - HR users:
    - HR1 — hr1@example.com
    - AdminUser — admin@example.com
  - Cases:
    - Case 1 (student Alice) — status: ACTIVE
    - Case 2 (student Bob) — status: PENDING

Manual SQL seed script
- A SQL seed script is provided at `backend/db/seed-local.sql` if you prefer to load data manually through the H2 console or other tools.
- Note: to avoid ordering issues with automatic schema initialization, that script is not executed automatically — use the H2 console or run the file manually against your DB.
- Students:
  - Alice — alice@example.com
  - Bob — bob@example.com
- HR users:
  - HR1 — hr1@example.com
  - AdminUser — admin@example.com
- Cases:
  - Case 1 (student Alice) — status: ACTIVE
  - Case 2 (student Bob) — status: PENDING

Authentication (test user)
-- The application ships with an in-memory user (for local testing) configured in `SecurityConfig`.
  - Username: `admin`
  - Password: `adminpass`
  - Role: `HR`

End-to-end test scenarios

1) Open the frontend dev server

```bash
cd frontend
npm ci
npm start
# opens: http://localhost:5173
```

2) View the public students list (no login required for GET)
- Point your browser to the frontend or call the API directly:

```bash
curl -i http://localhost:8080/students
```

3) Login (Basic auth) and perform a protected request
- Example (login + CSRF flow) using curl:

```bash
# 1) fetch the CSRF cookie and save cookies to jar
curl -c cookies.txt -i http://localhost:8080/csrf-token

# 2) read the XSRF-TOKEN cookie value (example using grep/awk; adjust per shell)
XSRF=$(grep XSRF-TOKEN cookies.txt | awk '{print $7}')

# 3) create a new student (protected endpoint) — send cookie jar, include X-XSRF-TOKEN and Basic auth
curl -b cookies.txt -H "X-XSRF-TOKEN: $XSRF" -u admin:adminpass -H "Content-Type: application/json" -X POST http://localhost:8080/students -d '{"name":"Charlie","email":"charlie@example.com","org":"Acme"}'
```

Notes about CSRF and cookies
- The backend sets a cookie named `XSRF-TOKEN` (CookieCsrfTokenRepository). The frontend should read that cookie and send it as `X-XSRF-TOKEN` header for mutating requests. When testing with curl, fetch the `/csrf-token` first and then include the value in the header.

Troubleshooting
- If the H2 console reports "Table not found": verify you launched with `--spring.profiles.active=local` so the H2 config and `data.sql` are used and Hibernate created the schema.
- If `curl` POST fails with 403: ensure you included the X-XSRF-TOKEN header value and cookies in the request.
- If authentication fails: verify you used the in-memory admin credentials `admin`/`adminpass` or override via `app.admin.user` and `app.admin.pass` environment variables.

Where to look in the code
- Seed code: `src/main/resources/data.sql` and `com.microinterns.hrplatform.config.DataInitializer` (provides a JPA-based fallback seeding when DB is empty).
- H2/dev properties: `src/main/resources/application-local.properties` (profile name `local`).
- Security config: `com.microinterns.hrplatform.config.SecurityConfig` (in-memory user, CSRF & CORS setup).
