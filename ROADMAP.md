# Roadmap

This repository preserves the current product while making the next refactor explicit.

## Priority 0 — data and security

- Replace direct public order lookup with a dedicated server-side tracking endpoint that validates both the order identifier and a second customer factor (for example, phone number or a signed tracking token).
- Add a reproducible demo-data seed for products, categories, combos, FAQ and testimonials without using production/customer data.
- Review PocketBase collection rules field by field and document which data is public, admin-only or customer-facing.
- Remove legacy shipping-fee fields from the schema after all deployed data has been migrated to free shipping.
- Define backup and restore procedures for PocketBase before production deployment.

## Priority 1 — maintainability

- Add unit tests for tiered pricing, cart totals and checkout payloads.
- Add integration tests for order creation and admin authentication.
- Consolidate legacy/duplicate admin pages that are no longer routed.
- Split large page components into smaller feature modules.
- Add typed domain models for products, orders, customers and store settings.

## Priority 2 — deployment and observability

- Add a production deployment profile (Docker or platform-specific configuration).
- Add structured error logging without exposing customer data.
- Add health checks and migration checks to deployment.
- Add image optimization/storage strategy for product media.

## Future data-layer evolution

PocketBase is intentionally retained for the current stable version because it keeps the project self-contained and easy to teach. A future v2 may move the persistence layer to PostgreSQL behind an explicit backend API. That migration should be driven by requirements—transactional workflows, reporting, integrations, scale and deployment needs—not by technology branding alone.
