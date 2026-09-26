# Roadmap

Modo Fácil keeps the current product stable while the engineering work moves in explicit phases.

## Completed foundation

- Public repository created and cleaned for portfolio use.
- PocketBase runtime data, backups, binaries and local secrets excluded from Git.
- Hard-coded bootstrap credentials replaced with environment variables.
- Full PocketBase migration history restored so a new environment can reproduce the schema.
- Shipping normalized to **free shipping** across the current application flow.
- GitHub Actions CI added for linting and production builds.
- Architecture, data-layer, security, contribution and teaching documentation added.

## Priority 0 — security and data integrity

- Replace direct public order lookup with a dedicated server-side tracking endpoint that validates both the order identifier and a second customer factor (for example, phone number or a signed tracking token).
- Add a reproducible demo-data seed for products, categories, combos, FAQ and testimonials without using production/customer data.
- Review PocketBase collection rules field by field and document which data is public, admin-only or customer-facing.
- Remove the legacy shipping-fee schema field after deployed environments have been migrated safely.
- Define backup and restore procedures before a production deployment.

## Priority 1 — maintainability and tests

- Add unit tests for tiered pricing, cart totals and checkout payloads.
- Add integration tests for order creation and admin authentication.
- Consolidate compatibility/legacy admin pages that are no longer routed.
- Split large page components into smaller feature modules.
- Add typed domain models for products, orders, customers and store settings.

## Priority 2 — deployment and observability

- Add a production deployment profile (Docker or platform-specific configuration).
- Add structured error logging without exposing customer data.
- Add health checks and migration checks to deployment.
- Add an image optimization/storage strategy for product media.

## Future data-layer evolution

PocketBase is intentionally retained for v1 because it keeps the project self-contained and easy to teach.

A future v2 may move persistence to PostgreSQL behind a dedicated backend API. That migration should be driven by requirements—transactional workflows, richer reporting, integrations, scale and deployment needs—not by technology branding alone.

The target sequence is:

1. stabilize and test the current business rules;
2. harden authorization and order tracking;
3. define a backend API contract;
4. move persistence behind that API;
5. migrate to PostgreSQL when the requirements justify it.
