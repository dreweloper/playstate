# ADR-0010: Namespace exports for headless components

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

`@playstate/react` offers headless compound components (a root that provides state through context, and child components that read from it). There are two common ways to expose them:

- Attaching children as static properties of the root component (`<NowPlaying>` with `NowPlaying.Cover`).
- Exporting each part individually (`Root`, `Cover`, `Title`…) and letting consumers group them with a namespace import.

The package is a client component library and must work in React Server Components frameworks such as the Next.js App Router. Accessing properties of a client component from a server component is problematic, because what the server component imports is a client reference, not the actual component.

## Decision

Export each headless part individually and document the namespace import as the recommended usage, following the Radix pattern:

```tsx
import * as NowPlaying from '@playstate/react';

<NowPlaying.Root endpoint="/api/now-playing">
  <NowPlaying.Cover />
  <NowPlaying.Title />
</NowPlaying.Root>
```

## Alternatives considered

- **Static properties on the root component (`<NowPlaying>` + `NowPlaying.Cover`):** concise, but problematic with React Server Components and harder to tree-shake.
- **Prefixed named exports only (`NowPlayingRoot`, `NowPlayingCover`):** works everywhere, but verbose and loses the visual grouping of compound components.

## Consequences

- **Positive:**
  - Compatible with React Server Components frameworks.
  - Tree-shakeable: unused parts are not bundled.
  - Keeps the readable `NowPlaying.X` syntax.
- **Negative:**
  - Consumers must use the namespace import to get that syntax; the documentation must make this the obvious path.
  - The root is named `Root` rather than `NowPlaying`, which is slightly less intuitive at first glance.
