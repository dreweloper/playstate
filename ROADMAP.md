# playstate — Roadmap

> High-level plan for v1. Each phase maps to a GitHub milestone; detailed tasks live in issues.
> A phase starts only when the previous one meets its exit criteria.

**Status legend:** ⬜ Not started · 🟡 In progress · ✅ Done

| Phase | Goal | Status |
|---|---|---|
| 0 | Foundation | 🟡 |
| 1 | `@playstate/core` | ⬜ |
| 2 | `@playstate/cli` | ⬜ |
| 3 | `@playstate/server` | ⬜ |
| 4 | `@playstate/react` | ⬜ |
| 5 | First public release (`0.1.0`) | ⬜ |
| 6 | Launch | ⬜ |

**Versioning note:** "v1" is the scope described in `ARCHITECTURE.md`. Packages are first published as `0.1.0` (Phase 5), signaling that the API may still change. `1.0.0` is released once the API has been validated in real use (see "After the first release").

---

## Phase 0 — Foundation 🟡

**Goal:** a repository where every later phase can follow the same workflow, with documentation, tooling, CI and Claude Code configuration in place before any feature code.

**Deliverables**

- Design documents: `ARCHITECTURE.md`, ADRs 0001–0012, `ROADMAP.md`, `CONVENTIONS.md`, `SECURITY-MODEL.md`, `ideas-v2.md`.
- npm organization `@playstate` (with 2FA) and repository `dreweloper/playstate`.
- pnpm workspace with the four packages scaffolded (empty entry points).
- Shared tooling: TypeScript (strict) base config, tsdown, Vitest, ESLint + Prettier.
- Changesets configured, with `core` and `react` as linked packages (ADR-0005).
- GitHub Actions CI: lint, typecheck, test, build, `publint`, `@arethetypeswrong/cli`, with least-privilege workflow permissions and third-party actions pinned to commit SHAs.
- GitHub security settings: branch ruleset on `main` with no bypass, secret scanning with push protection, private vulnerability reporting, 2FA.
- GitHub setup: milestones per phase, project board, issue and PR templates, labels.
- License file (MIT).
- Claude Code setup: `CLAUDE.md` (root and per package), custom commands (`/start-task`, `/adr`, `/done`), subagents (`code-reviewer`, `security-reviewer`, `docs-writer`) and `settings.json` (with `.env*` files denied).

**Exit criteria**

- [x] Design documents for architecture and decisions written (`ARCHITECTURE.md`, ADRs).
- [x] npm organization created and secured with 2FA.
- [x] Remaining design documents written.
- [x] Repository created; first commit contains only documentation.
- [ ] `pnpm build`, `pnpm test`, `pnpm lint` and `pnpm typecheck` pass locally and in CI on the empty packages.
- [ ] Milestones, board and templates ready; Phase 1 issues created.
- [x] One full task cycle completed with Claude Code (`/start-task` → `/done` → merged PR): #15.

---

## Phase 1 — `@playstate/core` ⬜

**Goal:** a typed, tested Spotify client that turns any Spotify response into the `NowPlaying` model.

**Deliverables**

- `createSpotifyClient(config)` with `getNowPlaying()`.
- Access token refresh with in-memory caching (60-second safety margin).
- State resolution and normalization, including every case in `ARCHITECTURE.md` section 6.
- Error model: `ConfigError`, `AuthError`, `RateLimitError`, `SpotifyApiError`.
- Unit tests with MSW for every response case and error.
- Package README with API reference.

**Exit criteria**

- [ ] Every case in `ARCHITECTURE.md` sections 6 and 7 has a test.
- [ ] Coverage at or above the minimum threshold (see `CONVENTIONS.md`).
- [ ] No runtime dependencies (`package.json` verified in CI).
- [ ] Public API documented.

---

## Phase 2 — `@playstate/cli` ⬜

**Goal:** obtaining a Spotify refresh token takes one command.

**Deliverables**

- Spotify developer app for the project (author's account), with the loopback redirect URI registered.
- OAuth Authorization Code flow on `http://127.0.0.1:8888/callback` with minimal scopes and `state` validation.
- Optional `.env.local` writing with a warning when the file is not git-ignored.
- Clean shutdown of the local server, clear error messages.
- Tests for URL building, `state` validation, token exchange (MSW) and `.env.local` handling.

**Exit criteria**

- [ ] A real refresh token is obtained by running the CLI locally.
- [ ] That token works with `@playstate/core` against the real Spotify API (manual check script).
- [ ] Coverage at or above the minimum threshold.
- [ ] CLI dependencies limited to those listed in `CONVENTIONS.md` section 10.

---

## Phase 3 — `@playstate/server` ⬜

**Goal:** a deployable endpoint that serves the `NowPlaying` model with caching, CORS and rate-limit protection on Vercel and Netlify.

**Deliverables**

- `createNowPlayingHandler(config)` with cache headers and `cache` overrides.
- CORS: disabled by default, `allowedOrigins`, `Vary: Origin`, `OPTIONS` handling.
- Error mapping to HTTP responses and rate-limit blocking (`ARCHITECTURE.md` section 7).
- Handler tests with `new Request(...)` for every scenario.
- Examples: Next.js on Vercel (with "Deploy to Vercel" button) and Netlify Functions.
- The author's own endpoint deployed with real data.

**Exit criteria**

- [ ] Coverage at or above the minimum threshold.
- [ ] Author's endpoint live on Vercel, returning real data.
- [ ] Netlify example deployed.
- [ ] CDN caching verified on both platforms (cache status headers show hits), including `Vary: Origin` behavior.
- [ ] "Deploy to Vercel" button works from a clean account.

---

## Phase 4 — `@playstate/react` ⬜

**Goal:** a React package that offers three levels of abstraction (hook, headless components, styled card) and works in React Server Components frameworks.

**Deliverables**

- **UI design first:** final component list, decision on progress display, compliance with Spotify's attribution guidelines (logo, link texts). Recorded in an ADR if it changes the architecture.
- `useNowPlaying`: chained polling, `AbortController`, visibility handling, `Retry-After` support.
- Headless components with namespace exports (ADR-0010) and `data-*` state attributes.
- `NowPlayingCard` with CSS Modules compiled into an optional stylesheet, themable through `--playstate-*` custom properties (ADR-0011).
- Stylelint configured for style conventions (`CONVENTIONS.md`).
- Build with `"use client"` and inlined `core` types (ADR-0005).
- Tests with React Testing Library, MSW and fake timers.
- Storybook: one story per status, accessibility addon.

**Exit criteria**

- [ ] UI design approved and documented.
- [ ] Coverage at or above the minimum threshold.
- [ ] Widget works in the Next.js example (App Router) against the real endpoint.
- [ ] Bundle boundary check active in CI and passing (ADR-0005).
- [ ] `core` is not required as a dependency by consumers (verified with `@arethetypeswrong/cli` and a test install).
- [ ] No accessibility violations reported in Storybook.

---

## Phase 5 — First public release (`0.1.0`) ⬜

**Goal:** a developer who has never seen the project can set it up by following the documentation alone.

**Deliverables**

- Root README: demo, badges, quickstart, "why not a snippet" section, links to Storybook and examples.
- Package READMEs, `SECURITY.md`, `CONTRIBUTING.md`.
- Published Storybook.
- Release workflow publishing to npm from CI with provenance.
- A few `good first issue` issues for potential contributors.

**Exit criteria**

- [ ] Packages published as `0.1.0` with npm provenance.
- [ ] Quickstart completed from scratch by following the README literally, in under 10 minutes.
- [ ] All public documentation consistent with the published API.

---

## Phase 6 — Launch ⬜

**Goal:** the project is visible and tells the story of how it was built.

**Deliverables**

- playstate integrated into the author's portfolio.
- Technical article about one or two key decisions.
- Posts on LinkedIn and relevant developer communities.
- Feedback collected and turned into issues.

**Exit criteria**

- [ ] Widget live on the portfolio.
- [ ] Article published.
- [ ] Feedback triaged into the backlog (v1 fixes or `ideas-v2.md`).

---

## After the first release

- **`1.0.0`:** released when the API has been used in real projects without breaking changes needed.
- **v2:** ideas collected in `ideas-v2.md`, prioritized after launch.