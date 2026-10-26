# Bliss Term Advisory

Advisor-led, screen-share walkthrough that guides a customer through buying
**term insurance** with Ditto. Rebuilt on a resilient architecture so it stays
safe to change through many content and feature iterations.

## Why this rebuild exists

The previous term app (Vite SPA) was fragile to change: no type safety, content
coupled to code, 1,400-line pages, and no tests — so a small edit could break a
live advisor call and be slow to fix. This project fixes each of those at the
architectural level. See [docs/DOCS.md](docs/DOCS.md) and
[CLAUDE.md](CLAUDE.md).

## Stack

- **Next.js (App Router) + TypeScript strict** — the compiler is the first
  safety net; a broken content contract fails the build, not a call.
- **Typed, zod-validated content** in `content/*` — bad data is caught in CI.
- **NextAuth Google OAuth** (advisors only, `@joinditto.in`) — server-side
  route gating via `middleware.ts`.
- **Recharts** modular chart library in `components/charts/`.
- **Vitest** unit tests, **GitHub Actions** CI (`npm run check`).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add Google OAuth creds
npm run dev                        # http://localhost:3000
```

## The safety net

```bash
npm run check   # typecheck + lint + validate:content + test
```

CI runs the same on every PR, plus a production build. Nothing merges red.

## Where things live

| Path | What |
|---|---|
| `content/` | Typed JSON — insurers, page copy, flow labels. **Data only, no logic.** |
| `schemas/` | Zod schemas that validate every content file. |
| `config/flows.ts` | The flow's structure — single source of truth. |
| `lib/content.ts` | Server-only content loader (validated, cached). |
| `lib/calc/` | Pure, unit-tested business logic (cover calc, …). |
| `components/charts/` | Reusable visualization components. |
| `components/steps/` | One small component per step. |
