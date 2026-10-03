# ADR-0002: Monorepo with four packages

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

playstate has four distinct responsibilities with different runtimes and consumers:

- Talking to the Spotify API and normalizing its responses (server).
- Exposing that data over HTTP with caching and CORS (server).
- Obtaining a refresh token once, through an OAuth flow (developer's machine).
- Displaying the data in a React UI (browser).

Mixing server code and browser code in the same package makes it easy for secrets or server logic to end up in a client bundle. Consumers also have different needs: someone using Vue only needs the server side; someone with an existing endpoint only needs the UI.

## Decision

Structure the project as a pnpm workspaces monorepo with four independently published packages:

- `@playstate/core`: Spotify client and data normalization.
- `@playstate/server`: HTTP handler.
- `@playstate/cli`: refresh token CLI.
- `@playstate/react`: hook and components.

Packages reference each other with `workspace:*`, which pnpm replaces with real versions on publish. Tasks run with `pnpm -r` (no task orchestrator in v1).

## Alternatives considered

- **Single package with subpath exports** (`playstate/server`, `playstate/react`): one install for everything, but every consumer would get React as a peer dependency even for server-only usage, and the boundary between server and browser code would rely on discipline instead of package boundaries.
- **Separate repositories per package:** maximum isolation, but cross-package changes would require coordinated releases across repositories, and shared tooling would be duplicated.
- **Turborepo or Nx for orchestration:** task caching and dependency-aware pipelines, unnecessary overhead for four packages. Can be added later without restructuring.

## Consequences

- **Positive:**
  - Clear boundaries: each package has one responsibility and one runtime.
  - Consumers install only what they need.
  - Shared tooling (TypeScript config, lint, tests, CI) in one place.
  - Independent versioning per package with Changesets.
- **Negative:**
  - More configuration than a single package (per-package `package.json`, build and exports).
  - Releases must keep inter-package version ranges consistent (handled by Changesets).
