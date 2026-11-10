# Architecture & System Design Overview
## Project: MFEF Private Wealth Partners Portal & CRM

### 1. Monorepo Organization
The codebase is structured as a decoupled monorepo managed via npm workspaces:
* `frontend/`: Single Page Application (SPA) powered by React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, and React Router v6.
* `backend/`: RESTful API service built on Node.js, Express.js, TypeScript, Mongoose ORM, and MongoDB.
* `docs/`: System blueprints, API specifications, and database documentation.

### 2. Security Boundaries & Authentication Flow
1. **Public Lead Capture**:
   * Rate-limited via `express-rate-limit` (20 submissions / 15 minutes per IP).
   * Strict validation and sanitization using Zod schemas (`consultationSchema`, `callbackSchema`, `generalContactSchema`).
   * Generates tamper-resistant, high-trust reference codes (`MFEF-2026-XXXX`, `CALL-2026-XXXX`).
2. **Administrative Access**:
   * Password hashing via `bcryptjs` with salt rounds = 12.
   * Authentication tokens issued as signed JSON Web Tokens (JWT).
   * Persisted in `HttpOnly`, `SameSite: Strict`, and `Secure` (in production) cookies to eliminate XSS token theft.
   * Role-Based Access Control (`SUPER_ADMIN`, `MANAGING_PARTNER`, `SENIOR_ADVISOR`) enforced via `restrictTo` middleware.
3. **Data Protection**:
   * Helmet security headers applied across all responses.
   * CORS locked to configured client origin (`CLIENT_URL`) with credential handling.

### 3. Fiduciary Lead & Consultation Workflow
```
[Client submits booking/callback]
               │
               ▼
   [Zod Schema Validation]
               │
               ▼
   [Auto-generate Unique Reference Code]
               │
               ▼
   [Persist to MongoDB 'inquiries' collection]
               │
               ▼
   [Client receives reference code + toast confirmation]
               │
               ▼
   [Admin CRM Pipeline Notification]
               │
               ▼
   [Advisor reviews balance sheet tier & assigns Partner]
               │
               ▼
   [Advisor updates Status & appends Internal Audit Notes]
```
