# Modo Fácil — Full-stack E-commerce

Modo Fácil is a full-stack e-commerce project focused on a simple Colombian shopping flow: product discovery, cart, checkout, WhatsApp-assisted order confirmation and a protected administration panel. The codebase was refactored from an earlier prototype to make the repository safer, easier to run locally and more suitable for a professional portfolio.

## Highlights

- Responsive storefront with products, categories, combos, FAQ and testimonials.
- Tiered product pricing and persistent shopping cart.
- Checkout with prepaid and cash-on-delivery payment options.
- **Free shipping for every payment method**; no logistics surcharge is added to the order total.
- WhatsApp-assisted order confirmation and customer support flows.
- Order-tracking interface retained from the current product; the public lookup backend is listed for security hardening in the roadmap.
- Protected admin area for catalog, orders, customers, reports and store settings.
- PocketBase migrations for the application data model.
- CI workflow for linting and production builds.
- Sensitive PocketBase runtime data and local credentials are excluded from Git.

## Tech stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Radix UI, Framer Motion, Recharts, React Hook Form and Zod.

**Backend / data:** PocketBase with JavaScript migrations.

**Tooling:** npm workspaces, ESLint and GitHub Actions.

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
├── docs/ARCHITECTURE.md
├── .github/workflows/ci.yml
└── package.json
```

## Local development

### Requirements

- Node.js 22+
- npm
- PocketBase **0.40.4** (the expected version is stored in `apps/pocketbase/.pocketbase-version`)

### 1. Install JavaScript dependencies

```bash
npm ci
```

### 2. Install PocketBase locally

Download the PocketBase binary that matches the version in `apps/pocketbase/.pocketbase-version` from the official PocketBase releases page and place it at:

```text
apps/pocketbase/pocketbase
```

On macOS/Linux, make it executable:

```bash
chmod +x apps/pocketbase/pocketbase
```

### 3. Configure the backend environment

Use `.env.example` as a reference and export the required variables in your shell before starting PocketBase. Do not commit real passwords or encryption keys.

At minimum, set a strong `PB_ENCRYPTION_KEY`. The optional bootstrap variables can create the first PocketBase superuser and the first storefront administrator when migrations run.

### 4. Configure the web app

Copy the frontend example environment file:

```bash
cp apps/web/.env.example apps/web/.env
```

For local development it points to `http://127.0.0.1:8090`.

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

This runs ESLint and the production Vite build.

## Security notes

The repository intentionally excludes `pb_data`, PocketBase backups, local binaries and `.env` files. See [SECURITY.md](SECURITY.md) for additional guidance.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the application boundaries and data flow.

## Roadmap

The next refactor focuses on PocketBase data rules, secure order tracking, tests and deployment. See [ROADMAP.md](ROADMAP.md).

## Author

**Daniel Felipe Olaya Hermosa**
Full-Stack Developer · Product Builder · E-commerce & Digital Growth

---

This repository is published as a portfolio project. No open-source license is granted unless a license file is added explicitly.
