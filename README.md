# ERPStar

A runnable ERP system with a React/TypeScript dashboard, an Express API, Prisma, and PostgreSQL. It includes login, employee/product/customer/supplier/expense management, sales-order capture, and dashboard summaries.

It also includes a read-only ERP assistant. It answers common questions directly from live ERP data without any external AI account. Optionally, enable AI-generated responses with an OpenAI-compatible provider by setting `AI_API_KEY`, `AI_API_URL` (base URL, such as `https://api.openai.com/v1`), and `AI_MODEL` (default `gpt-4o-mini`) in `.env`. The key stays on the backend. When AI is enabled, the assistant sends a bounded, read-only snapshot of business data and recent chat to that provider; only enable this for a provider approved to process your data.

## Run locally

Requirements: Node.js 20+, npm, and Docker Compose.

1. Copy `.env.example` to `.env` and change the database and JWT secrets.
   To use AI-generated responses, optionally set `AI_API_KEY` to a key from your chosen OpenAI-compatible provider. Change `AI_API_URL` and `AI_MODEL` if needed. Keep the key private and out of source control. Without a key, built-in live ERP answers still work.
2. Start PostgreSQL: `docker compose up -d database`
3. Install dependencies: `npm install`
4. Generate Prisma Client: `npm run db:generate`
5. Apply the initial schema: `npm run db:migrate`
6. Create the initial administrator: `npm run db:seed`
7. Start both apps: `npm run dev`

Open http://localhost:5173. The initial admin email and password come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (defaults are shown in `.env.example`). Change the default password before using this outside a local demo.

The API runs at http://localhost:4000; `GET /api/health` is public. All business routes require a bearer token obtained from `POST /api/auth/login`.

## Docker Compose

Copy `.env.example` to `.env`, set strong secrets, then run:

```sh
docker compose up --build
```

The web app is served at http://localhost:8081 and the API at http://localhost:4000. Set `FRONTEND_PORT` in `.env` if you want to use a different port, and make sure `CORS_ORIGIN` includes that frontend URL. On first startup the backend applies Prisma migrations and seeds the administrator. Persistent PostgreSQL data is stored in the `erp_postgres_data` volume.

## MVP modules

- Dashboard with employee, inventory, sales, and expense totals.
- Employee directory and employee CRUD.
- Inventory products and stock-on-hand fields.
- Customer and supplier directories.
- Sales order creation and order listing.
- Expense tracking.
- Read-only AI assistant for current ERP data, with configurable OpenAI-compatible provider.
- JWT authentication and protected API routes.

This is a starter ERP, not an accounting, payroll, or regulatory-compliance system. Add authorization policies, audit trails, backups, and production secret management before deployment.
