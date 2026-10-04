# ADR-0006: CDN caching strategy

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

Every visitor's browser polls the endpoint. Without caching, traffic multiplies Spotify calls: 500 concurrent visitors polling every 10 seconds would mean around 3,000 calls per minute, risking Spotify's rate limits and increasing function invocations.

Hosting platforms place a CDN in front of serverless functions, which can serve cached responses without invoking the function.

## Decision

Successful responses use:

```
Cache-Control: public, s-maxage=10, stale-while-revalidate=30
```

- `s-maxage=10`: the CDN may serve the cached response for 10 seconds. It applies only to shared caches; browsers ignore it.
- `stale-while-revalidate=30`: after expiry, the CDN may serve the previous response for up to 30 more seconds while it fetches a fresh one in the background.

Values are configurable through the handler's `cache` option. Error responses are not cached, except rate-limit responses (see ARCHITECTURE.md, section 7). The client polling interval defaults to 15 seconds, since polling faster than the CDN cache adds no freshness.

## Alternatives considered

- **No caching:** freshest possible data, but Spotify calls grow linearly with traffic.
- **Server-side cache in memory or in a store (Redis, KV):** works regardless of CDN, but adds infrastructure or a dependency, and in-memory caches are per-instance in serverless.
- **Browser caching (`max-age`):** reduces requests per visitor but not the total across visitors, and would show stale data after the song changes.

## Consequences

- **Positive:**
  - Spotify calls are bounded (about 6 per minute per deployment) regardless of traffic.
  - Fewer function invocations, lower cost.
  - Uses standard HTTP; no infrastructure to maintain.
- **Negative:**
  - Data can be up to about 10 seconds old (more while revalidating).
  - Behavior depends on each platform's CDN and must be verified per platform (see ADR-0009).
  - Local development servers may not emulate the CDN cache.
