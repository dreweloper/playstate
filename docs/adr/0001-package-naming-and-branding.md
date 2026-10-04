# ADR-0001: Package naming and Spotify branding

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The project needs a public name before any code is written. The name appears in the repository, the npm packages, import paths in documentation and examples, the CLI command, Storybook and the README. npm does not allow renaming published packages, so changing the name after publishing would require deprecating the old packages, publishing new ones and breaking existing links.

Spotify's design and branding guidelines for third-party apps state that a name must not imply endorsement by Spotify (describing it as "for Spotify" is acceptable) and must not begin with "Spot" or be similar to "Spotify" in sound or spelling.

The project consists of four packages (`core`, `server`, `cli`, `react`), each of which needs its own name on npm.

## Decision

- **Product name:** `playstate`.
- **npm:** the organization `@playstate` hosts all packages: `@playstate/core`, `@playstate/server`, `@playstate/react` and `@playstate/cli` (executed as `npx @playstate/cli`).
- **Repository:** `github.com/dreweloper/playstate`, under the author's personal GitHub profile.
- **Tagline:** "playstate — Now Playing widget for Spotify".
- "Spotify" appears only in descriptive text (tagline, descriptions, documentation), never in package or repository names.

## Alternatives considered

- **`currentlyplaying`:** highly descriptive and searchable, but it is a description rather than a name, hard to find and to build an identity around, long to type in scoped imports, and it mirrors the Spotify API endpoint name (`currently-playing`), which could suggest an official package.
- **Personal npm scope (`@dreweloper/playstate-*`):** works without creating an organization, but repeats the product name as a prefix in every package and ties the product's identity to a personal account, making future collaboration harder.
- **Names containing "Spotify" or similar to it:** not allowed by Spotify's branding guidelines.
- **More evocative names (`needledrop`, `earworm`, `bside`):** memorable, but less descriptive of what the toolkit does.

## Consequences

- **Positive:**
  - Short, clean imports (`@playstate/react`) that follow the convention of multi-package libraries.
  - The name describes the product and matches its core concept: the `NowPlaying` model is a playback state (`playing`, `paused`, `recent`, `offline`).
  - Authorship remains visible: the author appears as maintainer on npm and the repository lives on the author's GitHub profile.
  - Compliant with Spotify's naming guidelines.
- **Negative:**
  - The npm organization must be maintained and secured (2FA required for publishing).
  - Compliance with Spotify's attribution guidelines in the UI (logo, link texts) is a separate concern, to be addressed during UI design.
