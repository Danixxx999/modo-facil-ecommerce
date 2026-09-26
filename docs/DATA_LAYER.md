# Data-layer strategy

## Current version: PocketBase

Modo Fácil v1 uses PocketBase as its application backend and persistence layer.

This is deliberate. PocketBase gives the project:

- a visible and understandable data model;
- authentication;
- file and record APIs;
- migrations stored with the code;
- a lightweight local development experience;
- a backend that is practical for classroom demonstrations.

Runtime database files are not source code and are never committed. The reproducible source of truth is the migration history under `apps/pocketbase/pb_migrations`.

## Current boundaries

The web application should access data through hooks, services and adapters instead of scattering database-specific calls throughout UI components.

That boundary matters because it makes the persistence technology replaceable later.

## Security rules

Public catalog data and administrative/customer data must be treated differently.

- Product/catalog content may be public where appropriate.
- Administrative writes require authenticated admin access.
- Orders and customer information must not be exposed through unrestricted list/read rules.
- Public order tracking should return a deliberately small response and verify more than a guessable order number.
- Secrets belong in environment variables, never migrations or frontend source.

## Why PostgreSQL is not being added immediately

PostgreSQL is an excellent production database, but changing databases without a product requirement would create migration risk without automatically improving the application.

For this repository, the stronger engineering story is:

1. stabilize the current product;
2. define clear service/domain boundaries;
3. add tests around business rules;
4. harden authorization and tracking;
5. introduce PostgreSQL when the backend requires transactions, richer reporting, integrations or independent scaling.

## Proposed v2 architecture

```text
React / Vite
     |
     v
Application API
(Node.js / TypeScript)
     |
     v
Domain + service layer
     |
     v
PostgreSQL
```

A v2 migration should be incremental. The frontend API contract should remain stable while the persistence implementation changes behind it.

## Suggested relational entities for v2

- users / admins
- customers
- categories
- products
- product_price_tiers
- combos
- combo_items
- orders
- order_items
- payments
- store_settings
- testimonials
- faq_entries

Foreign keys, unique constraints and transactional checkout behavior should be defined explicitly when the PostgreSQL phase begins.
