# HANDOVER — Bliss Term Advisory

Everything a new Claude Code account (or engineer) needs to continue building
this site with zero ramp-up. Read this top to bottom once; it points you at the
rest.

> **Status at handover:** branch `claude/term-site-layout-animation-of179p`,
> HEAD = `aeecf21`. `npm run check` and `npm run build` both pass. Google auth
> is live and gates the whole site — see §7.

---

## 1. What this project is

A **public-facing, screen-share presentation tool** for **term insurance**. An
advisor drives it on a call; the customer watches. Not self-serve. Built with
Next.js (App Router, v16) + TypeScript strict + Tailwind v4. Light mode is the
primary design, per the Ditto brand guidelines; dark mode is a derived
palette.

The authoritative build guide + guardrails is [`CLAUDE.md`](CLAUDE.md). Read it
second (right after this file). The editing guide is [`docs/DOCS.md`](docs/DOCS.md).

---

## 2. Two repos + the one mandatory rule

| Repo | Role |
|---|---|
| **`sakdittoeth/bliss-term-insurance`** (this repo) | **TARGET** — all changes go here. |
| **`sakdittoeth/ditto-health-insurance-bliss`** | **REFERENCE ONLY** — read for layout/animation inspiration, **never modify**. |

**MANDATORY (carry this into the new account):** the health repo exists only to
take reference and inspiration. Any change derived from it is applied to
**bliss-term-insurance**. Never commit to the health repo.

The health design language (shell, tokens, motion) has already been ported into
this repo, so the health repo is a *useful-but-optional* reference from here on.
Its design system lives in that repo's `design.md` and `summary.md`.

---

## 3. Get the code

```bash
git clone <bliss-term-insurance>            # via the new account's GitHub access
cd bliss-term-insurance
git checkout claude/term-site-layout-animation-of179p
git log --oneline -4                        # top commit should be aeecf21
npm install
```

**Always develop on `claude/term-site-layout-animation-of179p`** (keep the same
branch name). Do not push to `main`. Do not open a PR unless explicitly asked.

Commit history so far (newest first):

- `aeecf21` feat: Control + Policy panels on the right rail; reorder flow steps (**Batch 1**)
- `920f63a` chore: archive Google auth for development
- `dac7dcf` feat: rebuild term site shell + motion to mirror the Health Advisor
- `dca3507` feat: scaffold Bliss Term Advisory (original foundation)

---

## 4. Run & verify

```bash
npm run check    # typecheck + lint + validate:content + test  — must stay green
npm run build    # production build                            — must stay green
npm run dev      # local dev server (http://localhost:3000)
```

**Definition of done for any change:** `npm run check` green **and**
`npm run build` succeeds. Nothing ships red.

**Previewing gated pages:** the whole site (`/`, `/flow/*`, `/admin/*`) needs a
signed-in, allowlisted session (§7) — set up `.env.local` from
`.env.local.example` (Google OAuth creds + `AUTH_SECRET` at minimum) to browse
locally.

Chromium is available for screenshot verification if the new environment is a
Claude Code remote session (`/opt/pw-browsers/chromium`). Optional but useful —
drive the app and eyeball changes before committing.

---

## 5. What's already built

**Shell & motion** (commit `dac7dcf`) — mirrors the Health Advisor:
- `app/flow/layout.tsx` — client shell: top bar + collapsible left rail +
  scrollable `<main>` + thin right rail + mobile nav drawer.
- `components/layout/left-sidebar.tsx` — collapsible 240↔60px rail, numbered
  steps, active accent bar, scroll-anchored sub-steps for the active step.
- `components/layout/top-bar.tsx`, `components/layout/page-shell.tsx`.
- Motion (all in `app/globals.css`, all respect `prefers-reduced-motion`):
  bounce-down "Next Step" chevron, sidebar width transition, smooth anchor
  scroll, drawer + panel slide-ins, hover transitions, hero `fade-in-up`.
- Welcome (`app/page.tsx`) + login (`app/login/page.tsx`) redesigned with
  token-driven glows.

**Batch 1** (commit `aeecf21`) — the right-rail band:
- `components/layout/right-sidebar.tsx` — theme toggle + two icons opening
  slide-in overlays (`components/layout/panel-overlay.tsx` is the shared shell):
  - **Control Panel** (`control-panel.tsx`): customer details — name, DOB (age
    auto-derived), annual income, monthly expenses, salaried/self-employed,
    pincode, Indian/NRI residency, PED yes/no + details. Draft form; Save commits.
  - **Policy Panel** (`policy-panel.tsx`): 11 policies grouped across HDFC,
    ICICI, Axis Max, Bajaj; searchable multi-select; Apply commits.
- **Policy selection reflects in Recommendations**: it shows the insurers behind
  the selected policies, intersected with the residency segment.
- **Flow reorder**: Our Recommended Insurers → step 03, Recommended Riders → 04.

---

## 6. Architecture you must respect (from `CLAUDE.md`)

1. **TypeScript strict, no `any`.**
2. **Content is data; components are layout; `lib/` is logic.** Every
   user-facing string/number lives in `content/*.json`, typed in `types/`,
   validated by a zod schema in `schemas/`. No hardcoded content in components.
3. **A content edit must never break the app silently** — add/extend a schema +
   a `validate-content.ts` target for every new content file.
4. **Flow structure lives only in `config/flows.ts`** (order, step ids,
   sub-steps). Labels live in `content/flows.json`.
5. **Business math lives in `lib/calc/` as pure, unit-tested functions**
   (see `cover.ts`, `age.ts`). Never inside a page component.
6. **Server-only data access** via `lib/content.ts` (`import "server-only"`).
   Client-safe data (e.g. policies) via direct JSON import — see `lib/policies.ts`.
7. **Tokens only for colour** — defined in `app/globals.css`, exposed as
   Tailwind utilities (`bg-bg-card`, `text-text-secondary`, `text-accent-blue`,
   `bg-hover-surface`, …). **No hex in components.** Need a decorative
   gradient/glow? Add a token-driven utility in `globals.css` (see
   `bg-glow-accent`, `bg-gradient-avatar`).
8. **Components stay small (~150 lines).** Split when they grow.

---

## 7. Auth is live

Google sign-in gates the whole site (`/`, `/flow/*`, `/admin/*`) — an
allowlist of advisors with roles (`admin` | `member`), plus an
access-request flow for in-domain accounts that aren't yet allowlisted.
**Full details:** [`docs/AUTH.md`](docs/AUTH.md).

---

## 8. Shared state model (where customer + policy data lives)

`context/flow-provider.tsx` (`useFlow()`) is the single source of truth,
session-only (reload resets — deliberate):

- `customer: CustomerInfo` + `setCustomer(patch)` — the Control Panel data.
- `age: number | null` — derived from `customer.dob` via `lib/calc/age.ts`.
- `residency: "resident" | "nri"` — derived from `customer.citizenship`
  (`indian → resident`). Drives Recommendations.
- `selectedPolicies: string[]` + `setSelectedPolicies` — the Policy Panel data.
- Policy data + helpers: `lib/policies.ts` (`POLICIES`, `policiesByInsurer`,
  `insurerIdsForPolicies`). Source: `content/policies.json`.

**These are the "use later" hooks the owner referenced.** Batch 1 captured the
data; future batches consume it.

---

## 9. What's next (the batch plan)

Work **page by page**, in small batches, each ending green (`check` + `build`)
and committed. The owner directs each batch; confirm scope before large moves.

**Pending routes the owner flagged as "open a route, will specify later":**
- A destination that **consumes `customer` info** (name/age/income/expenses/PEDs)
  — likely the **eligibility** and **cover-amount** steps (the cover calc in
  `lib/calc/cover.ts` already takes age + monthly expense).
- **Rider info specific to the insurer**, driven by `selectedPolicies` — the
  **riders** step (now step 04).

**Step components still to build** (routed + framed as placeholders today, see
`app/flow/[stepId]/page.tsx`): `eligibility`, `cover-amount`, `riders`,
`premium-options`, `why-now`, `why-ditto`. Only `recommendations` is fully built.

**Open decisions to confirm with the owner before relying on them:**
- "Expenses" is currently labeled **Monthly Expenses** (feeds the cover calc). If
  the owner meant annual, adjust the label + calc.
- The right-rail band keeps the **theme toggle** as a third icon (alongside
  Control + Policy). Owner may want it reduced to the two panels.

---

## 10. Working agreement (how this project is run)

- **Never commit/push unless asked.** The owner will say when. When you do:
  conventional commits (`feat:`/`fix:`/`chore:`), and **push to
  `claude/term-site-layout-animation-of179p`** with `git push -u origin <branch>`.
- **No PRs unless explicitly requested.**
- **Verify before you commit** — run `npm run check` + `npm run build`, and
  where possible drive the actual UI (screenshots) to confirm behavior.
- **One source of truth for colour + motion** is `globals.css`; for flow
  structure it's `config/flows.ts`; for copy it's `content/`.
- If the new account is asked which model it is and the harness withholds it,
  answer with the configured model id — do **not** put any model id in commits,
  PRs, or code.

---

## 11. Kickoff prompt for the new account

Paste this as your first message in the new account (after connecting the repo,
see §12):

```
You're taking over an in-progress build. Read HANDOVER.md at the repo root
first, then CLAUDE.md — follow both exactly.

Hard rules for this session:
- TARGET repo (all changes): sakdittoeth/bliss-term-insurance.
- REFERENCE-ONLY repo (never modify): sakdittoeth/ditto-health-insurance-bliss —
  read it only for layout/animation inspiration.
- Develop on branch claude/term-site-layout-animation-of179p (create locally
  from origin if needed). Never push to main. Never open a PR unless I ask.
- Never commit or push until I explicitly ask.
- Definition of done: `npm run check` and `npm run build` both green.
- Google auth is live and gates the whole site (see docs/AUTH.md) — don't
  disable or bypass it without being asked.

We build page by page in small batches; I'll direct each batch. Start by
confirming you've read HANDOVER.md + CLAUDE.md and summarizing the current state
and what you think Batch 2 should be. Then wait for my go.
```

---

## 12. Onboarding the new account (mechanics)

**Claude Code on the web (claude.com/code):**
1. Sign in to the new account.
2. Connect GitHub and grant access to **both** repos
   (`sakdittoeth/bliss-term-insurance` target + `…/ditto-health-insurance-bliss`
   reference). The repo owner may need to approve the GitHub App for the org.
3. Start a session on `bliss-term-insurance`, branch
   `claude/term-site-layout-animation-of179p`.
4. Paste the §11 kickoff prompt.

**Claude Code CLI (local):**
1. Ensure the new account's GitHub user has read/write on both repos.
2. `git clone` the target repo, `git checkout` the branch, `npm install`.
3. (Optional) clone the reference repo alongside it for inspiration.
4. Run `claude` in the target repo and paste the §11 kickoff prompt.

**Access checklist for the owner:** grant the new account collaborator access to
both repos (write on the target, read on the reference) so the branch can be
fetched and pushed.

---

_That's the whole handover. The repo is self-describing from here: HANDOVER.md →
CLAUDE.md → docs/DOCS.md → the code._
