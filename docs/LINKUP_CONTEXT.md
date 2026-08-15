# LinkMakeup — Project Context

## 1. Overview

LinkMakeup is a platform for creating a personal public page where users can collect and share their important links in one place.

The long-term vision is to evolve LinkMakeup from a simple link aggregation tool into a personal digital identity platform that can eventually support:

- Links
- Social profiles
- Projects
- Portfolio
- Experience
- Skills
- Certificates
- CV
- Analytics
- Custom themes
- Custom domains
- Premium features

The project will be developed progressively, starting with a very small and focused MVP.

---

## 2. Product Vision

A user should be able to:

1. Sign in with Google.
2. Create their LinkMakeup profile.
3. Choose a unique username.
4. Get a public URL such as:

   `https://username.linkmakeup.com`

5. Add, edit, delete, reorder, and enable/disable links.
6. Share their LinkMakeup page with others.

Example:

```text
Google Login
     ↓
Create LinkMakeup account
     ↓
Choose username
     ↓
mohammed
     ↓
mohammed.linkmakeup.com
     ↓
Add links
     ↓
Publish profile
```

---

## 3. MVP Scope

The MVP must remain intentionally simple.

### Included

- Google Authentication
- User account creation
- User profile
- Unique username
- Public profile
- Subdomain-based profile foundation
- Link creation
- Link editing
- Link deletion
- Link ordering
- Enable/disable links
- Basic profile customization
- Public link page

### Not included in MVP

- Advanced analytics
- Portfolio builder
- Projects
- Experience
- Skills
- Certificates
- Custom domains
- Payments
- Subscription plans
- Advanced themes
- AI features
- Advanced admin panel

These features belong to future phases.

---

## 4. Technology Stack

### Frontend

- React
- JavaScript or TypeScript
- React Router
- CSS / Tailwind CSS if needed

Hosted on:

- Vercel

### Backend

- Node.js
- Express.js
- REST API

Hosted on:

- Render or Railway

The backend is responsible for:

- Authentication handling
- User management
- Profile management
- Link management
- Authorization
- Database access

### Database

- PostgreSQL
- Neon

The application should use PostgreSQL as the main source of persistent data.

### Authentication

Google OAuth will be used for authentication.

The application should not implement Google authentication from scratch.

Authentication flow:

```text
User
  ↓
LinkUp
  ↓
Continue with Google
  ↓
Google OAuth
  ↓
Google authorization
  ↓
LinkUp callback
  ↓
Find or create user
  ↓
Authenticated session
```

---

## 5. Domain & Hosting

Main domain:

```text
linkmakeup.com
```

Cloudflare will manage:

- Domain
- DNS
- SSL
- DNS records
- Wildcard subdomain configuration

Expected domains:

```text
linkmakeup.com
app.linkmakeup.com
api.linkmakeup.com
*.linkmakeup.com
```

Example public profile:

```text
mohammed.linkmakeup.com
```

The wildcard subdomain is an important part of the LinkMakeup architecture because every username can become a public profile.

---

## 6. High-Level Architecture

```text
                        Internet
                           │
                           ▼
                     ┌───────────┐
                     │ Cloudflare│
                     │ DNS + SSL │
                     └─────┬─────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       linkmakeup.com api.linkmakeup.com *.linkmakeup.com
              │            │            │
              ▼            ▼            ▼
           Vercel       Express       Vercel
                          │
                          ▼
                    PostgreSQL
                       Neon
                          │
                          ▼
                    Google OAuth
```

---

## 7. Core Data Model

Initial entities:

```text
User
Profile
Link
```

### User

Responsible for authentication and account ownership.

Possible fields:

```text
id
google_id
email
name
avatar_url
created_at
updated_at
```

### Profile

Responsible for public identity.

Possible fields:

```text
id
user_id
username
display_name
bio
avatar_url
created_at
updated_at
```

The username must be unique.

### Link

Responsible for links displayed on the user's public page.

Possible fields:

```text
id
user_id
title
url
icon
position
is_active
created_at
updated_at
```

---

## 8. Multi-Tenancy Concept

LinkUp is designed as a multi-user platform.

Every user owns their own profile and links.

Example:

```text
mohammed.linkmakeup.com
       │
       ▼
Mohammed's Profile
       │
       ├── GitHub
       ├── LinkedIn
       └── Portfolio
```

Another user:

```text
ayoub.linkmakeup.com
       │
       ▼
Ayoub's Profile
       │
       ├── GitHub
       ├── Instagram
       └── Website
```

The application identifies the requested username from the hostname and retrieves the corresponding profile.

---

## 9. Security Principles

The backend must never trust user-provided ownership information.

For protected operations:

```text
Authenticated User
       ↓
Backend identifies user
       ↓
Backend checks resource ownership
       ↓
Operation allowed
```

Users must only be able to modify their own:

- Profile
- Links

Google authentication credentials and secrets must never be exposed to the frontend.

Environment variables must be used for:

```text
DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SESSION_SECRET
```

---

## 10. Development Philosophy

The project should follow a progressive architecture.

Do not over-engineer the MVP.

Start with:

```text
Authentication
      +
Profile
      +
Link Management
      +
Public Profile
```

Then evolve toward:

```text
Analytics
      ↓
Portfolio
      ↓
Customization
      ↓
Custom Domains
      ↓
SaaS / Monetization
```

