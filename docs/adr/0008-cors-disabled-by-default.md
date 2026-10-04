# ADR-0008: CORS disabled by default with explicit origin allowlist

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

Browsers block cross-origin `fetch` requests unless the server allows them through the `Access-Control-Allow-Origin` header. Two deployment scenarios exist:

- The endpoint lives on the same origin as the website (e.g. a Next.js route inside the portfolio): no CORS headers are needed.
- The endpoint lives on a different origin (e.g. a standalone deployment used by another site): the endpoint must allow that origin.

## Decision

- By default, the handler sends no CORS headers: only same-origin browser requests work.
- The `allowedOrigins` option enables cross-origin access explicitly. When the request's `Origin` header matches the list, the handler echoes it in `Access-Control-Allow-Origin`.
- `Vary: Origin` is always added when CORS is configured, so the CDN does not serve one origin's cached response to another.
- `OPTIONS` preflight requests are handled.
- Documentation states clearly that CORS is not access control: it is enforced only by browsers, and the endpoint's data is public by design.

## Alternatives considered

- **`Access-Control-Allow-Origin: *` by default:** works everywhere without configuration, and the data is public, but it allows any website to embed the endpoint without the owner's intent.
- **No CORS support:** simplest, but makes cross-origin deployments impossible.

## Consequences

- **Positive:**
  - Least-privilege default, consistent with the security model.
  - Cross-origin deployments remain possible with one explicit option.
  - Correct CDN caching per origin thanks to `Vary: Origin`.
- **Negative:**
  - Developers with cross-origin setups must configure `allowedOrigins`; the documentation must cover the resulting browser error clearly.
  - `Vary` handling may differ between CDNs and must be verified per platform (see ADR-0009).
