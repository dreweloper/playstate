# playstate — Security Model

> Internal threat model: what we protect, from what, and how. The public, user-facing summary will live in `SECURITY.md` (Phase 5).
> Related: `ARCHITECTURE.md` (section 9), ADR-0004, ADR-0005, ADR-0008.

## 1. Assets

| Asset | Where it lives | Sensitivity |
|---|---|---|
| Spotify client secret | Developer's deployment environment variables | High |
| Spotify refresh token | Developer's deployment environment variables | High |
| Spotify access token | Memory of the serverless instance (≤ 1 hour) | Medium (short-lived) |
| Listening activity | Endpoint responses, CDN cache, browsers | Public by design |
| npm publishing rights | `@playstate` npm organization, CI | High |
| Repository and CI | GitHub `dreweloper/playstate` | High |

## 2. Trust boundaries

1. **Developer's machine:** the CLI runs here once and handles the client secret and the authorization code.
2. **Developer's deployment (Vercel / Netlify):** `server` and `core` hold the credentials and talk to Spotify.
3. **Spotify:** trusted for authentication; its data is treated as untrusted input when rendered.
4. **CDN:** caches public responses; must never mix responses between origins.
5. **Browser:** runs `react`; must never receive credentials or server logic.
6. **Supply chain:** npm registry, GitHub Actions and dependencies, from which consumers receive our code.

**Key principle:** the author operates no service. Each developer runs their own deployment with their own Spotify app, so the author never has access to anyone's credentials or data.

## 3. Threats and mitigations

### 3.1 Credentials reaching the browser

**Threat:** server code or secrets end up in a consumer's client bundle.

**Mitigations**

- `react` only imports types from `core`, inlined at build time, and never imports from `server` (ADR-0005).
- CI fails if the `react` build output contains `accounts.spotify.com` or `client_secret`.
- A lint rule flags non-type imports during development.

### 3.2 Credentials committed to a repository

**Threat:** a developer commits their `.env` file with the refresh token or client secret.

**Mitigations**

- The CLI writes credentials to `.env.local` and warns when the file is not git-ignored.
- Examples ship with a `.gitignore` that excludes `.env*` files.
- Documentation recommends GitHub secret scanning with push protection.
- In this repository: secret scanning with push protection enabled, and Claude Code denied access to `.env*` files.

### 3.3 Refresh token compromise

**Threat:** an attacker obtains a developer's refresh token (and client secret).

**Mitigations**

- **Minimal scopes:** only `user-read-currently-playing` and `user-read-recently-played`. A stolen token cannot control playback, read private playlists, or access email or account details. The worst-case impact is reading the owner's listening activity, which is already public through the endpoint.
- Documented response procedure (section 5).

### 3.4 Excessive data exposure

**Threat:** the endpoint exposes more personal information than intended.

**Mitigations**

- `core` returns only the normalized `NowPlaying` model. User ID, device name and type, playback context and market data are discarded (`ARCHITECTURE.md` section 5).
- Error responses never include secrets, tokens or raw upstream bodies.
- Tokens and secrets are never logged.

### 3.5 OAuth flow attacks in the CLI

**Threat:** CSRF or interception during the authorization flow.

**Mitigations**

- A random `state` parameter is generated and validated on the callback.
- The local server listens only on the loopback interface (`127.0.0.1`) and shuts down after completing the flow or after a timeout.
- The authorization code is single-use, short-lived and useless without the client secret.

### 3.6 Endpoint abuse and quota exhaustion

**Threat:** excessive traffic (accidental or malicious) increases function invocations or exhausts the Spotify rate limit.

**Mitigations**

- CDN caching bounds upstream calls regardless of traffic (ADR-0006).
- On Spotify `429`, the server blocks upstream calls until `Retry-After` and serves a cacheable `503` (`ARCHITECTURE.md` section 7).
- Hosting platforms provide their own baseline protection against volumetric attacks.

### 3.7 Cross-origin use and cache mix-ups

**Threat:** other websites consume the endpoint without the owner's intent, or the CDN serves a response prepared for one origin to another.

**Mitigations**

- CORS disabled by default; cross-origin access requires an explicit `allowedOrigins` list (ADR-0008).
- `Vary: Origin` whenever CORS is configured.
- Documentation states that CORS is enforced only by browsers and is not access control: the data is public by design.

### 3.8 Injection through Spotify data

**Threat:** malicious content in track titles, artist names or URLs leads to XSS when rendered.

**Mitigations**

- Text is rendered through React, which escapes it. `dangerouslySetInnerHTML` is never used.
- Links and images are only rendered when their URL uses the `https` scheme, preventing `javascript:` and similar URLs.

### 3.9 Supply chain compromise

**Threat:** a malicious dependency, a compromised maintainer account or a tampered build distributes harmful code to consumers.

**Mitigations**

- Zero runtime dependencies in library packages; a minimal, documented set in the CLI (ADR-0004).
- Lockfile committed; dependency updates automated and reviewed.
- Packages published only from CI, with npm provenance, so consumers can verify each version was built from this repository.
- 2FA on npm and GitHub; branch protection on `main`.
- GitHub Actions with least-privilege permissions; third-party actions pinned to commit SHAs.

## 4. Out of scope and residual risks

- **Listening activity is public by design.** Showing it is the purpose of the project; owners decide whether to deploy it.
- **Security of the developer's hosting account and environment variables** is the developer's responsibility.
- **Spotify's own platform and API policies**, including development mode restrictions.
- **CORS does not prevent non-browser clients** from reading the endpoint, which is acceptable because the data is public.

## 5. Response procedures

**If a refresh token or client secret leaks:**

1. Revoke the app's access from the Spotify account's apps page.
2. Rotate the client secret in the Spotify developer dashboard.
3. Run the CLI again to obtain a new refresh token.
4. Update the deployment's environment variables and redeploy.

**If a vulnerability is found in playstate:** report it privately through GitHub's private vulnerability reporting, as described in `SECURITY.md`. Fixes are released as patch versions with a security advisory.

## 6. Automated verification

| Check | Protects against | Where |
|---|---|---|
| Bundle boundary check on `react` output | 3.1 | CI |
| Lint rule on imports from `core` | 3.1 | Local and CI |
| Secret scanning with push protection | 3.2 | GitHub |
| Tests for `state` validation and loopback binding | 3.5 | CI |
| Tests for data minimization and error bodies | 3.4 | CI |
| Tests for `Vary: Origin` and CORS defaults | 3.7 | CI |
| Tests for URL scheme validation | 3.8 | CI |
| Runtime dependency check on library packages | 3.9 | CI |
| `publint`, `@arethetypeswrong/cli`, npm provenance | 3.9 | CI |
