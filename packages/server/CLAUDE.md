# @playstate/server

Web-standard HTTP handler that serves the `NowPlaying` model from `core`, with caching, CORS, error mapping and rate-limit protection (`ARCHITECTURE.md` sections 3.2, 7 and 8).

**Runs in:** the server (Node ≥ 22), officially supported on Vercel and Netlify.

No third-party dependencies; the only internal dependency is `@playstate/core`.

Folder structure is added in this package's phase (Phase 3).
