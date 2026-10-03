# ADR-0007: Custom polling instead of TanStack Query/SWR

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

`@playstate/react` needs to poll the endpoint periodically and handle loading and error states. Data-fetching libraries such as TanStack Query and SWR solve this well in applications, but in a library they become requirements for every consumer.

## Decision

Implement polling inside `useNowPlaying` without external libraries:

- Chained `setTimeout` instead of `setInterval`, so a new request is scheduled only after the previous one finishes and requests never overlap.
- `AbortController` to cancel in-flight requests on unmount, avoiding state updates on unmounted components and race conditions.
- Polling paused while the tab is hidden (`document.visibilityState`), with an immediate refetch when it becomes visible.
- `Retry-After` support: after a `503` with this header, the next poll waits the indicated time.
- Default interval: 15 seconds (see ADR-0006).

## Alternatives considered

- **TanStack Query:** robust caching, retries and devtools, but forces consumers to install it and set up a `QueryClientProvider`, and conflicts with ADR-0004.
- **SWR:** lighter, but still a runtime dependency for consumers.
- **Optional integration (accept an external fetcher):** flexible, but adds API surface before there is demand. Can be reconsidered in v2.

## Consequences

- **Positive:**
  - No extra dependencies or providers for consumers.
  - Polling behavior tailored to this use case.
- **Negative:**
  - We must implement and test edge cases (aborts, visibility changes, retries) ourselves, using fake timers.
  - No shared cache with the consumer's data-fetching library, if they use one.
