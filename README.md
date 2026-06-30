# CashPilot — Treasury & Cash Management Platform

## Overview

CashPilot is a modern treasury and cash management platform designed to help businesses track, control, and optimize their cash flow through invoices, payments, and financial records.

**Current Status**: In active development (MVP Phase)

---

## Current Progress (as of June 30, 2026)

### Completed

**Backend**
- Project Structure: Feature-based modular architecture
- Domain Modeling: Core entities (`Company`, `Customer`, `Invoice`, `Payment`, `LedgerEntry`, `User`)
- Multi-Tenancy: Row-level with `company_id` filtering + `TenantContext`
- Authentication: Login/Register with JWT + Refresh Token
- Database Schema: PostgreSQL with Flyway migrations (V1 to V5+)
- Backend Setup: Spring Boot 3 + Java 21
- Entities & Enums: `InvoiceStatus`, `LedgerEntryType` (DEBIT/CREDIT), general status fields
- Configuration: `.env` support + Flyway integration
- API Design: Consistent `ApiResponse<T>` wrapper + Global Exception Handler
- Modules Completed:
  - **Auth**: User + Company creation during registration
  - **Customer**: Full CRUD
  - **Invoice**: CRUD + State Transitions (DRAFT → ISSUED → SENT → PAID, etc.)
  - **Payment**: Triggered from Invoice pay endpoint
  - **Ledger**: Automatic entry on payment (CREDIT/DEBIT logic)
  - **Transaction Listing**: Full history view

**Frontend**
- Project Structure: Feature-based modular architecture (`page` / `component` / `hook` / `store` / `api` per module)
- Stack: React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand
- Design System: Custom Tailwind theme (brand colors, typography scale, shared component classes)
- Authentication: Access-token-in-memory flow, silent session rehydration on page reload via `GET /api/auth/refresh`, protected routing
- Reusable UI Library: `Button` (5 variants, loading state), `Input`, `Select`, `Modal`, `Loader`, custom form-level validation (no native browser validation)
- Toast Notification System: Global Zustand-backed toast queue, backend message-code mapping
- Modules Completed:
  - **Auth**: Login / Register (2-step wizard: personal info → company info)
  - **Customer**: Full CRUD with paginated table and modal-based forms
  - **Invoice**: Full lifecycle UI — create, edit, view, delete, plus status-aware actions (Issue, Send, Pay, Cancel) with guarded availability per status
  - **Transactions**: Read-only paginated ledger view with type/status filtering and detail modal

**DevOps**
- Docker Setup:
  - `docker-compose.yml` orchestrating PostgreSQL, Backend, and Frontend
  - Multi-stage `Dockerfile` for the backend (Maven build → JRE runtime)
  - Multi-stage `Dockerfile` for the frontend (Node build → Nginx static serve)
  - Custom `nginx.conf` for SPA client-side routing, gzip compression, and static asset caching
  - Shared Docker network (`cashpilot-network`) for inter-service communication
  - Environment-driven configuration via root `.env` (DB credentials, frontend API base URL injected at build time)

### In Progress
- Advanced reporting & dashboard analytics
- Role-based access control
- End-to-end testing & documentation

---

## Tech Stack

| Layer            | Technology                                             |
|-------------------|----------------------------------------------------------|
| Backend          | Java 21, Spring Boot 3, Spring Security, JWT              |
| Database         | PostgreSQL, Flyway                                         |
| Frontend         | React 18, TypeScript, Vite, Tailwind CSS v4, Zustand       |
| Containerization | Docker, Docker Compose                                     |
| Web Server       | Nginx (frontend static serving)                            |
| Build Tools      | Maven (backend), npm (frontend)                            |

---

## Project Structure

```
cashpilot/
├── client/              # React + TypeScript frontend
│   ├── src/
│   │   ├── app/         # Router, ProtectedRoute
│   │   ├── components/  # Shared UI library (Button, Input, Modal, etc.)
│   │   ├── modules/      # Feature modules (auth, customers, invoices, transactions)
│   │   ├── pages/         # Route-level pages
│   │   └── utils/         # Axios instance, toast system, validation helpers
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server/              # Spring Boot backend
│   ├── src/
│   └── Dockerfile
├── workbench/           # SQL diagrams / schema design
├── .env                 # Shared environment variables
├── docker-compose.yml
└── README.md
```

---

## How to Run Locally

### Using Docker (Recommended)

This brings up PostgreSQL, the Spring Boot backend, and the React frontend (served via Nginx) together on a shared Docker network.

```bash
# 1. Go to project root
cd cashpilot

# 2. Copy the example environment file and adjust values if needed
cp .env.example .env

# 3. Start all services (postgres, backend, frontend)
docker compose --profile dev up --build -d
```

> The `--profile dev` flag is required — the backend and frontend services are scoped to the `dev` profile and will not start without it.

Once running:

| Service   | URL                    |
|-----------|-------------------------|
| Frontend  | http://localhost:5173   |
| Backend   | http://localhost:8080   |
| Postgres  | localhost:5432           |

**Stopping services:**

```bash
docker compose --profile dev down          # stop containers, keep DB data
docker compose --profile dev down -v       # stop containers and wipe DB volume
```

**Rebuilding after changes:**

```bash
# Frontend env vars (e.g. VITE_API_BASE_URL) are baked in at build time —
# a code or .env change requires a rebuild, not just a restart.
docker compose build cashpilot-frontend
docker compose up -d cashpilot-frontend
```

**Viewing logs:**

```bash
docker compose logs -f cashpilot-frontend
docker compose logs -f cashpilot-backend
docker compose logs -f postgres
```

### Running Without Docker (Manual Setup)

**Backend**

```bash
cd server
./mvnw spring-boot:run
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and expects the backend at `http://localhost:8080` by default (configurable via `VITE_API_BASE_URL` in `client/.env`).

---

## Environment Variables

Defined in the root `.env` file:

```bash
# Database
DB_PASSWORD=123456

# Frontend (baked into the build — requires rebuild on change)
VITE_API_BASE_URL=http://localhost:8080
```

---

## Roadmap

- [ ] Role-based access control (RBAC)
- [ ] Advanced dashboard analytics & charts
- [ ] PDF invoice generation & export
- [ ] Email notifications (invoice sent, payment received, overdue reminders)
- [ ] Automated test coverage (unit + integration)
- [ ] CI/CD pipeline