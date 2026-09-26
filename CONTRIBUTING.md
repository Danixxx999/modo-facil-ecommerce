# Contributing

Modo Fácil uses a small, reviewable workflow so changes remain easy to understand and teach.

## Development flow

1. Create a branch from `main`.
2. Keep each change focused on one concern.
3. Run `npm run check` before opening a pull request.
4. Do not commit credentials, production customer data, PocketBase runtime databases or backups.
5. Explain behavior changes in the pull request description.

## Commit style

Use short conventional-style messages when practical:

- `feat:` new behavior
- `fix:` bug fix
- `refactor:` internal code change without changing intended behavior
- `docs:` documentation only
- `test:` tests
- `chore:` tooling or maintenance

Examples:

```text
feat: add tiered pricing summary
fix: prevent duplicate checkout submission
refactor: isolate order messaging service
docs: document PocketBase migration flow
```

## Pull requests

A pull request should answer:

- What problem does this change solve?
- What changed?
- How was it tested?
- Does it affect data, authentication, checkout or customer information?
- Are migration or environment changes required?

## Definition of done

A change is ready when:

- lint passes;
- the production build succeeds;
- no secrets or private data are included;
- new behavior is documented when needed;
- database changes are represented as migrations rather than local runtime data.
