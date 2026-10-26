# CLAUDE.md — Bliss Term Advisory

Build guide + guardrails for anyone (human or agent) working on this repo. These
rules exist to keep the app **safe to change repeatedly**. Follow them exactly.

## What this is

A public-facing, screen-share presentation tool. An advisor drives it on a call;
the customer watches. Not self-serve. Term-insurance line.

## Non-negotiable architecture rules

1. **TypeScript strict, no `any`.** The compiler is the primary regression net.
2. **Content is data; components are layout; `lib/` is logic. Never mix them.**
   - Every user-facing string/number lives in `content/*.json`, typed in
     `types/` and validated by a schema in `schemas/`.
   - No content values hardcoded in components. No duplicate lookup maps.
   - Business math lives in `lib/calc/` as pure functions with unit tests —
     never inside a page component.
3. **A content edit must never break the app silently.** Every collection has a
   zod schema; `npm run validate:content` and CI reject malformed data with a
   named error.
4. **Flow structure lives only in `config/flows.ts`.** Sidebar, routing, and
   Back/Continue all read from it. Adding/reordering a step is one edit there.
5. **Server-only data access.** `lib/content.ts` is `import "server-only"`;
   confidential content never enters the client bundle. Auth is gated in
   `proxy.ts` (Next 16's middleware successor), before protected content is sent.
6. **Every step page is a small component** in `components/steps/`. If one
   exceeds ~150 lines, extract logic to `lib/` or split it.
7. **Charts are reusable primitives** in `components/charts/`, theme-aware,
   token-driven. Add a chart type once; reuse it everywhere.
8. **Tokens only for colour.** Defined in `app/globals.css`. No hex in
   components. Light mode is primary, per the Ditto brand guidelines
   (Alabaster/White Ice neutrals, Woodsmoke ink, Azure Radiance/Dodger
   Blue/Science Blue accents, Inter typeface); dark mode is a derived
   palette built from the same brand colours.

## Definition of done for any change

`npm run check` is green (typecheck + lint + validate:content + test) **and**
`npm run build` succeeds. A change that a live advisor call could hit ships only
when the pipeline is green.

## Deferred (future phases, not built yet)

- Remaining step content components (cover-amount, riders, premium-options,
  why-now, why-ditto). Routing + shell already exist for them.
- Lead-session / conversion analytics + role hierarchy. Dropped with Supabase
  by design; if reintroduced it needs a datastore decision. Keep the seam
  clean — do not smear it across components.

## Git

- Never commit or push unless explicitly asked.
- Conventional commit messages (`feat:`, `fix:`, `chore:`).
