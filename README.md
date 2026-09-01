# ✨ LinkMakeup — Personal Digital Identity & Smart Link Hub

<p align="center">
  <strong>The all-in-one digital identity, link aggregation, and NFC-ready smart business card platform.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
</p>

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Capabilities & Features](#-key-capabilities--features)
3. [System Architecture & Multi-Tenancy](#-system-architecture--multi-tenancy)
4. [Authentication & Security Flow](#-authentication--security-flow)
5. [Technology Stack](#-technology-stack)
6. [Database Schema & Entity Models](#-database-schema--entity-models)
7. [API Reference](#-api-reference)
8. [Edge Layer & Cloudflare Worker](#-edge-layer--cloudflare-worker)
9. [Digital Wallet & NFC Integration](#-digital-wallet--nfc-integration)
10. [Realtime Analytics Engine](#-realtime-analytics-engine)
11. [Environment Variables & Configuration](#-environment-variables--configuration)
12. [Local Setup & Development Guide](#-local-setup--development-guide)
13. [Production Deployment Guide](#-production-deployment-guide)

---

## 🌟 Project Overview

**LinkMakeup** is a personal digital identity platform that empowers creators, professionals, and brands to consolidate their online footprint into a public profile, accessible via personal subdomains (e.g., `https://username.linkmakeup.com`).

Beyond traditional "link-in-bio" tools, LinkMakeup provides:
- **Instant Identity Generation**: Dynamic themes, custom avatars, status badges, and interactive live previews.
- **Multi-Tenant Subdomain Routing**: Seamless wildcard edge routing powered by Cloudflare Workers.
- **Rich Social Previews (Open Graph)**: Server-side meta tag generation for crawlers (WhatsApp, Twitter/X, LinkedIn, Facebook).
- **Physical & Digital Convergence**: Apple Wallet (`.pkpass`), Google Wallet passes, dynamic QR code generation, and NFC Smart Business Card ordering.
- **First-Party Realtime Analytics**: Privacy-conscious event capture (page views, link clicks, devices, referrers) with dashboard visualizations.
- **Enterprise-Grade Admin Backoffice**: User management, account suspension/activation, audit trails, and administrative internal notes.

---

## 🚀 Key Capabilities & Features

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           LINKMAKEUP ECOSYSTEM                            │
├──────────────────────┬──────────────────────┬─────────────────────────────┤
│   Creator Studio     │   Public Profile     │   Growth & Hardware         │
├──────────────────────┼──────────────────────┼─────────────────────────────┤
│ • Interactive Canvas │ • Subdomain Routing  │ • Apple / Google Wallet     │
│ • Theme Customizer   │ • Dynamic OG Meta    │ • Dynamic QR Code Studio    │
│ • Link Ordering/CRUD │ • Fast Edge Caching  │ • NFC Smart Card Store      │
│ • Status Pills/Role  │ • Responsive Layout  │ • First-Party Analytics     │
│ • Image Crop/Avatar  │ • Suspended Handling │ • Admin Audit & Governance  │
└──────────────────────┴──────────────────────┴─────────────────────────────┘
```

### 1. 🎨 Profile Customizer & Live Studio
- **Dynamic Themes**: Curated theme presets (*Minimal Mono, Clean Slate, Midnight Glass, Sunset Glow, Emerald Luxury, Neo-Brutalism*) and granular custom color palettes.
- **Avatar System**: Upload, real-time crop (`react-image-crop`), shape configuration (*circle, squircle, square*), and sizing presets.
- **Interactive Live Preview**: Split-screen editor featuring real-time mobile iframe/mockup updates.

### 2. 🔗 Intelligent Link Hub
- **Rich Link Attributes**: Title, custom subtitle, target URL, and activation toggle.
- **Smart Icon Engine**: Over 50+ built-in social/platform icons with automated fallback to remote high-resolution favicon resolution via Google Favicon & FaviconKit.
- **Drag & Drop / Ordered Sorting**: Sequence prioritization persisted via database position indexes.

### 3. 🌐 Edge Subdomain Routing (`username.linkmakeup.com`)
- Wildcard DNS mapped via Cloudflare Workers.
- Transparent host forwarding to Vercel SPA with custom `X-Forwarded-Host` headers.
- Social crawler detection that serves tailored Open Graph HTML tags for rich previews across messaging and social platforms.

### 4. 📇 Physical & Mobile Wallet Integration
- **Apple Wallet**: PassKit generation producing valid signed `.pkpass` bundles.
- **Google Wallet**: JWT-based pass objects using Google Service Account authentication.
- **Smart Card Store**: E-Commerce checkout flow for ordering physical NFC smart business cards.

### 5. 📊 Realtime Analytics Engine
- First-party tracking for page impressions and outbound link clicks.
- Captures referrer, device category (Mobile/Desktop/Tablet), OS/platform, and UTM campaign parameters.
- Built-in analytics dashboard with time-series charts, CTR percentages, and CSV export.

---

## 🏛 System Architecture & Multi-Tenancy

LinkMakeup utilizes an edge-first, decoupled architecture:

```mermaid
flowchart TD
    subgraph Client ["Client Devices & Social Bots"]
        UserBrowser["User Browser (Web / Mobile)"]
        SocialCrawler["Social Crawler (WhatsApp / Twitter / LinkedIn)"]
        NfcTap["NFC Card / QR Scan"]
    end

    subgraph Edge ["Edge Layer (Cloudflare)"]
        CFWorker["Cloudflare Worker (*.linkmakeup.com)"]
        CFDNS["Cloudflare DNS & SSL"]
    end

    subgraph Frontend ["Frontend (Vercel)"]
        SPA["React 19 SPA (Vite + Tailwind v4)"]
        Router["React Router v7 Subdomain Resolver"]
    end

    subgraph Backend ["Backend (Render / Railway)"]
        ExpressApp["Express.js REST API (/api/v1)"]
        AuthModule["Auth & Session Controller"]
        ProfileModule["Profile & Link Service"]
        WalletModule["Apple & Google Wallet Generator"]
        AnalyticsModule["Event Ingestion & Aggregator"]
        AdminModule["Audit Logs & User Moderation"]
    end

    subgraph Data ["Data & Third-Party Services"]
        NeonDB[("PostgreSQL (Neon Serverless)")]
        GoogleOAuth["Google OAuth 2.0"]
        ResendMail["Resend / Nodemailer (OTP Service)"]
        GoogleWalletAPI["Google Wallet REST API"]
    end

    UserBrowser -->|DNS Request| CFDNS
    NfcTap -->|NFC / QR Redirect| CFDNS
    SocialCrawler -->|GET Request| CFDNS
    CFDNS --> CFWorker

    CFWorker -->|Social Bot Detected| ExpressApp
    CFWorker -->|Standard User (Rewrite Host)| SPA
    SPA -->|API Requests with Credentials| ExpressApp

    ExpressApp -->|Drizzle ORM| NeonDB
    ExpressApp -->|Verify Token| GoogleOAuth
    ExpressApp -->|Dispatch OTP| ResendMail
    ExpressApp -->|Sign JWT Pass| GoogleWalletAPI
```

---

## 🔐 Authentication & Security Flow

LinkMakeup supports a dual-authentication strategy: **Email OTP Verification** and **Google OAuth 2.0**.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Web as LinkMakeup Web
    participant API as Express API
    participant Mail as Email Service (Resend)
    participant OAuth as Google Identity
    participant DB as PostgreSQL (Neon)

    alt Email & Password Flow
        User->>Web: Submit Email & Password
        Web->>API: POST /api/v1/auth/signup
        API->>DB: Check uniqueness & hash password (bcrypt)
        API->>Mail: Send 6-digit OTP code (expires in 10 min)
        API-->>Web: 201 Created (Pending Verification)
        User->>Web: Enter 6-digit OTP Code
        Web->>API: POST /api/v1/auth/verify-email
        API->>DB: Validate OTP & mark email_verified = true
        API-->>Web: Set HTTP-Only Cookie (session_token)
    else Google OAuth 2.0 Flow
        User->>Web: Click "Continue with Google"
        Web->>API: GET /api/v1/auth/google
        API-->>Web: Return Google Consent Screen URL
        User->>OAuth: Authorize LinkMakeup Application
        OAuth->>API: Callback with Auth Code (/api/v1/auth/google/callback)
        API->>OAuth: Exchange code for ID & Access Tokens
        API->>DB: Find or create User & auto-verify email
        API-->>Web: Set HTTP-Only Cookie & Redirect to Dashboard
    end
```

### Security Highlights:
- **HTTP-Only Cookies**: Session tokens are isolated from JavaScript execution to prevent XSS session hijacking.
- **Cross-Subdomain Session Sharing**: Cookies configured with `domain: .linkmakeup.com` enable seamless authentication across `linkmakeup.com`, `app.linkmakeup.com`, and `admin.linkmakeup.com`.
- **Role-Based Access Control (RBAC)**: Admin endpoints are guarded by `admin.middleware.js`, verifying admin email allowlists (`ADMIN_EMAILS`) and cryptographically safe API keys (`ADMIN_API_KEY`).
- **Account Suspension Guard**: Suspended profiles/users are blocked by `suspended.middleware.js` from modifying data or serving active public profile views.
- **Audit Trail**: Every administrative action (suspending users, modifying themes, writing internal notes) is logged to `admin_audit_logs`.

---

## 💻 Technology Stack

### Frontend Application
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | UI Component Framework |
| **Vite** | `^8.2.0` | Ultra-fast build tool and dev server |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling with modern CSS engine |
| **React Router** | `^7.18.2` | Client-side routing and subdomain extraction |
| **Motion** | `^13.1.0` | Smooth physics-based UI animations |
| **GSAP & Lenis** | `^3.15` / `^1.3` | Fluid momentum scrolling & advanced timeline animations |
| **OGL** | `^1.0.11` | Minimal WebGL library for interactive visual backgrounds |
| **html-to-image** | `^1.11.13` | Client-side canvas snapshot generation for sharing cards |
| **qrcode.react** | `^4.2.0` | SVG/Canvas high-density QR code renderer |
| **react-image-crop** | `^11.1.2` | Interactive cropping for user avatars |

### Backend API
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` | JavaScript Runtime Environment (ES Modules) |
| **Express.js** | `^4.21.2` | RESTful API server |
| **PostgreSQL** | `15+` | Relational database engine (Neon Serverless) |
| **Drizzle ORM** | `^0.45.2` | Type-safe SQL schema & query builder |
| **Drizzle Kit** | `^0.31.10` | Database schema migrations & synchronization |
| **Zod** | `^3.24.2` | Runtime schema validation for request payloads |
| **bcryptjs** | `^3.0.3` | Password hashing with adaptive work factor |
| **Google Auth Library** | `^11.0.2` | Official Google OAuth 2.0 & Service Account client |
| **Archiver** | `^8.0.0` | Zip stream generator for Apple Wallet `.pkpass` bundles |
| **Resend & Nodemailer** | `^6.20` / `^9.0` | Transactional email delivery for verification OTPs |
| **Helmet & CORS** | `^8.0` / `^2.8` | HTTP security headers and cross-origin controls |

### Infrastructure & Edge
| Service | Role |
| :--- | :--- |
| **Cloudflare Workers** | Edge routing proxy, Subdomain parser, Social Bot OG interceptor |
| **Cloudflare DNS** | SSL termination, Wildcard `*.linkmakeup.com` routing |
| **Vercel** | Global CDN hosting for React Single Page Application |
| **Neon** | Serverless branching PostgreSQL with zero connection overhead |

---

## 🗄 Database Schema & Entity Models

The schema is defined in [backend/src/models/schema.js](file:///Users/zoubaa/dev/linkmakeup/backend/src/models/schema.js) using Drizzle ORM:

```
┌─────────────────────────┐         ┌─────────────────────────┐
│         users           │ 1     1 │        profiles         │
├─────────────────────────┼─────────┼─────────────────────────┤
│ id (UUID, PK)           ├─────────┤ id (UUID, PK)           │
│ email (VARCHAR, Unique) │         │ user_id (UUID, FK)      │
│ google_id (VARCHAR)     │         │ username (VARCHAR, Unq) │
│ password_hash (TEXT)    │         │ display_name (VARCHAR)  │
│ email_verified (BOOL)   │         │ role (VARCHAR)          │
│ verification_code (STR) │         │ bio (TEXT)              │
│ created_at / updated_at │         │ avatar_url (TEXT)       │
└────────────┬────────────┘         │ avatar_shape / size     │
             │                      │ status_badge (VARCHAR)  │
             │ 1                    │ is_suspended (BOOLEAN)  │
             │                      │ theme_config (JSONB)    │
             │                      └────────────┬────────────┘
             │                                   │ 1
             │ n                                 │
┌────────────┴────────────┐                      │ n
│         links           │         ┌────────────┴────────────┐
├─────────────────────────┤         │    analytics_events     │
│ id (UUID, PK)           │         ├─────────────────────────┤
│ user_id (UUID, FK)      │         │ id (UUID, PK)           │
│ title (VARCHAR)         │         │ profile_id (UUID, FK)   │
│ subtitle (VARCHAR)      │         │ link_id (UUID, FK, Opt) │
│ url (TEXT)              │         │ event_type (view|click) │
│ icon (VARCHAR)          │         │ referrer (VARCHAR)      │
│ position (INTEGER)      │         │ device_type (VARCHAR)   │
│ is_active (BOOLEAN)     │         │ platform (VARCHAR)      │
└─────────────────────────┘         │ source / user_agent     │
                                    │ created_at (TIMESTAMP)  │
                                    └─────────────────────────┘

┌─────────────────────────┐         ┌─────────────────────────┐
│    admin_audit_logs     │         │         orders          │
├─────────────────────────┤         ├─────────────────────────┤
│ id (UUID, PK)           │         │ id (UUID, PK)           │
│ actor_email (VARCHAR)   │         │ full_name (VARCHAR)     │
│ actor_type (VARCHAR)    │         │ phone (VARCHAR)         │
│ action (VARCHAR)        │         │ city (VARCHAR)          │
│ target_type / target_id │         │ address (TEXT)          │
│ metadata (JSONB)        │         │ status (pending|shipped)│
│ created_at (TIMESTAMP)  │         │ created_at / updated_at │
└─────────────────────────┘         └─────────────────────────┘
```

---

## 📡 API Reference

All backend API routes are prefixed under `/api/v1`.

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register with Email & Password (triggers OTP email) | Public |
| `POST` | `/auth/verify-email` | Verify 6-digit OTP code and establish session | Public |
| `POST` | `/auth/resend-verification` | Request a fresh 6-digit OTP code | Public |
| `POST` | `/auth/login` | Login with email and password | Public |
| `GET` | `/auth/google` | Retrieve Google OAuth 2.0 authorization URL | Public |
| `GET` | `/auth/google/callback` | OAuth callback endpoint (sets session cookie) | Public |
| `GET` | `/auth/me` | Fetch authenticated identity & connected profile | `requireAuth` |
| `POST` | `/auth/logout` | Invalidate and clear session cookie | `requireAuth` |

### 2. Profiles (`/api/v1/profiles`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/profiles/check-username` | Check username availability in real-time | Public |
| `GET` | `/profiles/by-username/:username` | Retrieve public profile by username | Public |
| `GET` | `/profiles/check-og` | Dynamic OpenGraph HTML response for crawlers | Public |
| `GET` | `/profiles/me` | Get owner profile details & status | `requireAuth` |
| `POST` | `/profiles/onboard` | Complete onboarding & claim initial username | `requireAuth` |
| `PUT` | `/profiles/me` | Update display name, bio, role, status badge | `requireAuth` |
| `PUT` | `/profiles/theme` | Update theme presets & custom JSON palette | `requireAuth` |

### 3. Links (`/api/v1/links`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/links/public/:username` | Fetch public active links for a profile | Public |
| `GET` | `/links` | Fetch all user links (including inactive) | `requireAuth` |
| `POST` | `/links` | Create a new link | `requireAuth` |
| `PUT` | `/links/:id` | Update link title, subtitle, URL, icon, active | `requireAuth` |
| `PUT` | `/links/reorder` | Batch reorder link positions | `requireAuth` |
| `DELETE` | `/links/:id` | Delete a specific link | `requireAuth` |

### 4. Realtime Analytics (`/api/v1/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/analytics/event` | Track page view or link click event | Public |
| `GET` | `/analytics/summary` | Query views, clicks, CTR, timeline, referrers | `requireAuth` |
| `GET` | `/analytics/export` | Download complete analytics data as CSV | `requireAuth` |

### 5. Smart Wallets & NFC Orders (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallet/apple/:username` | Download Apple Wallet `.pkpass` bundle | Public |
| `GET` | `/wallet/google/:username` | Generate Google Wallet "Save to Phone" link | Public |
| `POST` | `/orders` | Submit order for custom NFC Smart Card | Public |
| `GET` | `/orders/my-orders` | Fetch orders placed by user | `requireAuth` |

### 6. Admin Backoffice (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Platform-wide KPIs & growth metrics | `requireAdmin` |
| `GET` | `/admin/users` | Paginated user directory with search/filters | `requireAdmin` |
| `PUT` | `/admin/users/:id/suspend` | Suspend or reactivate a user account | `requireAdmin` |
| `GET` | `/admin/audit-logs` | Query chronological admin action logs | `requireAdmin` |
| `POST` | `/admin/notes` | Create internal administrative note | `requireAdmin` |
| `GET` | `/admin/orders` | Manage NFC card orders & delivery status | `requireAdmin` |

---

## ⚡ Edge Layer & Cloudflare Worker

The Cloudflare Worker in [`cloudflare-worker/src/index.js`](file:///Users/zoubaa/dev/linkmakeup/cloudflare-worker/src/index.js) orchestrates two critical tasks:

1. **Crawler Interception & Rich OG Previews**:
   When a social crawler (WhatsApp, Facebook, Twitterbot, LinkedIn, Telegram, Discord) requests `https://username.linkmakeup.com`, the worker intercepts the request and queries `/api/v1/profiles/check-og?u=username`. The backend delivers dynamic `<meta property="og:title">`, `<meta property="og:description">`, and `<meta property="og:image">` tags.
2. **Subdomain Rewriting**:
   For regular human visitors, the Worker transparently sets `X-Forwarded-Host: username.linkmakeup.com` and proxies the request to the main Vercel frontend deployment.

---

## 🛠 Environment Variables & Configuration

### Backend Configuration (`backend/.env`)

```ini
# Server Environment
PORT=5000
NODE_ENV=development

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pool.neon.tech/linkmakeup?sslmode=require"

# Client & Server Origins
CLIENT_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"
COOKIE_DOMAIN="localhost" # In production: .linkmakeup.com
SESSION_SECRET="your_strong_random_session_secret_key"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Delivery (Resend or SMTP)
RESEND_API_KEY="re_123456789"
EMAIL_FROM="LinkMakeup <noreply@linkmakeup.com>"
# Optional SMTP Fallback:
# SMTP_HOST="smtp.mailgun.org"
# SMTP_PORT=587
# SMTP_USER="postmaster@linkmakeup.com"
# SMTP_PASS="password"

# Administration & Security
ADMIN_EMAILS="admin@linkmakeup.com,lead@linkmakeup.com"
ADMIN_API_KEY="your-super-secret-admin-key"

# Google Wallet (Optional)
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL="wallet-sa@linkmakeup.iam.gserviceaccount.com"
GOOGLE_WALLET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_WALLET_ISSUER_ID="3388000000022334455"
```

### Frontend Configuration (`frontend/.env`)

```ini
VITE_API_URL="http://localhost:5000/api/v1"
VITE_ROOT_DOMAIN="localhost:5173" # In production: linkmakeup.com
```

### Cloudflare Worker Configuration (`cloudflare-worker/wrangler.toml`)

```toml
name = "linkmakeup-edge-router"
main = "src/index.js"
compatibility_date = "2024-03-01"

[vars]
ROOT_DOMAIN = "linkmakeup.com"
API_ORIGIN = "https://api.linkmakeup.com"
```

---

## 💻 Local Setup & Development Guide

### Prerequisites
- **Node.js**: v20.x or later
- **npm** or **pnpm**
- **PostgreSQL Database**: Free tier available on [Neon.tech](https://neon.tech)

### 1. Clone the Repository
```bash
git clone https://github.com/zoubaax/linkmakeup.git
cd linkmakeup
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env # Or create .env with variables above

# Push database schema to PostgreSQL
npm run db:push

# Start backend development server (Port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Production Deployment Guide

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION TOPOLOGY                       │
├──────────────────────┬───────────────────────────────────────┤
│ Domain & DNS         │ Cloudflare (Wildcard *.linkmakeup.com)│
│ Edge Worker          │ Cloudflare Worker (Edge Routing & OG) │
│ Frontend SPA         │ Vercel                                │
│ Backend REST API     │ Render / Railway                      │
│ Database             │ Neon Serverless PostgreSQL            │
└──────────────────────┴───────────────────────────────────────┘
```

1. **Cloudflare DNS Setup**:
   - Create an `A` or `CNAME` record for `@` and `www` pointing to Vercel (`cname.vercel-dns.com`).
   - Create a wildcard `CNAME` record `*` pointing to Vercel.
   - Set up `api.linkmakeup.com` pointing to your Render/Railway backend service.
2. **Cloudflare Worker Deploy**:
   ```bash
   cd cloudflare-worker
   npx wrangler deploy
   ```
   - Bind the worker route to `*.linkmakeup.com/*` in the Cloudflare Dashboard.
3. **Database Migration**:
   ```bash
   cd backend
   npm run db:push
   ```

---

## 📄 License

This project is proprietary software developed for the LinkMakeup ecosystem. All rights reserved.
