# Modo Fácil — Full-stack E-commerce

[![CI](https://github.com/Danixxx999/modo-facil-ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/Danixxx999/modo-facil-ecommerce/actions/workflows/ci.yml)

Modo Fácil is a full-stack e-commerce project focused on a simple Colombian shopping flow: product discovery, cart, checkout, WhatsApp-assisted order confirmation and a protected administration panel.

The project started as an earlier prototype and has been refactored into a safer, cleaner and more teachable codebase suitable for portfolio review, classroom demonstrations and continued engineering work.

## Highlights

- Responsive storefront with products, categories, combos, FAQ and testimonials.
- Tiered product pricing and persistent shopping cart.
- Checkout with prepaid and cash-on-delivery payment options.
- **Free shipping for every payment method**; no logistics surcharge is added to the order total.
- WhatsApp-assisted order confirmation and customer support flows.
- Protected admin area for catalog, orders, customers, reports and store settings.
- PocketBase migrations for a reproducible application data model.
- Environment-based bootstrap credentials instead of hard-coded admin passwords.
- CI workflow that installs dependencies, runs ESLint and creates a production build.
- Sensitive runtime database files, backups, binaries and local environment files are excluded from Git.

## Tech stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Radix UI, Framer Motion, Recharts, React Hook Form and Zod.

**Backend / data:** PocketBase with JavaScript migrations.

**Engineering:** npm workspaces, ESLint and GitHub Actions.

## Repository structure

```text
.
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   └── vite.config.js
│   └── pocketbase/
│       ├── pb_migrations/
│       └── .pocketbase-version
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_LAYER.md
│   └── TEACHING_GUIDE.md
├── .github/workflows/ci.yml
├── CONTRIBUTING.md
├── ROADMAP.md
└── SECURITY.md
```

## Local development

### Requirements

- Node.js 22+
- npm
- PocketBase **0.40.4** (the expected version is stored in `apps/pocketbase/.pocketbase-version`)

### 1. Install JavaScript dependencies

```bash
npm install
```

### 2. Install PocketBase locally

Download the PocketBase binary that matches the version in `apps/pocketbase/.pocketbase-version` from the official PocketBase releases page and place it at:

```text
apps/pocketbase/pocketbase
```

On macOS/Linux:

```bash
chmod +x apps/pocketbase/pocketbase
```

### 3. Configure the backend

Use `.env.example` as a reference and export the required variables in your shell before starting PocketBase.

At minimum, set a strong `PB_ENCRYPTION_KEY`. Optional bootstrap variables can create the first PocketBase superuser and storefront administrator when migrations run.

Never commit real credentials.

### 4. Configure the frontend

```bash
cp apps/web/.env.example apps/web/.env
```

The local default points to PocketBase at `http://127.0.0.1:8090`.

### 5. Start the project

```bash
npm run dev
```

- Web app: `http://localhost:3000`
- PocketBase: `http://127.0.0.1:8090`

## Quality checks

```bash
npm run check
```

The same lint/build checks run in GitHub Actions on pushes and pull requests to `main`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Data-layer strategy](docs/DATA_LAYER.md)
- [Teaching guide](docs/TEACHING_GUIDE.md)
- [Engineering roadmap](ROADMAP.md)
- [Security guidance](SECURITY.md)
- [Contribution workflow](CONTRIBUTING.md)

## Data-layer direction

PocketBase is intentionally retained for **v1** because it keeps the project self-contained, transparent and easy to teach.

A future **v2** can migrate persistence to PostgreSQL behind a dedicated backend API when the project needs stronger transactional workflows, reporting, integrations or scale. The migration is treated as an architectural evolution, not as a cosmetic technology swap.

## Security

The repository intentionally excludes `pb_data`, PocketBase backups, local binaries and `.env` files. Production/customer data must never be committed.

The order-tracking flow is scheduled for additional server-side hardening before production use; see [ROADMAP.md](ROADMAP.md).

## Author

**Daniel Felipe Olaya Hermosa**  
Systems Engineer · Full-Stack Developer · Product Builder · E-commerce & Digital Growth

---

This repository is published as a portfolio and educational project. No open-source license is granted unless a license file is added explicitly.
