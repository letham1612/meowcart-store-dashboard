# Meowcart Store Snapshot Dashboard

A full-stack Shopify dashboard developed for the **Meowcart Fresher Software Engineer Take-Home Assignment**.

Built with React, TypeScript, Tailwind CSS, Express, and Shopify Admin GraphQL API (`2026-10`).

## Features

**Must-have**
- Product statistics: total, active, and draft products across the entire store.
- Order count and total order value for the last 30 days.
- Low-stock products (`totalInventory < 5`) with images, status, SKU, inventory, price, vendor, and last updated date.
- Server-side Shopify API integration to protect the Admin API access token.

**Nice-to-have**
- Orders per Day chart for the last 14 days, grouped by Vietnam time (UTC+7).
- Skeleton loading and API error states with Retry.
- Cursor-based pagination with configurable rows per page and total product count.

## Getting Started

**Requirements:** Node.js, npm, a Shopify store, and an Admin API access token with the required read permissions.

### 1. Clone the Repository

```bash
git clone https://github.com/letham1612/meowcart-store-dashboard.git
cd meowcart-dashboard
```

### 2. Configure and Start the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=3000
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
SHOPIFY_API_VERSION=2026-10
```

Replace the placeholders with valid Shopify credentials. Never commit the `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

Backend: `http://localhost:3000`

### 3. Start the Frontend

Open another terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

The frontend communicates with Express through Vite's `/api` proxy. All Shopify requests are handled on the backend.

## Architecture & Technical Decisions

```text
React + TypeScript + Tailwind
             |
             v
       Express REST API
             |
             v
  Shopify Admin GraphQL API
```

- **React + TypeScript:** Reusable, type-safe components with custom hooks separating data fetching from UI.
- **Express:** Handles Shopify API requests and keeps credentials server-side.
- **GraphQL:** Retrieves only the data required by the dashboard using raw GraphQL queries and native `fetch`.
- **Cursor-based pagination:** Fetches products page by page instead of loading all records into the browser.
- **Error handling:** Dashboard and Low-stock requests handle failures independently.
- **Timezone handling:** Shopify timestamps remain in UTC, while daily statistics and displayed dates use `Asia/Ho_Chi_Minh` (UTC+7) for Vietnamese users. Orders and revenue use a rolling 30 × 24-hour window.
- **No database or OAuth:** Not required for this standalone, read-only application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/shop` | Shopify store information |
| GET | `/api/dashboard` | Product statistics, orders, revenue, and chart |
| GET | `/api/low-stock?first=5` | Paginated low-stock products |

The Low-stock endpoint also supports an optional `cursor` parameter.

## Testing

- Verified Shopify GraphQL data and revenue calculations using Postman.
- Added 3 unit tests for Vietnam calendar-day boundaries, UTC timestamp conversion, and the rolling 30-day filter.
- All 3 unit tests passed.
- Backend typecheck and production build passed.
- Frontend production build passed.

Run backend tests:

```bash
cd server
npx tsx --test src/utils/date.test.ts
```

## Limitations

- SKU and price are taken from the first product variant.
- Products with untracked inventory may appear in low-stock results.
- Cursor pagination does not support direct navigation to arbitrary pages.
- Automated tests currently cover date utilities; broader API and UI test coverage is still needed.

## If I Had One More Hour

I would prioritize adding automated tests for revenue calculations and cursor-based pagination to improve reliability and error handling.

## Time Spent

**Total: Approximately 2 hours**

Includes Shopify API exploration, backend and frontend implementation, debugging, testing, and documentation.

## AI Usage Disclosure

I used ChatGPT and OpenAI Codex as development assistance tools.

ChatGPT: Assisted with understanding Shopify GraphQL API, discussing technical approaches, and troubleshooting issues, and generating an admin dashboard mockup for UI planning.

OpenAI Codex: Assisted with timezone adjustments and writing unit tests for date-handling logic (date.test.ts).

I reviewed the AI-assisted changes and verified the implementation using Postman, unit tests, type checking, and production builds.