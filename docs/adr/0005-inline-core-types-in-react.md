# ADR-0005: Types from `core` inlined into `react` at build time

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

`@playstate/react` needs the `NowPlaying` types defined in `@playstate/core` to stay consistent with the API contract. However, `core` contains the code that handles the client secret and refresh token. If `react` imported runtime code from `core`, server logic could end up in the browser bundle of every consumer.

A type-only import solves the bundle problem, but the published type declarations of `react` would still reference `@playstate/core`, so consumers would have to install it as a dependency even though no code from it reaches the browser.

## Decision

- In source code, `@playstate/react` may only import from `@playstate/core` using `import type`, which is erased at compile time.
- `@playstate/react` never imports from `@playstate/server`.
- The build of `@playstate/react` inlines the types it uses from `@playstate/core` into its own declaration files (`.d.ts`). `@playstate/core` is therefore only a development dependency of `@playstate/react` inside the monorepo, and consumers do not install it.
- CI enforces the boundary with a check that fails if the build output of `@playstate/react` contains `accounts.spotify.com` or `client_secret`, and validates the published types with `publint` and `@arethetypeswrong/cli`.
- A lint rule flags non-type imports from `@playstate/core` during development.
- Changes to the public data model are released in `core` and `react` together (Changesets linked versions), so both packages always describe the same contract.

The exact build configuration is validated during the `react` phase.

## Alternatives considered

- **Keep `@playstate/core` as a dependency of `react`:** simplest build, but consumers install a package they do not use at runtime.
- **Duplicate the types by hand in `react`:** no dependency, but the contract could drift silently between packages.
- **A separate `types` package:** clean separation, but adds a fifth package for a handful of types. Can be reconsidered if the shared types grow.
- **Rely on code review only:** no automated guarantee; a single mistaken import would go unnoticed.

## Consequences

- **Positive:**
  - Secrets and server logic cannot reach the browser by design, verified automatically.
  - `@playstate/react` has no dependency on `core` for consumers.
  - One source of truth for the data contract in the source code.
- **Negative:**
  - Type declarations exist in two published packages. Projects using both `server` and `react` get two identical copies; TypeScript treats them as compatible because the model uses plain structural types. Introducing classes or unique symbols in the public model would break this and require revisiting this ADR.
  - Releases of `core` and `react` must stay in sync for model changes.
  - The CI check relies on string matching and must be kept up to date if relevant identifiers change.
