# EMPOWERRURAL Monorepo

> **Tagline:** "Connecting Rural Youth with Skills, Careers, and Opportunities."

EmpowerRural is a production-quality platform designed to reduce unemployment among rural youth in India by aggregating verified local jobs, government certified courses, smart scheme eligibility checkers, resume builders, and AI-powered career coaching.

---

## 🏗️ Architecture Layout

```text
/CSP (Workspace Root)
├── package.json              # workspace definitions
├── apps/
│   ├── web/                  # React + TypeScript + Vite + Tailwind + PWA
│   └── api/                  # Express + Node.js + TS Backend API
├── packages/
│   ├── types/                # Shared TS declarations
│   ├── utils/                # Regional constants and formatters
│   └── ui/                   # Shared Tailwind CSS atomic component library
└── supabase/
    ├── schema.sql            # Core database layout
    └── seed.sql              # Database seed data
```

---

## ⚡ Tech Stack & Tools

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, TanStack Query, Lucide icons.
* **Backend:** Node.js, Express, tsx watch execution.
* **Database:** Supabase PostgreSQL & Supabase Auth.
* **Security:** Helmet, Express Rate Limiter, Zod validator, CORS protection.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) and npm installed.

### Setup Instructions

1. **Install Dependencies:**
   Run the following command at the monorepo root to link packages and install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment Variables:**
   Create a `.env` file at the root of the workspace. Use `.env.example` as a template:
   ```bash
   copy .env.example .env
   ```

3. **Database Dual Mode:**
   * **Mock Fallback (Default):** If `SUPABASE_URL` is left empty inside your `.env`, the server automatically initializes in **Offline Mock Mode** using an active in-memory JSON database seeded with sample Indian states, districts, skills, quiz metrics, mock questions, schemes, and jobs. Everything will run out-of-the-box!
   * **Live Supabase:** Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` to connect the backend to your live Supabase Postgres tables.

---

## 💻 Developer Scripts

Run these commands from the root directory:

* **Start dev servers concurrently (Both Web and API):**
  ```bash
  npm run dev
  ```
  * Frontend runs at: `http://localhost:3000`
  * Backend API runs at: `http://localhost:5000`
  * API Health-check: `http://localhost:5000/health`

* **Build the entire workspace for production deployment:**
  ```bash
  npm run build
  ```
