# LinkUp — MVP Development Plan

## MVP Goal

Build the first usable version of LinkUp.

A user must be able to:

```text
Login with Google
      ↓
Create/complete profile
      ↓
Choose unique username
      ↓
Manage links
      ↓
Publish profile
      ↓
Share username.linkup.ma
```

---

# Phase 0 — Project Foundation

## Goal

Prepare the project structure and development environment.

### Tasks

- [ ] Create React frontend
- [ ] Create Express backend
- [ ] Configure PostgreSQL
- [ ] Create Neon PostgreSQL database
- [ ] Configure environment variables
- [ ] Configure Git workflow
- [ ] Configure basic API structure
- [ ] Configure CORS
- [ ] Create development README

### Expected structure

```text
linkup/
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── config/
│   └── ...
│
├── README.md
└── ...
```

---

# Phase 1 — Google Authentication

## Goal

Allow users to authenticate using Google.

### User Flow

```text
                    LinkUp
                      │
                      ▼
              Continue with Google
                      │
                      ▼
                 Google OAuth
                      │
                      ▼
                User approves
                      │
                      ▼
              OAuth callback
                      │
                      ▼
             Find existing user
                  /       \
                Yes        No
                │           │
                ▼           ▼
              Login      Create user
                │           │
                └─────┬─────┘
                      ▼
               Authenticated
                      │
                      ▼
                  Dashboard
```

### Tasks

- [ ] Create Google OAuth application
- [ ] Configure Google OAuth credentials
- [ ] Implement Google login
- [ ] Implement OAuth callback
- [ ] Find existing user by Google ID/email
- [ ] Create user if account does not exist
- [ ] Create authenticated session
- [ ] Implement logout
- [ ] Protect authenticated API routes
- [ ] Add frontend authentication state
- [ ] Add login page
- [ ] Add logout action

### Security

- [ ] Keep Google Client Secret on backend
- [ ] Never expose secrets in React
- [ ] Use secure HTTP-only cookies for authentication/session where applicable
- [ ] Configure production callback URLs
- [ ] Configure CORS correctly

---

# Phase 2 — User Profile

## Goal

After Google login, users must create their public LinkUp identity.

### User Flow

```text
Google Login
     ↓
New User?
     │
    Yes
     ↓
Choose Username
     ↓
Check Availability
     ↓
Create Profile
     ↓
Dashboard
```

### Tasks

- [ ] Create Profile database model
- [ ] Connect Profile to User
- [ ] Create profile API
- [ ] Update profile API
- [ ] Get current user's profile
- [ ] Implement username availability check
- [ ] Enforce unique usernames
- [ ] Add display name
- [ ] Add bio
- [ ] Add avatar
- [ ] Create profile settings page

### Username Rules

Username should:

- [ ] Be unique
- [ ] Have a defined minimum length
- [ ] Have a defined maximum length
- [ ] Allow only safe characters
- [ ] Be case-insensitive
- [ ] Reserve system usernames

Reserved examples:

```text
admin
api
app
auth
dashboard
login
register
settings
support
www
```

---

# Phase 3 — Link Management

## Goal

Allow users to manage the links displayed on their public profile.

---

## Create Link

User enters:

```text
Title:
[ GitHub ]

URL:
[ https://github.com/... ]

[ Add Link ]
```

### Tasks

- [ ] Create Link model
- [ ] Create link API
- [ ] Validate URL
- [ ] Associate link with authenticated user
- [ ] Add link from dashboard
- [ ] Display newly created link

---

# Edit Link

### Tasks

- [ ] Edit link title
- [ ] Edit link URL
- [ ] Edit link icon
- [ ] Save changes
- [ ] Validate updated URL

---

# Delete Link

### Tasks

- [ ] Delete link
- [ ] Add confirmation before deletion
- [ ] Update UI immediately after deletion

---

# Enable / Disable Link

Users should be able to hide a link without deleting it.

Example:

```text
GitHub       [ ON  ]
LinkedIn     [ ON  ]
Portfolio    [ OFF ]
```

### Tasks

- [ ] Add `is_active`
- [ ] Toggle link status
- [ ] Only display active links publicly

---

# Link Ordering

Users should control the order of their links.

Example:

```text
1. GitHub
2. LinkedIn
3. Portfolio
4. Instagram
```

### Tasks

- [ ] Add `position`
- [ ] Implement drag & drop or move up/down
- [ ] Save order
- [ ] Return links sorted by position

---

# Phase 4 — Public Profile

## Goal

Create the public-facing LinkUp page.

Example:

```text
https://mohammed.linkup.ma
```

Expected page:

```text
        [ Avatar ]

     Mohammed Zoubaa

    Software Engineer

    ┌───────────────────┐
    │       GitHub      │
    └───────────────────┘

    ┌───────────────────┐
    │      LinkedIn     │
    └───────────────────┘

    ┌───────────────────┐
    │     Portfolio     │
    └───────────────────┘
```

### Tasks

- [ ] Create public profile page
- [ ] Display avatar
- [ ] Display display name
- [ ] Display bio
- [ ] Fetch active links
- [ ] Render links in correct order
- [ ] Make links clickable
- [ ] Handle non-existing usernames
- [ ] Create 404 profile page

---

# Phase 5 — Subdomain Foundation

## Goal

Support:

```text
username.linkup.ma
```

### Cloudflare

- [ ] Configure domain in Cloudflare
- [ ] Configure DNS
- [ ] Configure wildcard DNS
- [ ] Configure SSL
- [ ] Configure frontend custom domain
- [ ] Test wildcard subdomains

### Application

The application must identify:

```text
mohammed.linkup.ma
```

as:

```text
username = mohammed
```

Then:

```text
username
    ↓
Profile lookup
    ↓
User data
    ↓
Links
    ↓
Public page
```

---

# Phase 6 — Dashboard

## Goal

Create the main authenticated dashboard.

```text
Dashboard

Profile
────────────────────
Name
Username
Bio
Avatar

Links
────────────────────
GitHub
LinkedIn
Portfolio

[ + Add Link ]

Appearance
────────────────────
Basic theme settings

Public URL
────────────────────
mohammed.linkup.ma
```

### Tasks

- [ ] Dashboard layout
- [ ] Profile section
- [ ] Link management section
- [ ] Public URL section
- [ ] Logout button
- [ ] Basic responsive design

---

# Phase 7 — Deployment

## Frontend

Deploy React application to:

```text
Vercel
```

## Backend

Deploy Express API to:

```text
Render
```

or:

```text
Railway
```

## Database

Use:

```text
Neon PostgreSQL
```

## DNS

Use:

```text
Cloudflare
```

### Tasks

- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Configure Neon production database
- [ ] Configure environment variables
- [ ] Configure production CORS
- [ ] Configure Google OAuth production URLs
- [ ] Configure Cloudflare DNS
- [ ] Configure wildcard subdomain
- [ ] Test production authentication
- [ ] Test production link management
- [ ] Test public subdomain

---

# MVP Acceptance Criteria

The MVP is considered complete when the following flow works:

```text
1. User opens LinkUp
        ↓
2. User clicks "Continue with Google"
        ↓
3. Google authentication succeeds
        ↓
4. User creates a unique username
        ↓
5. User enters the dashboard
        ↓
6. User adds a GitHub link
        ↓
7. User adds a LinkedIn link
        ↓
8. User edits a link
        ↓
9. User deletes a link
        ↓
10. User changes link order
        ↓
11. User disables a link
        ↓
12. Public profile is accessible
        ↓
13. username.linkup.ma displays the profile
        ↓
14. Only active links are displayed
```

---

# Explicitly Out of Scope

The following must NOT be implemented in the MVP:

- [ ] Advanced analytics
- [ ] Visitor tracking
- [ ] Click analytics
- [ ] Portfolio builder
- [ ] Projects
- [ ] Experience
- [ ] Skills
- [ ] Certificates
- [ ] Custom domains
- [ ] Payments
- [ ] Subscriptions
- [ ] Premium plans
- [ ] AI features
- [ ] Advanced themes
- [ ] Team accounts
- [ ] Admin dashboard

These features will be evaluated after the MVP.

---

# MVP Architecture

```text
                         Cloudflare
                    Domain + DNS + SSL
                             │
               ┌─────────────┼─────────────┐
               │             │             │
               ▼             ▼             ▼
          linkup.ma    api.linkup.ma   *.linkup.ma
               │             │             │
               ▼             ▼             ▼
             Vercel       Express       Vercel
                             │
                             ▼
                       Neon PostgreSQL
                             │
                             ▼
                        Google OAuth
```

---

# Development Principle

Keep the MVP small.

The goal is not to build the final LinkUp platform.

The goal is to prove the core idea:

> **Google Login → Create identity → Manage links → Share a personal LinkUp page.**

Everything else comes after the MVP.
