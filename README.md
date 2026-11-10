# MFEF Private Wealth Partners
### Enterprise Digital Portal & Lead Concierge CRM

---

## ⚜️ Project Overview

**MFEF Private Wealth Partners** is an enterprise-grade, full-stack MERN platform architected for ultra-high-net-worth individuals (HNWIs), multi-generational family offices, and enterprise founders seeking institutional capital preservation, discretionary wealth management, and cross-border trust governance.

The platform provides a public web portal with an ultra-luxury visual identity (`#080C14` Midnight Obsidian, `#C5A880` Champagne Gold, `#F8FAFC` Alabaster) integrated with a **Direct Advisor Concierge** engine and an **Executive Lead & Inquiry Pipeline Specialist CRM**.

---

## 🛠️ Technology Architecture

* **Frontend**:
  * **React 18** Single Page Application built with **Vite** and **TypeScript**
  * **Tailwind CSS** with custom luxury design tokens and Google Fonts (`Cinzel`, `Plus Jakarta Sans`)
  * **React Router v6** for public navigation and protected partner routes
  * **Lucide React** luxury iconography
  * **React Hook Form** + **Zod** for schema validation
  * **Axios** with global interceptors and `withCredentials: true`
* **Backend**:
  * **Node.js** & **Express.js** with full **TypeScript** type safety
  * **MongoDB** with **Mongoose ORM** schemas, indexes, and aggregation pipelines
  * **Authentication**: Signed JSON Web Tokens (JWT) stored in secure `HttpOnly`, `SameSite: Strict` cookies
  * **Security**: `helmet`, `cors`, `express-rate-limit`, `bcryptjs` (salt rounds = 12)
  * **CSV Streaming**: Real-time generation of encrypted lead datasets
* **Database**:
  * Local or cloud **MongoDB** database (`mfef_private_wealth`) with pre-configured seed scripts and audit logging

---

## 🌟 Core Features & Modules

### 1. Public-Facing Portal
* **Landing Page (`/`)**: High-impact luxury hero, live institutional metric ticker (\$3.8B+ AUM, 99.4% retention), core advisory mandates, 4-stage fiduciary protocol, interactive wealth modeler, verified credentials, and concierge triggers.
* **About the Firm (`/about`)**: Fiduciary oath, conflict-free fee-only structure, managing partner profiles, and segregated Tier-1 custody architecture.
* **Advisory Practices (`/services` & `/services/:slug`)**: Dynamic practice catalog with category filtering, deliverables breakdown, and minimum threshold indicators.
* **Client Credentials (`/credentials`)**: Anonymized case histories illustrating dynastic succession, post-liquidity mandates, and corporate balance sheet syndications.
* **Interactive Wealth Modeler**: Real-time simulation of compounding, inflation shielding, and structuring advantages across generational horizons.
* **Institutional FAQ (`/faq`)**: Searchable knowledge base with instant keyword filtering.
* **Legal & Regulatory Compliance (`/legal`)**: Full SEC/FCA fiduciary disclosures, Swiss banking secrecy, GDPR/CCPA privacy standards.

### 2. Direct Advisor Concierge Engine
* **Bespoke Consultation Booking**: Captures meeting coordinates, portfolio tier (\$1M-\$5M, \$5M-\$20M, \$20M+), preferred mode (In-person, secure video, confidential phone), generating a tamper-resistant tracking code (`MFEF-2026-XXXX`).
* **Priority Advisor Callback Modal**: Accessible across all pages; dispatches urgent telephone callback requests with preferred time windows.
* **Consultation Status Tracker**: Allows clients to look up real-time progress using their reference code.
* **VIP WhatsApp Direct**: Instant encrypted routing to the managing partner communications desk.

### 3. Executive Lead & Inquiry Specialist CRM (`/admin/dashboard`)
* **Live KPI Overview**: Real-time metrics for total leads, active consultations, pending callbacks, in-review mandates, converted clients, and conversion ratios.
* **Interactive Pipeline Table**: Search by client name, email, phone, reference code; filter by status (`NEW`, `CONTACTED`, `IN_REVIEW`, `CONVERTED`, `ARCHIVED`) and type (`CONSULTATION`, `CALLBACK`, `GENERAL`).
* **Lead Management Drawer**: Full client profile, contact coordinates, meeting preferences, status updater, and confidential internal partner note thread.
* **One-Click CSV Export**: Streams filtered lead datasets for offline partner executive meetings.

---

## 🔑 Demo Access Credentials

To test the **Executive Partner CRM**, visit `/admin/login` or click **"Partner Portal"** in the top navigation bar:

* **Administrator Email**: `admin@mfefwealth.com`
* **Secure Password**: `MFEF_Wealth_2026!`
* *(A convenient **"Auto-Fill"** button is provided on the login page for instant demo access).*

---

## 🚀 Quickstart & Development Guide

### Prerequisites
* **Node.js** v18+ (tested on Node v24.14.0)
* **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or via MongoDB Atlas URI)

### 1. Install Dependencies
From the repository root:
```bash
npm install
```

### 2. Seed the Database
Populates initial wealth services, firm settings, managing partner accounts, and realistic CRM leads:
```bash
npm run seed
```

### 3. Start Development Servers
Runs both the Express API backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 4. Execute Automated Test Suite
Runs all 17 integration, security, validation, and CRM pipeline tests:
```bash
npm run test
```

### 5. Compile Production Builds
Builds both backend TypeScript and frontend Vite assets into production-optimized bundles:
```bash
npm run build
```

---

## 🔒 Security Best Practices Implemented
* Zero plain-text credentials or API secrets exposed on the client.
* `HttpOnly` and `SameSite: Strict` flags on authentication cookies.
* `express-rate-limit` prevents brute-force login attempts and spam inquiries.
* Centralized error handler masks stack traces in production.
* Inputs sanitized and validated using strict **Zod** runtime schemas.
