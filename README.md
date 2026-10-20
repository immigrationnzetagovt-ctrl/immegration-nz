# VisaPath Demo Portal

> **IMPORTANT EDUCATIONAL NOTICE**  
> **DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT**  
> This project is a fictional, educational software demonstration designed to illustrate full-stack architecture, authenticated multi-step workflows, database persistence, authorization boundaries, and server-side PDF generation.  
> - **DO NOT enter real personal passport data.** Use fictional mock values only.  
> - **This platform has no government affiliation.** It does not confer any legal visa status or immigration authorization. No government logos, official seals, or authentic state crests are used.

---

## 🧭 Architectural Overview

VisaPath Demo Portal models a modern, high-assurance web portal. It is structured into two clean tiers: a **React + Vite** single-page application frontend and a modular **Node.js + Express + MongoDB** backend.

```
immegration 2/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DemoDisclaimerBanner, ProtectedRoute
│   │   ├── hooks/              # useAuth context hook for session management
│   │   ├── layouts/            # MainLayout (global banner, navbar, outlet, footer)
│   │   ├── pages/              # Home, Login, RegisterStepOne, RegisterStepTwo, ApplicationDetails
│   │   ├── services/           # api.js (Axios), authService.js, applicationService.js
│   │   ├── styles/             # index.css with custom design tokens and typography
│   │   ├── App.jsx             # React Router routing configuration
│   │   └── main.jsx            # Application entrypoint
│   ├── index.html              # HTML shell with Google Fonts & metadata
│   ├── vite.config.js          # Vite config with Tailwind plugin & API proxy
│   └── package.json
├── server/                     # Backend API & Services
│   ├── config/                 # db.js (MongoDB Mongoose connection & error handling)
│   ├── controllers/            # authController.js, applicationController.js
│   ├── middleware/             # authMiddleware.js, errorMiddleware.js, rateLimiter.js
│   ├── models/                 # User.js (bcrypt hashed), Application.js
│   ├── routes/                 # authRoutes.js, applicationRoutes.js
│   ├── services/               # authService.js, applicationService.js, pdfService.js (PDFKit)
│   ├── validators/             # authValidator.js, applicationValidator.js
│   ├── tests/                  # api.test.js (Unit/integration), e2e-curl-test.js (E2E)
│   ├── .env.example            # Environment configuration template
│   ├── server.js               # Express application entrypoint
│   └── package.json
├── package.json                # Root package for workspace orchestration
└── README.md                   # Full documentation & setup guide
```

---

## 🛠️ Technology Stack

### Frontend
- **React (v19)** with **Vite** for fast builds and hot module replacement
- **Vanilla CSS + Tailwind CSS** with curated modern tokens, Google Fonts (Plus Jakarta Sans & Inter), and deep navy/slate aesthetics
- **React Router (v7)** for declarative routing and protected routes
- **Axios** with `withCredentials: true` for automatic HTTP-only cookie exchange
- **Lucide React** for lightweight, restrained iconography

### Backend
- **Node.js (v20+)** & **Express**
- **MongoDB** running locally with **Mongoose ODM**
- **bcryptjs** (salt rounds = 12) for one-way password hashing
- **jsonwebtoken (JWT)** delivered in secure **HTTP-only cookies** (`SameSite: 'lax'`)
- **PDFKit** for server-side PDF stream generation with educational banners and sample data
- **express-rate-limit** to prevent brute-force attacks on authentication routes
- **helmet** & **cors** configured for local development

---

## 📋 Key Pages & Features

1. **Home Page (`/`)**
   - Executive navy, clean slate styling, and generous whitespace.
   - Prominent educational warning banner and status ticker.
   - Hero section featuring primary **"Check Test Results"** CTA navigating to `/login`.
   - Simulated visa categories overview (Visitor, Student, Business, Work, Transit).
   - Step-by-step workflow explanation and interactive FAQ accordion.
   - Professional footer with architecture specs and disclaimers.

2. **Login Page (`/login`)**
   - Client-side and server-side email and password validation.
   - Show / hide password toggle.
   - Loading spinners and contextual error banners.
   - Redirects to `/application` upon successful login.

3. **Registration Step One (`/register`)**
   - Collects Family Name / Display Name, Email, Password, and Password Confirmation.
   - Strong password requirements (minimum 8 characters, uppercase, lowercase, and number).
   - Duplicate email prevention (returns HTTP 409 Conflict if email is already taken).
   - Upon successful account initialization, automatically advances to Step Two.

4. **Registration Step Two (`/register/step-2`)**
   - Multi-section form collecting personal and sample travel details.
   - Pre-populated default values as requested:
     - **Nationality:** `New Zealand`
     - **Visa Category:** `Visitor`
     - **Gender:** `Male`
     - **Entry Type:** `Multiple entry`
     - **Fictional Passport:** Sample educational placeholder
   - Strict server-side validation: travel end date must be on or after travel start date.
   - Server enforces `Pending` status and generates a cryptographically unique `VP-2026-XXXXXX` reference.

5. **Application Details Page (`/application`)**
   - Protected dashboard querying MongoDB in real-time.
   - Prominently displays **"DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT"**.
   - Displays reference number, applicant profile, travel dates, status badge (`Pending`), and creation timestamp.
   - **Download Demo PDF** button triggering instant on-the-fly PDFKit document generation.
   - **Logout** button clearing the session cookie.
   - **Strict Ownership Isolation:** Users cannot access or download applications belonging to another user.

6. **PDF Generation**
   - Dynamically rendered via PDFKit on the backend (`GET /api/applications/:id/pdf`).
   - Top and bottom red educational warning banners.
   - Clean tabular display of all applicant details, travel parameters, and demonstration conditions.
   - Watermarked with educational notices; zero official government crests or state seals.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (Node v20 recommended)
- **npm** v9+
- **MongoDB** running locally on port `27017`

### 2. Verify MongoDB
Ensure your local MongoDB daemon is running:
```bash
# macOS with Homebrew
brew services start mongodb-community
# Or start directly:
mongod --config /opt/homebrew/etc/mongod.conf
```
Verify MongoDB is responding:
```bash
mongosh --eval "db.adminCommand('ping')"
# Output: { ok: 1 }
```
If the backend reports `ECONNREFUSED 127.0.0.1:27017`, MongoDB is not running or
`MONGODB_URI` points to the wrong host/port. Start MongoDB before the API; the
backend intentionally does not fall back to in-memory or mock data.

### 3. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Or navigate into `server/` and `client/` independently and run `npm install` in each).*

### 4. Configure Environment Variables
Copy `.env.example` to `.env` in the `server` directory:
```bash
cp server/.env.example server/.env
```
Default configuration values:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/visapath_demo
JWT_SECRET=visapath_super_secret_jwt_key_2026_educational_portal
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
For production, set `NODE_ENV=production`, use a reachable `MONGODB_URI`,
configure `FRONTEND_URL` (comma-separated origins are supported), and replace
`JWT_SECRET` with a private random value of at least 32 characters. Production
startup fails when any required value is missing. Set `COOKIE_SECURE=true` when
serving over HTTPS.

### 5. Start the Application

#### Option A: Run servers separately
In Terminal 1 (Backend):
```bash
cd server
npm start
# Server listens on http://localhost:5001
```

In Terminal 2 (Frontend):
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173 (or next open port)
```

#### Option B: Run from the root directory
```bash
# Start backend
npm run dev:server

# Start frontend (in another tab)
npm run dev:client
```

Open your browser at `http://localhost:5173` (or the URL displayed by Vite).

---

## 🔒 Security Architecture

| Security Domain | Implementation Details |
|---|---|
| **Session Authentication** | JWT tokens stored inside HTTP-only, `SameSite=lax` cookies. Browsers cannot read the raw token via JavaScript, mitigating XSS token theft. |
| **Password Storage** | Passwords are automatically hashed via Mongoose pre-save hooks using `bcryptjs` with 12 salt rounds. Passwords are never stored in plaintext and are excluded from query results by default (`select: false`). |
| **Application Reference** | Server-side cryptographic generation (`VP-2026-` + random hex bytes). Client cannot supply or spoof their reference. |
| **Status Enforcement** | Applications strictly default to `Pending`. Client-supplied status fields are discarded by the server. |
| **Ownership Authorization** | Endpoints verifying `:id` compare `application.user` against the authenticated `req.user._id`. Attempts to access another user's record return `403 Forbidden`. |
| **Brute-Force Protection** | Express rate limiter restricts authentication endpoints to 30 requests per 15 minutes. |
| **Database Fail-Safe** | Explicit connection error handling. If MongoDB is offline, the backend returns clear errors rather than silently generating mock data. |
| **Readiness Probe** | `GET /api/health` checks process liveness; `GET /api/ready` returns `503` until MongoDB is connected. |

---

## 📡 API Endpoint Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Creates a user account and sets an HTTP-only authentication cookie.
- **Request Body:**
  ```json
  {
    "displayName": "Elena Rostova",
    "email": "elena.rostova@example.com",
    "password": "Password2026!",
    "confirmPassword": "Password2026!"
  }
  ```
- **Responses:**
  - `201 Created`: Returns user object (excluding password) and sets `visapath_token` cookie.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Email already registered.

#### `POST /api/auth/login`
Authenticates existing credentials and sets an HTTP-only cookie.
- **Request Body:**
  ```json
  {
    "email": "elena.rostova@example.com",
    "password": "Password2026!"
  }
  ```
- **Responses:**
  - `200 OK`: Sets `visapath_token` cookie and returns user profile.
  - `401 Unauthorized`: Invalid credentials.

#### `POST /api/auth/logout`
Clears the authentication cookie.
- **Responses:** `200 OK`.

#### `GET /api/auth/me`
Retrieves the currently authenticated user's profile.
- **Headers:** HTTP-Only cookie `visapath_token` or `Authorization: Bearer <token>`.
- **Responses:**
  - `200 OK`: `{ success: true, user: { id, displayName, email } }`
  - `401 Unauthorized`: Missing or invalid session.

---

### Application Endpoints

#### `POST /api/applications`
Submits a new educational visa application.
- **Access:** Protected (or unauthenticated with embedded `account` credentials).
- **Request Body:**
  ```json
  {
    "displayName": "Elena Rostova",
    "nationality": "New Zealand",
    "dateOfBirth": "1995-07-22",
    "gender": "Male",
    "passportNumber": "FA9028144",
    "visaType": "Visitor",
    "travelStartDate": "2026-11-20",
    "travelEndDate": "2026-12-10",
    "entryType": "Multiple entry",
    "conditions": "Educational demo simulation."
  }
  ```
- **Responses:**
  - `201 Created`: Returns created Application record with `applicationRef` and `status: "Pending"`.
  - `400 Bad Request`: Validation failure (e.g. travel end date before start date).

#### `GET /api/applications/my-application`
Fetches the current user's active application record.
- **Access:** Protected.
- **Responses:** `200 OK`: `{ success: true, application: { ... } }`.

#### `GET /api/applications/:id`
Retrieves an application by MongoDB ID. Enforces ownership authorization.
- **Access:** Protected.
- **Responses:**
  - `200 OK`: Application document.
  - `403 Forbidden`: User does not own the requested application.
  - `404 Not Found`: Record does not exist.

#### `GET /api/applications/:id/pdf`
Generates and downloads a server-side PDF document using PDFKit.
- **Access:** Protected (ownership verified).
- **Responses:**
  - `200 OK`: Binary stream (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="VisaPath_Demo_Application_<ref>.pdf"`).
  - `403 Forbidden`: User does not own this application record.

---

## 🧪 Testing

### 1. Automated Unit & Integration Tests
Run the server test suite:
```bash
npm test
```
**Test Coverage:**
- Registration validation (rejects invalid emails, weak passwords, and mismatched confirmations).
- Bcrypt password hashing verification (asserts hash starts with `$2` and is never exposed in JSON output).
- Duplicate email prevention in MongoDB (asserts code `11000`).
- Application validation and defaults enforcement (`New Zealand`, `Visitor`, `Male`, `Multiple entry`).
- Date range verification (rejects travel end dates preceding start dates).
- Server-controlled reference generation and `Pending` status enforcement.
- Application ownership authorization isolation (asserts User B cannot access User A's application).
- PDFKit stream generation (asserts `%PDF-` signature and valid byte length).

### 2. End-to-End Live Workflow Verification
Execute the automated E2E test against the live backend:
```bash
npm run test:e2e
```
This script exercises all 10 workflow requirements sequentially:
1. Health endpoint ping
2. User registration and cookie issuance
3. Duplicate registration rejection (409)
4. Session verification via `/api/auth/me`
5. Application creation (Step 2)
6. Live application retrieval from MongoDB
7. Cross-user ownership authorization isolation (403 Forbidden on both data and PDF)
8. Authorized PDF generation and binary stream validation
9. Session logout and cookie clearing
10. Relogin and MongoDB persistence verification

---

## 📄 License & Disclaimer

This project is created strictly for **educational and portfolio demonstration purposes**. It is not intended to be used for actual immigration, legal, or governmental processes. All passport samples are entirely fictional.
