# playstate — Ideas for v2

> Ideas accepted as valuable but deliberately left out of the v1 scope.
> Nothing here is planned or prioritized yet: ideas are reviewed after the first release (`ROADMAP.md`, Phase 6).

**How ideas get here:** any idea outside the v1 scope that comes up during development is added to this file (and, if it has an issue, labeled `v2`), with its origin and the reason it was deferred. Ideas are not implemented in v1, even if they seem small.

**How ideas leave:** when v2 is planned, each idea is either turned into issues (with an ADR if it changes a decision), or discarded with a short note explaining why.

## Data and API

### Bring-your-own-data in `react`

A `fetchNowPlaying` callback as an alternative to `endpoint`, so consumers can supply data from any source (their own backend, a static file, a test fixture).

- **Origin:** first version of the project.
- **Deferred because:** v1 focuses on the endpoint flow; the hook's API should be validated in real use before adding a second data source.

### Static JSON mode

A serverless-free option where a scheduled GitHub Actions workflow writes the `NowPlaying` data to a static JSON file that the widget reads.

- **Origin:** first version of the project.
- **Deferred because:** it changes the freshness model (minutes instead of seconds) and needs its own staleness handling (see next idea).

### Staleness signaling

Notify consumers when data is older than expected (e.g. a `STALE_DATA` error or a `stale` flag), mainly relevant for the static JSON mode.

- **Origin:** first version of the project.
- **Deferred because:** with a real-time endpoint and CDN caching, data age is bounded and small.

### Runtime validation of Spotify responses

Validate Spotify responses at runtime (e.g. with Valibot) instead of relying on hand-written types only.

- **Deferred because:** adds a runtime dependency (ADR-0012); hand-written types and tests cover v1.

### Injectable `fetch` in `core`

Allow passing a custom `fetch` implementation (proxies, logging, retries).

- **Origin:** architecture review.
- **Deferred because:** not needed for testing (MSW intercepts global `fetch`) and no demand yet.

### Separate types package

Extract shared types into `@playstate/types` if the shared contract grows.

- **Origin:** ADR-0005.
- **Deferred because:** a handful of types does not justify a fifth package.

## Platforms

### Cloudflare Workers support

Official support, example and docs for Cloudflare Workers.

- **Origin:** ADR-0009.
- **Deferred because:** Workers do not cache responses at the CDN automatically; it requires platform-specific code using the Cache API.

### Adapter for Node-style frameworks

A thin adapter to use the handler with Express and similar frameworks.

- **Origin:** ADR-0003.
- **Deferred because:** v1 targets platforms that support web-standard handlers natively.

## UI

### Packages for other frameworks

`@playstate/vue`, `@playstate/svelte` or a framework-agnostic web component.

- **Origin:** architecture discussion (package naming by framework).
- **Deferred because:** v1 targets React; non-React users can consume the endpoint's JSON directly.

### Integration with data-fetching libraries

Let the hook work with an external fetcher (TanStack Query, SWR) for consumers who already use one.

- **Origin:** ADR-0007.
- **Deferred because:** adds API surface before there is demand.

## Tooling

### Task orchestration

Turborepo or Nx for cached, dependency-aware tasks in the monorepo.

- **Origin:** ADR-0002.
- **Deferred because:** unnecessary overhead for four packages.

### Migrate to TypeScript 7

Move the workspace from TypeScript 6.0 to TypeScript 7 (the native compiler).

- **Origin:** issue #5.
- **Deferred because:** typescript-eslint declares `typescript <6.1.0` as peer and TS 7 support in the toolchain is not confirmed.
- **Revisit when:** typescript-eslint's peer includes TS 7 and tsdown with `dts` generates correct declarations, validated with publint and @arethetypeswrong/cli on the `react` build (ADR-0005).
