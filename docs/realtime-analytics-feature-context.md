# Real-Time Analytics & Insights Engine — Feature Context & Specification

## Executive Summary
The **Real-Time Analytics & Insights Engine** is a core capability for **Link Make Up** (`linkmakeup.com`). It provides creators, developers, freelancers, and businesses with real-time, 100% authentic traffic intelligence. 

Users can monitor how many people visit their digital identity profile, how many times their physical **NFC Smart Card** is tapped at networking events, and which specific social or portfolio links receive the most engagement.

---

## 1. Value Proposition & Key Use Cases

1. **Physical NFC Card ROI Tracking:** 
   When users tap their physical matte black NFC card on a smartphone at an event in Casablanca, Rabat, or anywhere globally, the tap is recorded live with `referrer: "nfc"`. Users can answer: *"How many leads tapped my card this week?"*
2. **Top Performing Links Identification:** 
   Users can see which link (e.g. WhatsApp, Portfolio, GitHub, Instagram, vCard download) generates the highest conversion rate.
3. **Privacy-First & Lightweight:** 
   GDPR-compliant event tracking without invasive third-party tracking cookies or heavy JavaScript bundles.

---

## 2. Metrics & KPIs

```text
┌───────────────────────────┬───────────────────────────┬───────────────────────────┬───────────────────────────┐
│     TOTAL PAGE VIEWS      │       LINK CLICKS         │       NFC CARD TAPS       │      CLICK-THROUGH %      │
│          1,420            │           385             │            84             │           27.1%           │
│       (Real-Time)         │       (Real-Time)         │      (Tap-to-Share)       │       (Clicks / Views)    │
└───────────────────────────┴───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### Metrics Tracked:
- **Total Profile Views:** Total number of times the public profile was loaded.
- **NFC Card Taps:** Total number of visits originating from a physical NFC tap (`?ref=nfc`).
- **Total Link Clicks:** Aggregate count of clicks across all buttons.
- **Click-Through Rate (CTR %):** `(Total Link Clicks / Total Profile Views) * 100`.
- **Top Clicked Links (Ranked):** Ordered breakdown of links by click count and percentage of total clicks.
- **Device Breakdown:** Mobile vs Desktop vs Tablet visitors.

---

## 3. Data Integrity & Anti-Spam Protections

To guarantee stats are **100% real and authentic**:
1. **Exclude Profile Owner Visits:** Page loads initiated by the account owner while logged into their Studio dashboard are ignored.
2. **Exclude Search Engine Crawlers:** Requests matching known bot signatures (Googlebot, Bingbot, YandexBot, Twitterbot) are filtered out.
3. **Debounced Event Ingestion:** Prevents rapid accidental double-clicks from double-counting.

---

## 4. Database Schema (Drizzle ORM)

File: [`backend/src/models/schema.js`](file:///Users/zoubaa/dev/linkmakeup/backend/src/models/schema.js)

```javascript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { profiles, links } from './schema.js';

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  linkId: uuid('link_id').references(() => links.id, { onDelete: 'cascade' }), // NULL for page view/nfc tap, UUID for link click
  eventType: varchar('event_type', { length: 20 }).notNull(), // 'page_view' | 'nfc_tap' | 'link_click' | 'vcard_download'
  referrer: varchar('referrer', { length: 255 }), // 'nfc', 'direct', 'instagram', 'linkedin', 'twitter', 'github'
  deviceType: varchar('device_type', { length: 50 }), // 'mobile' | 'desktop' | 'tablet'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 5. API Endpoints Specification

### 1. Ingest Event (Public Endpoint)
- **Method / Path:** `POST /api/v1/analytics/track`
- **Auth Required:** No (Public Beacon)
- **Request Payload:**
```json
{
  "username": "soufiane",
  "eventType": "page_view", // or "nfc_tap" or "link_click" or "vcard_download"
  "linkId": "optional-link-uuid",
  "referrer": "nfc",
  "deviceType": "mobile"
}
```
- **Response:** `{ "success": true }`

---

### 2. Fetch Analytics Summary (Authenticated Endpoint)
- **Method / Path:** `GET /api/v1/analytics/summary?period=30d`
- **Auth Required:** Yes (JWT Bearer / Cookie)
- **Query Parameters:** `period` (`24h`, `7d`, `30d`, `all`)
- **Response Payload:**
```json
{
  "success": true,
  "summary": {
    "totalViews": 1420,
    "totalClicks": 385,
    "nfcTaps": 84,
    "ctr": 27.1,
    "topLinks": [
      {
        "linkId": "uuid-1",
        "title": "WhatsApp Contact",
        "url": "https://wa.me/212600000000",
        "icon": "whatsapp",
        "clicks": 142,
        "percentage": 36.8
      },
      {
        "linkId": "uuid-2",
        "title": "GitHub Portfolio",
        "url": "https://github.com/zoubaax",
        "icon": "github",
        "clicks": 98,
        "percentage": 25.4
      }
    ],
    "devices": {
      "mobile": 1150,
      "desktop": 270
    }
  }
}
```

---

## 6. Frontend Architecture & UI Components

1. **Public Profile Tracking Beacon ([`PublicProfile.jsx`](file:///Users/zoubaa/dev/linkmakeup/frontend/src/components/PublicProfile.jsx)):**
   - Automatically detects `?ref=nfc` in URL search parameters to trigger `nfc_tap` vs `page_view`.
   - Attaches `onClick` handlers on links to emit `link_click` events asynchronously via `navigator.sendBeacon` or `fetch`.
2. **Studio Analytics Dashboard ([`AnalyticsView.jsx`](file:///Users/zoubaa/dev/linkmakeup/frontend/src/components/dashboard/AnalyticsView.jsx)):**
   - Renders a clean Studio tab alongside Profile, Links, and Theme settings.
   - Displays real-time KPI cards, interactive period filter, and ranked top links list.
