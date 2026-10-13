# Fitia Progress Tracker

A mobile-first Vue/Nuxt 3 web app that lets Fitia product scanners view their scanning progress and earnings.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Nuxt 3 (SSR disabled – SPA mode) |
| Language | TypeScript + Vue 3 Composition API |
| Styling | Scoped `<style>` per component (no external CSS framework) |
| Session | `sessionStorage` (persists across refreshes, cleared on tab close) |
| API | Nuxt server routes (`/server/api/`) → replace mocks with real DB |

---

## Getting Started

```bash
cd fitia-progress-tracker
npm install
npm run dev          # → http://localhost:3030
```

---

## Project Structure

```
fitia-progress-tracker/
├── app.vue                          # Root shell
├── nuxt.config.ts                   # Nuxt config (SPA, fonts, viewport)
├── assets/css/main.css              # Global resets
├── composables/
│   └── useSession.ts                # Session management (sessionStorage)
├── pages/
│   ├── index.vue                    # Login screen (yellow Fitia branding)
│   └── dashboard.vue                # Main stats + earnings view (dark mode)
├── components/
│   └── InfoPopup.vue                # Reusable bottom-sheet info popup
└── server/api/users/[userId]/
    └── stats.get.ts                 # GET /api/users/:userId/stats  ← MOCK
```

---

## Backend Integration Guide

### Authentication / Session

The frontend stores the **User ID** entered by the user in `sessionStorage` (key: `fitia_user_id`).  
There is **no JWT or token-based auth in the prototype**. For production:

- Add a `POST /api/auth/login` endpoint that validates the User ID against the database.
- Return a signed JWT (or set an `HttpOnly` cookie).
- The frontend `useSession.ts` composable is the single place to modify for this.

---

### API Endpoint Required

#### `GET /api/users/:userId/stats`

Returns all data needed for the dashboard in one call.

**Request**
```
GET /api/users/ABC123/stats
```

No request body. User ID comes from the URL path parameter.

**Response (200 OK)**
```json
{
  "userId": "ABC123",
  "totalScanned": 148,
  "newScanned": 67,
  "notNewScans": 81,
  "paymentRate": 0.08,
  "moneyEarned": 5.36
}
```

**Field definitions**

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Echo of the requested User ID |
| `totalScanned` | `number` | All barcodes scanned (new + not new) |
| `newScanned` | `number` | Products newly created with photos (counts for payment) |
| `notNewScans` | `number` | Barcodes scanned but product already existed – `totalScanned - newScanned` |
| `paymentRate` | `number` | USD per new product. Either `0.08` or `0.10` depending on user's contract |
| `moneyEarned` | `number` | `newScanned × paymentRate`, rounded to 2 decimal places |

**Error responses**

| Status | Meaning |
|---|---|
| `404` | User ID not found |
| `400` | Malformed User ID |
| `500` | Server error |

---

### Payment Rate Logic

Each user has a `paymentRate` stored in their profile. The frontend does **not** calculate which rate applies — it simply displays `paymentRate` as returned by the API.

Possible values in the current contract:
- `0.08` ($0.08 per new product)
- `0.10` ($0.10 per new product)

---

### Replacing the Mock

The file `server/api/users/[userId]/stats.get.ts` contains a mock implementation.  
Replace it with a real database query (Prisma, Drizzle, Supabase, etc.) returning the same shape.

---

## Deployment

```bash
npm run build      # Builds to .output/
npm run generate   # Static export to dist/ (works on any CDN / GitHub Pages)
```

For Vercel / Netlify: just connect the repo — Nuxt is auto-detected.

---

## Design Tokens

| Token | Value | Used for |
|---|---|---|
| `--yellow` | `#FFBE00` | Primary brand, CTA, earnings |
| `--green` | `#2ECC71` | New scanned products |
| `--bg-dark` | `#0D0D0F` | Dashboard background |
| `--card-bg` | `#161618` | Card backgrounds |
| `--text-primary` | `#FFFFFF` | Main text |
| `--text-muted` | `rgba(255,255,255,0.4)` | Muted text, "not new scans" |
