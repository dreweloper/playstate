# CLAUDE.md

## Project

**playstate** — a toolkit to show what a developer is listening to on Spotify on their own website. pnpm monorepo with four packages published under `@playstate`: `core` (Spotify client), `server` (HTTP handler), `cli` (refresh token setup) and `react` (hook and components).

It is both an open source library and the author's portfolio project: code quality, documentation and process matter as much as features.

@ARCHITECTURE.md
@CONVENTIONS.md

Read when relevant:

- `ROADMAP.md`: current phase and its exit criteria. Do not work ahead of the current phase.
- `docs/adr/`: the reasons behind each decision. Check before proposing changes to anything an ADR covers.
- `SECURITY-MODEL.md`: before touching credentials, OAuth, CORS, caching, rendering of Spotify data or CI.
- `ideas-v2.md`: where out-of-scope ideas go.
- `packages/*/CLAUDE.md`: package-specific rules and folder structure.

## Language

- Talk to me in **Spanish**.
- Everything written to the repository is in **English**: code, comments, commits, branches, issues, pull requests and documentation.

## Commands

```bash
pnpm install
pnpm build          # all packages
pnpm test           # all packages, with coverage
pnpm lint           # ESLint + Stylelint
pnpm typecheck
pnpm changeset      # add a changeset for published packages

pnpm --filter @playstate/core test   # a single package
```

## Non-negotiable rules

- `react` never imports runtime code from `core` or `server`: only `import type` from `core` (ADR-0005).
- No runtime dependencies in `core`, `server` or `react`. The CLI only uses the dependencies listed in ADR-0004.
- `core` always returns the `NowPlaying` model, never `null` (ARCHITECTURE section 5).
- HTTP in tests is mocked with MSW. Never call real APIs in automated tests.
- Never read, print or modify `.env*` files. Never log tokens or secrets.
- Accepted ADRs are never edited. Changing a decision means proposing a new ADR.

## Workflow

Each task follows this cycle:

1. **Start from an issue.** Read it, including its acceptance criteria and out-of-scope section. Work on a branch named after it, never on `main`.
2. **Plan first.** Propose a plan and wait for approval before changing files. Mention alternatives you discarded and why.
3. **Tests first** for logic with clear inputs and outputs: write the failing test, run it, confirm it fails, then implement.
4. **Small steps.** Keep each change reviewable.
5. **Verify.** Run lint, typecheck, tests and build before declaring a task done.
6. **Stay in scope.** If you find a problem or idea outside the issue, report it and propose a new issue (or an entry in `ideas-v2.md`). Do not fix it in the current branch.
7. **Close** with the Definition of Done (CONVENTIONS section 11): docs updated, ADR if a decision was made, changeset if a published package changed.

## Never

- Lower coverage thresholds, disable lint rules or skip tests to make CI pass.
- Add dependencies (runtime or dev) without asking first.
- Publish packages or push to `main`.
- Use `any`, default exports or `dangerouslySetInnerHTML`.
- Silently contradict the documentation. If a request conflicts with `ARCHITECTURE.md`, `CONVENTIONS.md` or an ADR, say so before proceeding.

## When in doubt

Ask. A short question is always better than an assumption that has to be undone.
