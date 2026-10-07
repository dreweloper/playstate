# ADR-0012: No third-party runtime dependencies

- **Status:** Accepted
- **Date:** 2026-10-07

## Context

ADR-0004 established that library packages have no runtime dependencies. Its rationale still holds: every runtime dependency of a library is imposed on every consumer, increasing install and bundle size, risking version conflicts and expanding the supply-chain attack surface, which is especially relevant for a package that handles OAuth credentials. The CLI is different: it runs once, through `npx`, and is never bundled into an application.

Read literally, however, ADR-0004 contradicts the architecture: `@playstate/server` depends on `@playstate/core` at runtime (ARCHITECTURE.md section 4, ADR-0002). As a consequence, the planned CI check on runtime dependencies would fail on `server`, and the public "zero-dependency" claim would be inaccurate, since npm lists `@playstate/core` as a dependency of `@playstate/server`. The intent was always to avoid third-party dependencies, which an internal package does not introduce.

ADR-0004 also states that any new CLI runtime dependency "requires updating this ADR", which is incompatible with accepted ADRs being immutable.

## Decision

- **Library packages** (`@playstate/core`, `@playstate/server`, `@playstate/react`) have no third-party runtime dependencies.
- **Internal dependencies** follow the graph in ARCHITECTURE.md section 4. The only internal runtime dependency is `@playstate/server` → `@playstate/core` (`workspace:*`). `@playstate/react` has no runtime dependencies: React is a peer dependency, and `core` is used only through `import type`, with its types inlined at build time. This ADR does not alter ADR-0005.
- The planned CI dependency check enforces exactly this graph, not "any `@playstate/*` package".
- **`@playstate/cli`** may use runtime dependencies that meet this criterion: small, well-established, substantially improving the CLI's developer experience, and justified in the pull request description. The initial v1 list is:
  - `@clack/prompts`: interactive prompts.
  - `open`: opens the browser across operating systems.
- The current CLI list lives in `CONVENTIONS.md` section 10. Adding a dependency that meets the criterion means adding it to that list in the same pull request, with its justification; it does not require an ADR. Changing the criterion requires a new ADR that supersedes this one. This replaces the "requires updating this ADR" rule of ADR-0004.
- Tooling (build, tests, lint, Storybook) is limited to `devDependencies`, which do not affect consumers.

The public "no third-party dependencies" claim refers to the library packages and their runtime dependencies.

## Alternatives considered

- **Bundle `core` into `server`:** keeps "zero dependencies" literally true, but duplicates `core` for anyone who also installs it, and makes every `core` fix depend on a `server` release.
- **Merge `core` into `server`:** contradicts ADR-0002 and the package split that keeps server code out of `react`.
- **Treat `server` → `core` as an implicit exception, without an ADR:** silently contradicts an accepted ADR.
- **Allow any dependency between `@playstate/*` packages:** would let `react` depend on `core` at runtime, against ADR-0005.
- **A new ADR for each new CLI dependency:** a heavy process for a routine choice that a stable criterion already governs.
- **Keep the CLI list inside the ADR:** accepted ADRs cannot be edited, so every addition would require superseding the ADR.

## Consequences

- **Positive:**
  - An accurate and verifiable public claim.
  - A precise rule for the CI dependency check.
  - A lightweight process for CLI dependencies, governed by a stable criterion.
- **Negative:**
  - Consumers of `server` still install `core`, and their versions must stay compatible (handled by Changesets).
  - The CLI list depends on review discipline in `CONVENTIONS.md` rather than on an ADR.
