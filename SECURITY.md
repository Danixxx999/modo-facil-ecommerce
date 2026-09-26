# Security

## Reporting a vulnerability

Please avoid opening a public issue for vulnerabilities that could expose customer or administrator data. Contact the repository owner privately with reproduction steps and impact.

## Repository safety notes

- PocketBase runtime data (`apps/pocketbase/pb_data/`) is intentionally excluded from version control.
- Local environment files are ignored. Commit only the provided `.env.example` templates.
- Administrator credentials are read from environment variables; no production password should be hard-coded in migrations or source code.
- Rotate any credential that was ever shared outside a trusted environment.
