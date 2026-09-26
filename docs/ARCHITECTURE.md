# Architecture

Modo Fácil is organized as a small monorepo with two applications.

```text
apps/
├── web/          React + Vite storefront and admin interface
└── pocketbase/   PocketBase schema migrations and backend runtime
```

## Web application

The React application contains the public storefront, product and category views, cart, checkout, order-tracking UI, authentication context and protected admin routes. Data access is encapsulated in hooks and application adapters under `apps/web/src`, while PocketBase is configured through a single client module.

## Data layer

PocketBase stores products, categories, combos, orders, customers, testimonials, FAQ content and store settings. Collection definitions live in `apps/pocketbase/pb_migrations`. Runtime database files are deliberately not committed.

## Commerce flow

1. Customers browse products and combos.
2. Cart state is persisted locally in the browser.
3. Checkout creates an order in PocketBase.
4. The app builds a WhatsApp confirmation message for the store.
5. Administrators manage catalog, orders, customers, reports and store settings from protected routes.

## Security boundaries

Public catalog collections are readable by storefront visitors. Administrative mutations require authentication against the `admins` collection. Orders contain customer information and should remain non-public; a public tracking API must expose only the minimum fields required and validate more than a guessable order number.

## Why PocketBase remains in v1

For this version, PocketBase provides a compact backend, authentication and migrations without hiding the data model. That makes the project practical for demonstrations and teaching while preserving a real full-stack boundary.

For a future production-oriented v2, the persistence layer can evolve to PostgreSQL behind a dedicated backend service. The frontend should depend on domain/service interfaces rather than database-specific calls so that migration can happen incrementally.
