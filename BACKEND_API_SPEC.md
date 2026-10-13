# Fitia Progress Tracker — Backend API Specification

**Version:** 1.0 (Prototype)  
**Base URL (production):** `https://your-domain.com/api`  
**Base URL (local dev):** `http://localhost:3000/api`

---

## Overview

The frontend is a Vue/Nuxt 3 SPA. It calls **one endpoint** to load the entire dashboard.  
All rendering and payment calculation happen on the frontend — the API only needs to return the raw numbers.

---

## Endpoints

### `GET /api/users/:userId/stats`

Returns scanning stats and money earned for a given user.

**Path parameter**

| Param | Type | Description |
|---|---|---|
| `userId` | `string` | Alphanumeric user ID entered on the login screen |

**Example request**
```
GET /api/users/ABC123/stats
```

**Success response — `200 OK`**
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
| `totalScanned` | `number` | **All** barcodes scanned — new + already-existing |
| `newScanned` | `number` | Products new to the DB, created by the user with photos. **These count for payment.** |
| `notNewScans` | `number` | Barcodes scanned that already existed in the DB. Equals `totalScanned − newScanned`. |
| `paymentRate` | `number` | Per-product USD rate for this user. Currently `0.08` or `0.10`. |
| `moneyEarned` | `number` | `newScanned × paymentRate`, rounded to 2 decimal places. |

> **Note:** `moneyEarned` can be computed by the API or by the frontend — the frontend currently accepts it from the API directly. If you prefer to send just the raw numbers and have the frontend compute it, remove `moneyEarned` from the response and update `dashboard.vue` accordingly.

---

**Error responses**

| Status | When to return |
|---|---|
| `400 Bad Request` | `userId` is missing, empty, or contains invalid characters |
| `404 Not Found` | No user exists with this ID |
| `500 Internal Server Error` | Unexpected server/DB failure |

Error body (consistent shape):
```json
{
  "statusCode": 404,
  "statusMessage": "User not found"
}
```

---

## Authentication

**Current prototype:** No auth — the `userId` in the URL path is the only identifier.

**Recommended for production:**
1. Replace the plain User ID login with a `POST /api/auth/login` endpoint.
2. Return a signed JWT (or set an `HttpOnly` session cookie).
3. The frontend composable to update is `composables/useSession.ts` — the `login()` function is the single integration point.

---

## Payment Rate Logic

The `paymentRate` field must come from the **user's profile in the database** — the frontend does not calculate or store which rate applies.

Current contract values: `0.08` or `0.10` (USD per new product).

---

## CORS

During development, if the frontend runs on a different origin than the API, set:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET
```
For production, restrict to your actual frontend domain.

---

## Replacing the Mock

The mock lives at:
```
server/api/users/[userId]/stats.get.ts
```

Replace the function body with a real DB query (Prisma, Drizzle, Supabase, raw SQL, etc.) that returns the same JSON shape shown above. No frontend changes needed.

---

## Data Sources (for DB schema reference)

| Field | Likely source table/column |
|---|---|
| `totalScanned` | `scans` table — `COUNT(*)` where `user_id = :userId` |
| `newScanned` | `scans` table — `COUNT(*)` where `user_id = :userId AND is_new_product = true` |
| `notNewScans` | `totalScanned − newScanned` |
| `paymentRate` | `users` table — `payment_rate` column |
| `moneyEarned` | `newScanned × paymentRate` |
