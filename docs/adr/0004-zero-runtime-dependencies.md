# ADR-0004: Zero runtime dependencies

- **Status:** Superseded by ADR-0012
- **Date:** 2026-10-02

## Context

Every runtime dependency of a library becomes a dependency of every consumer: it increases install size and bundle size, can cause version conflicts, and expands the supply-chain attack surface. For a package that handles OAuth credentials, the security argument is especially relevant.

The functionality the library packages need (HTTP requests, JSON handling, polling, React context) is covered by platform APIs and React itself.

The CLI is different: it runs once, on the developer's machine, through `npx`, and is never bundled into an application. Its main goal is to remove friction from the OAuth setup, so the quality of its interactive experience matters.

## Decision

- **Library packages** (`@playstate/core`, `@playstate/server`, `@playstate/react`) have no runtime dependencies. The only exception is React, declared as a peer dependency of `@playstate/react`.
- **`@playstate/cli`** may use a minimal set of small, well-established runtime dependencies when they substantially improve the developer experience. In v1:
  - `@clack/prompts`: interactive prompts.
  - `open`: opens the browser across operating systems.
- Any new runtime dependency in the CLI requires updating this ADR.
- Tooling (build, tests, lint, Storybook) is limited to `devDependencies`, which do not affect consumers.

The public claim "0 dependencies" refers to the library packages.

## Alternatives considered

- **Use established libraries in the library packages (axios, TanStack Query, Zod):** less code to write, but each one is imposed on consumers and adds supply-chain risk.
- **Bundle dependencies into the build:** hides them from the dependency tree but not from the bundle size, and makes security updates depend on our releases.
- **No dependencies in the CLI either (`node:readline` only):** allows "0 dependencies" in all four packages, but produces a noticeably rougher setup experience, which is precisely what the CLI exists to improve.
- **Optional dependencies in the CLI (dynamic import with a `node:readline` fallback):** would require maintaining and testing two code paths for the same flow. npm's `optionalDependencies` only tolerates installation failures; it does not make installing them optional for users. The complexity is not justified for a tool run once.

## Consequences

- **Positive:**
  - Small install and bundle size for library consumers, no version conflicts.
  - Minimal supply-chain attack surface in everything that reaches an application.
  - A clear and verifiable claim for the README.
  - A polished setup experience in the CLI.
- **Negative:**
  - We implement and maintain logic that libraries would provide (polling, retries, response validation).
  - The CLI's dependencies must be kept up to date and are part of its supply chain.
  - Requires discipline: new dependencies need an explicit justification.
