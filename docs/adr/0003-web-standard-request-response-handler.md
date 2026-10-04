# ADR-0003: Web-standard `Request`/`Response` handler

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

Developers deploy the endpoint on different platforms, each with its own function signature conventions. Writing and maintaining a separate implementation per platform would multiply code and tests.

Modern platforms and runtimes have converged on the web-standard Fetch API: a function that receives a `Request` and returns a `Response`.

## Decision

`@playstate/server` exposes a factory that returns a web-standard handler:

```ts
createNowPlayingHandler(config): (req: Request) => Promise<Response>
```

The handler uses only standard APIs (`Request`, `Response`, `Headers`, `fetch`). Platforms that use this signature (such as Next.js Route Handlers and Netlify Functions v2) consume it directly. Runtimes with a different signature (such as Express) would need a thin adapter, not provided in v1.

## Alternatives considered

- **Node-style handler (`req, res`):** familiar from Express, but incompatible with edge runtimes and modern function platforms without adapters.
- **One implementation per platform:** best per-platform ergonomics, but duplicated logic and a larger maintenance and testing surface.
- **A framework such as Hono:** provides adapters for many platforms, but adds a runtime dependency (conflicts with ADR-0004) for a single route.

## Consequences

- **Positive:**
  - One implementation for all supported platforms, usually in a single line of user code.
  - Easy to test: handlers are called directly with `new Request(...)`, without starting a server.
  - Portable to other standard runtimes in the future.
- **Negative:**
  - Node-style frameworks require an adapter.
  - Platform-specific features (e.g. custom cache headers) must be handled through standard headers or configuration.
