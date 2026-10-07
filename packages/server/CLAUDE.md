# @playstate/server

Web-standard HTTP handler that serves the `NowPlaying` model from `core`, with caching, CORS, error mapping and rate-limit protection (`ARCHITECTURE.md` sections 3.2, 7 and 8).

**Runs in:** the server (Node ≥ 22), officially supported on Vercel and Netlify.

No third-party dependencies; the only internal dependency is `@playstate/core`.

Folder structure is added in this package's phase (Phase 3).

## TypeScript

The base config sets `"types": []`. Adding `@types/node` requires `"types": ["node"]` in this package's `tsconfig.json`.

## Known setup gap

`typecheck` resolves `@playstate/core` through its built `dist` (the `types` field of its `package.json`). Once `server` imports from `core` (Phase 3), typechecking `server` needs `core` built first, while `/done` and the planned CI run typecheck before build. Not solved yet: decide in Phase 3 (e.g. TypeScript project references, a source export condition, or building before typechecking).
