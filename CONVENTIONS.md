# playstate — Conventions

> How we work in this repository. Applies to humans and to Claude Code alike.
> Architecture lives in `ARCHITECTURE.md`; decisions and their reasons live in `docs/adr/`.

## 1. Language

Everything in the repository is written in English: code, comments, commits, branches, issues, pull requests and documentation.

## 2. Git workflow

**Strategy:** GitHub Flow (trunk-based). `main` is the only long-lived branch.

- `main` is always releasable and protected: changes only arrive through pull requests with passing CI.
- Every issue is developed in a short-lived branch created from `main` and merged back into `main`.
- Releases are not branches: each published version is a git tag created on `main` (section 9).
- Maintenance branches (`release/1.x`) are created only if a previous major version ever needs fixes after a newer major is released.
- **One issue, one branch, one pull request.** Work outside the issue's scope becomes a new issue.
- **Branch names:** `<type>/<issue-number>-<short-description>`, e.g. `feat/12-token-refresh`, `fix/31-empty-response`.
- **Merge strategy:** squash merge. The pull request title becomes the commit on `main`, so it must follow Conventional Commits.
- Pull requests reference their issue with `Closes #<number>`.

## 3. Commits

[Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`

**Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build`, `perf`.

**Scopes:** `core`, `server`, `cli`, `react`, `repo` (workspace-wide), `deps`.

```
feat(core): return offline status when nothing is playing
fix(server): add Vary header when CORS is enabled
docs(repo): add ADR-0011 for UI component list
```

- Description in imperative mood, lowercase, no final period.
- Breaking changes use `!` after the scope (`feat(core)!: …`) and explain the change in the body.

## 4. Issues

Every issue includes:

- **Context:** why it is needed.
- **Acceptance criteria:** verifiable conditions that define "done".
- **Out of scope:** what this issue deliberately does not cover.

These sections are required before work on an issue starts. Bug reports are opened without them and receive them during triage.

- **On GitHub's web interface,** issues are opened through the issue forms in `.github/ISSUE_TEMPLATE/`, which enforce these sections and apply the type label.
- **With `gh issue create`,** which ignores issue forms, the issue body must include the same sections and the type label must be added explicitly (`--label`).

**Labels**

- Type: `feature`, `bug`, `docs`, `chore`.
- Package: `pkg:core`, `pkg:server`, `pkg:cli`, `pkg:react`.
- Other: `good first issue`, `v2` (accepted idea outside the v1 scope).

Each issue belongs to the milestone of its phase (`ROADMAP.md`).

## 5. Code style

- TypeScript in strict mode. No `any`: use `unknown` and narrow it.
- Named exports only; no default exports.
- Explicit return types on exported functions.
- **File and folder names:**
  - React component files use `PascalCase`, matching the component they export, together with their tests and styles: `NowPlayingCard.tsx`, `NowPlayingCard.test.tsx`, `NowPlayingCard.module.css`.
  - All other source files and all folders use `camelCase`: `tokenCache.ts`, `tokenCache.test.ts`, `nowPlayingCard/`.
  - Exceptions: conventional root files (`README.md`, `LICENSE`, `CHANGELOG.md`), files whose name is imposed by a tool (`package.json`, `tsconfig.json`, `vitest.config.ts`…) and numbered ADRs.
- **Folder structure** inside each package is defined when the package is scaffolded and documented in that package's `CLAUDE.md`.
- Errors are typed classes extending a common `PlaystateError`. `core` never returns `null` to represent a state: it returns the `NowPlaying` model.
- Comments explain why, not what.
- Formatting is owned by Prettier and enforced in CI; lint warnings are treated as errors.

## 6. Styles

Applies to the styled components of `@playstate/react` (ADR-0011).

- **CSS Modules**, one stylesheet per component, next to it: `NowPlayingCard.tsx` → `NowPlayingCard.module.css`.
- **Class names follow BEM**, with each part in `kebab-case`:
  - **Block:** the component, one block per stylesheet: `.now-playing-card`.
  - **Element:** `block__element`, one level only (no `block__element__child`): `.now-playing-card__cover-image`.
  - **Modifier:** `block--modifier` or `block__element--modifier`, for visual variants: `.now-playing-card--compact`.
  - Runtime **states** (playing, paused…) are not modifiers: they are styled through `data-*` attributes, e.g. `.now-playing-card[data-status="playing"]`.
  - In TypeScript, class names are accessed with bracket notation: `styles['now-playing-card__cover-image']`. Whether the build can also expose camelCase aliases is evaluated during the `react` phase.
- **Property order:** grouped from the outside in, enforced by Stylelint with `stylelint-config-recess-order`:
  1. Positioning (`position`, `inset`, `z-index`…)
  2. Display and layout (`display`, `flex`, `grid`, `gap`…)
  3. Box model (`width`, `height`, `margin`, `padding`…)
  4. Typography (`font`, `line-height`, `color`, `text-align`…)
  5. Visual (`background`, `border`, `border-radius`, `box-shadow`, `opacity`…)
  6. Animation and miscellaneous (`transition`, `animation`, `cursor`…)
- **Public styling API:** only CSS custom properties (prefixed `--playstate-`, e.g. `--playstate-accent`) and `data-*` attributes (e.g. `[data-status="playing"]`). Generated class names are not part of the public API.
- No `!important`.
- Animations respect `prefers-reduced-motion`.
- Stylelint runs in CI; warnings are treated as errors.

## 7. Testing

- **Runner:** Vitest. Test files live next to the code they test: `tokenCache.ts` → `tokenCache.test.ts`.
- **HTTP:** mocked with MSW. Never call real APIs in automated tests.
- **Time:** controlled with Vitest fake timers (token expiry, polling, `Retry-After`).
- **Test names describe behavior:** `returns offline when Spotify responds 204`, not `test getNowPlaying`.
- **Tests first** for logic with clear inputs and outputs (`core`, `server`, the hook): write the failing test, then the implementation.
- **Every bug fix includes a regression test** that fails without the fix.

**Coverage**

- Minimum threshold: **90% of lines and branches in every package**, enforced in CI.
- Excluded from coverage: executable entry points (CLI `bin`), files that only re-export, Storybook stories and type-only files.
- 100% is welcome when it comes naturally, but coverage is a signal, not a goal: it measures which code runs during tests, not whether the tests check the right things. Tests written only to raise the number are not accepted.

## 8. Documentation

| When…                                       | Update…                                    |
| ------------------------------------------- | ------------------------------------------ |
| The system's structure or behavior changes  | `ARCHITECTURE.md`                          |
| A significant decision is made or reversed  | A new ADR                                  |
| The public API changes                      | Package README and JSDoc                   |
| A phase's status changes                    | `ROADMAP.md`                               |
| An idea is accepted but outside v1          | `ideas-v2.md`                              |
| The Definition of Done (section 11) changes | `.github/pull_request_template.md` as well |

**ADR process**

- New ADRs start from `docs/adr/template.md`, numbered sequentially.
- An ADR is proposed in the same pull request as the change it justifies (`Status: Proposed`) and becomes `Accepted` when merged.
- Accepted ADRs are never edited. To change a decision, write a new ADR and mark the old one as `Superseded by ADR-XXXX`.

## 9. Versioning and releases

- [Semantic Versioning](https://semver.org/). While in `0.x`, breaking changes bump the minor version.
- Every pull request that changes a published package includes a changeset (`pnpm changeset`).
- `@playstate/core` and `@playstate/react` are linked in Changesets (ADR-0005).
- Releases are published only from CI, with npm provenance. Never publish from a local machine.

**Release flow**

1. Pull requests merged into `main` accumulate changesets. Merging does not publish anything.
2. The Changesets GitHub Action keeps a "Version Packages" pull request open on `main`, with the pending version bumps and changelog entries.
3. Merging that pull request is the release decision: CI publishes the new versions to npm and creates the git tags (e.g. `@playstate/core@0.1.0`).
4. Pre-releases (e.g. `1.0.0-beta.0`) use Changesets pre-release mode and are published under the `next` dist-tag, so `npm install` keeps resolving to the latest stable version.

## 10. Dependencies

- Runtime dependencies follow ADR-0004: none in library packages; a minimal, documented set in the CLI.
- New development dependencies are justified in the pull request description.
- Dependency updates are automated (Renovate or Dependabot) and reviewed like any other change.

## 11. Definition of Done

A task is done when:

- [ ] All acceptance criteria of the issue are met.
- [ ] Lint (code and styles), typecheck, tests and build pass, and coverage is at or above the threshold.
- [ ] Documentation is updated according to section 8.
- [ ] An ADR is written if a significant decision was made.
- [ ] A changeset is included if a published package changed.
- [ ] Work outside the scope was turned into new issues, not added to this one.
- [ ] The pull request has been reviewed and CI is green.

## 12. License

[MIT](./LICENSE).
