# @playstate/cli

One-time OAuth flow that obtains the Spotify refresh token the developer needs to configure `server` (`ARCHITECTURE.md` section 3.3).

**Runs in:** the developer's machine (Node ≥ 22), through `npx`.

Folder structure is added in this package's phase (Phase 2).

## TypeScript

The base config sets `"types": []`. Adding `@types/node` requires `"types": ["node"]` in this package's `tsconfig.json`.
