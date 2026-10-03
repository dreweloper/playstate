# ADR-0009: v1 deployment targets: Vercel and Netlify

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The handler is web-standard (ADR-0003) and could run on many platforms, but the caching strategy (ADR-0006) and CORS behavior (ADR-0008) depend on each platform's CDN. Supporting a platform properly means documenting it, providing an example and verifying its caching behavior.

Vercel and Netlify both run web-standard functions behind a CDN that honors standard `Cache-Control` directives such as `s-maxage` and `stale-while-revalidate`. Cloudflare Workers does not automatically cache Worker responses at the CDN; it requires using its Cache API.

## Decision

v1 officially supports two deployment targets:

- **Vercel**, through Next.js Route Handlers, with a "Deploy to Vercel" button.
- **Netlify**, through Netlify Functions.

Each target has a documented example and verified caching behavior. Other runtimes may work but are not officially supported in v1. Cloudflare Workers support is deferred to v2 (`ideas-v2.md`).

## Alternatives considered

- **Also support Cloudflare Workers in v1:** wider reach, but requires platform-specific caching code and extra testing, delaying the first release.
- **Support only Vercel:** less work, but ties the project to a single provider and weakens the portability argument of ADR-0003.

## Consequences

- **Positive:**
  - A focused, well-tested scope for the first release.
  - Two providers demonstrate that the web-standard handler is portable.
- **Negative:**
  - Cloudflare users must wait for v2 or adapt the caching themselves.
  - Platform-specific caching details (e.g. Netlify's own `Netlify-CDN-Cache-Control` header) must be verified during the `server` phase.
