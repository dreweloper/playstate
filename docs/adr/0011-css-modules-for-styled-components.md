# ADR-0011: CSS Modules for styled components

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

`@playstate/react` includes a styled component (`NowPlayingCard`) on top of the headless layer. Its styles must:

- Not collide with the consumer's own styles.
- Add no runtime dependencies (ADR-0004) and work in React Server Components frameworks.
- Not force consumers to adopt a specific styling tool (e.g. Tailwind).
- Be themable without overriding internal selectors.

## Decision

- Styles are written with **CSS Modules**, one `.module.css` file per component, with class names following **BEM** (`block__element--modifier`, see `CONVENTIONS.md`). CSS Modules guarantee isolation; BEM makes the structure of each component explicit in its class names and keeps generated names meaningful when inspecting the DOM.
- They are **compiled at build time** into a single stylesheet published as `@playstate/react/styles.css`, which consumers import optionally. Consumers' bundlers do not need CSS Modules support.
- Generated class names follow a **deterministic, prefixed pattern** (`playstate-[local]`), readable when debugging and isolated from the consumer's classes.
- The **public styling API** consists only of CSS custom properties (`--playstate-*`) and `data-*` attributes. Class names are an implementation detail and may change between versions.

The exact build configuration is validated during the `react` phase.

## Alternatives considered

- **BEM with plain global CSS (without CSS Modules):** no build step, but isolation depends on discipline and collisions with consumer classes remain possible.
- **CSS-in-JS (styled-components, Emotion):** co-located styles, but adds a runtime dependency and has limitations with React Server Components.
- **Zero-runtime CSS-in-JS (vanilla-extract):** typed and isolated, but adds build complexity and a tool consumers may need to understand to contribute.
- **Tailwind CSS:** fast to write, but would require consumers to configure Tailwind or ship a large precompiled stylesheet.
- **Hashed class names:** stronger isolation, but harder to debug, with no real benefit since classes are not part of the public API either way.

## Consequences

- **Positive:**
  - Local scoping while writing styles, no collisions with consumer styles.
  - No runtime cost; compatible with React Server Components.
  - Consumers only import a CSS file, with no tooling requirements.
  - A small, explicit theming API (custom properties and data attributes) that can stay stable while internals change.
- **Negative:**
  - BEM and CSS Modules partially overlap (both prevent collisions), which makes class names longer than strictly necessary.
  - The build must handle CSS Modules compilation and emit the stylesheet, which adds configuration to the `react` package.
  - Consumers who need deeper customization than custom properties allow should use the headless components instead.
