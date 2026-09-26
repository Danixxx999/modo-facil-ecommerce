# Teaching guide

Modo Fácil can be used as a practical classroom project because students can follow a complete commerce flow without needing a large enterprise stack.

## Learning objectives

Students can use the repository to study:

- component-based frontend architecture;
- routing and protected routes;
- state management for a shopping cart;
- reusable hooks and service modules;
- form validation;
- CRUD operations;
- authentication and authorization boundaries;
- database migrations;
- checkout business rules;
- Git branches, commits and pull requests;
- CI with linting and production builds;
- secure handling of environment variables.

## Suggested learning path

### Module 1 — Read the product

Ask students to identify:

- the public pages;
- the admin pages;
- the cart state;
- where product data enters the UI;
- where the checkout flow begins and ends.

### Module 2 — Trace one feature

A useful exercise is to follow a product from:

```text
PocketBase collection
→ data hook/service
→ product component
→ cart
→ checkout
→ order record
→ WhatsApp confirmation
```

The goal is to understand data flow, not merely copy code.

### Module 3 — Business rules

Have students locate and test rules such as:

- tiered pricing;
- quantity changes;
- subtotal calculation;
- free shipping;
- payment-method selection;
- order status handling.

### Module 4 — Security review

Students should discuss why the repository does not include:

- `.env` files;
- real passwords;
- `pb_data`;
- customer databases;
- backups.

Then compare public catalog permissions with order/customer permissions.

### Module 5 — Refactoring exercise

Choose one large page or repeated admin flow and ask students to:

1. identify responsibilities;
2. extract smaller components;
3. preserve behavior;
4. run `npm run check`;
5. submit the change in a pull request.

## Instructor note

The repository intentionally keeps PocketBase in v1 because the backend remains visible enough to teach migrations, authentication and data access.

A later PostgreSQL/API version can be used as a second-stage exercise to compare rapid application backends with a conventional service + relational database architecture.
