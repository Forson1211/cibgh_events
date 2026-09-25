# CIB Ghana Events Platform (Monorepo)

The official digital events, delegate registration, and ticketing platform for the **Chartered Institute of Bankers (CIB), Ghana**.

---

## 📁 Repository Structure

```text
cib-ghana/
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── public/             # Branding assets, event photos & venue imagery
│   ├── src/
│   │   ├── components/     # UI, layouts, navigation, and modal widgets
│   │   ├── context/        # Global App state & auth context
│   │   ├── pages/          # Public portal, event details, and admin dashboard
│   │   ├── lib/            # Supabase client, Paystack simulator & utilities
│   │   └── types/          # TypeScript domain models
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Node.js + Express + TypeScript REST API
│   ├── database/           # PostgreSQL / Supabase SQL schema migrations
│   ├── src/
│   │   ├── config/         # Environment & Supabase client initialization
│   │   ├── controllers/    # Events, registrations, payments & tickets
│   │   ├── routes/         # Express REST API endpoints
│   │   ├── services/       # Paystack gateway, Resend email & QR ticketing
│   │   └── types/          # Backend request & response schemas
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── package.json            # Root workspace configuration
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory to install packages across both workspaces:
```bash
npm install
```

### 2. Configure Environment Variables
- In `frontend/`: Copy `.env.example` to `.env`
- In `backend/`: Copy `.env.example` to `.env`

### 3. Run Development Servers
To run both **Frontend** and **Backend** concurrently:
```bash
npm run dev
```

Or run each service individually:
- **Frontend only**: `npm run dev:frontend` (serves at `http://localhost:5173`)
- **Backend only**: `npm run dev:backend` (serves at `http://localhost:5000`)

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & uptime |
| `GET` | `/api/events` | List all events (filter by category or search) |
| `GET` | `/api/events/:slugOrId` | Get detailed event metadata |
| `POST` | `/api/registrations` | Register delegate for an event & issue ticket |
| `GET` | `/api/registrations/:identifier` | Get registration by ID or registration code |
| `POST` | `/api/payments/initialize` | Initialize Paystack payment |
| `GET` | `/api/payments/verify/:reference` | Verify Paystack payment & confirm registration |
| `GET` | `/api/tickets/:identifier` | Fetch digital pass with high-res QR code |
| `POST` | `/api/tickets/verify-qr` | Scan & verify attendee QR pass at venue |
| `POST` | `/api/tickets/:identifier/check-in` | Mark attendee as checked in |
| `GET` | `/api/admin/stats` | Delegate count, revenue & check-in statistics |
