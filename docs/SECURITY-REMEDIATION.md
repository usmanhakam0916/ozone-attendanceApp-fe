# Security Remediation — Ozone Attendance Frontend

**Repository:** `ozone-attendanceApp-fe`
**Branch:** `chore/dependency-security-remediation` (16 commits, branched from `dev` @ `ec878a4`)
**Date:** 2026-09-23
**Scope:** dependency vulnerabilities, build reproducibility, Node runtime. Application logic
unchanged except where noted in §6.

---

## 1. Why this work happened

The *Ozone Security Remediation* review (16 Sep 2026, AWS account 811329405116) audited six
production servers and nine applications. This repository is the one row the report could not
assess:

> **Attendance** — "Dependency scan could not complete on this server. Needs a follow-up scan
> before it can be cleared — the totals above therefore understate the estate slightly."

So the review carries **no findings for this repo**. Everything below comes from auditing the
actual codebase, not from that report.

---

## 2. Before and after

Measured with `npm audit` on Node 16.20.2 (the version required at the time) for *before*, and on
Node 24.19.0 for *after*. Both figures reproduced from a clean `npm ci`.

### Full dependency tree

| Severity | Before | After | Change |
|---|---|---|---|
| **Critical** | 15 | **0** | −15 |
| **High** | 46 | **0** | −46 |
| **Moderate** | 100 | **0** | −100 |
| **Low** | 12 | **0** | −12 |
| **Total** | **173** | **0** | **−173** |

### Production tree (`npm audit --omit=dev`)

| Severity | Before | After | Change |
|---|---|---|---|
| Critical | 0 | **0** | — |
| High | 8 | **0** | −8 |
| Moderate | 60 | **0** | −60 |
| Low | 5 | **0** | −5 |
| **Total** | **73** | **0** | **−73** |

### Package count

| | Before | After |
|---|---|---|
| Installed packages | 2,583 | 1,580 |
| `dependencies` | 28 | 22 |
| `devDependencies` | 33 | 23 |

**Before — the 15 criticals:** `@babel/traverse`, `@umijs/block-sdk`, `@umijs/mem-fs-editor`,
`ejs`, `form-data`, `gh-pages`, `git-up`, `git-url-parse`, `immer`, `parse-url`, `pngjs-image`,
`preceptor-core`, `request`, `tar`, `underscore`.

**Before — the 8 production highs:** `@ant-design/pro-layout`, `isomorphic-fetch`,
`js-export-excel`, `node-fetch`, `path-to-regexp`, `postcss`, `umi-request`, `xlsx`.

---

## 3. A note on why `--omit=dev` was misleading here

The production-only scan reported **0 criticals** while a critical was in fact shipping to every
user's browser.

`immer@7.0.15` (critical, prototype pollution) reaches the browser via
`src/.umi/plugin-dva/dva.ts` → `dva-immer` → `produce()`, which wraps **every dva reducer**.
`config/config.js` sets `dva.immer: true`. npm labels it `dev` only because its path to the root
runs through the devDependency `@umijs/preset-react`. The same applies to `@babel/runtime@7.18.6`:
`@umijs/babel-preset-umi/lib/index.js` sets `absoluteRuntime` to its own directory, so the
*vulnerable nested copy* is what gets emitted into the bundle, not the patched root copy.

Conversely, roughly 55 of the 73 "production" findings (`postcss` ×38, `esbuild`, `autoprefixer`,
`@umijs/bundler-webpack`) were **build-time only** — they run once on a build machine and never
reach a browser.

**Lesson for future reporting:** neither the total nor `--omit=dev` describes real exposure on this
stack. Report both, plus a hand-verified browser-reachable set.

---

## 4. What was changed

Sixteen commits, each independently revertible. No application logic was altered.

| # | Commit | Change | Effect |
|---|---|---|---|
| 1 | `49bb16f` | Commit `package-lock.json`; stop ignoring lockfiles; ignore `.env` | reproducible builds |
| 2 | `4933043` | Remove `@ant-design/pro-cli`, `@umijs/plugin-blocks`, `gh-pages` | critical 15 → 1 |
| 3 | `df6d642` | Remove 8 never-imported runtime deps | removed `xlsx`, the only no-fix high |
| 4 | `28d6854` | `express` + `compression` → `dependencies` | fixed a broken prod install |
| 5 | `369924f` | Override `immer` 7.0.15 → 9.0.21 | **browser-shipped critical** |
| 6 | `af43457` | Override `@babel/runtime` 7.18.6 → 7.26.10 | browser-shipped moderate |
| 7 | `01c3164` | Remove dead dev tooling (`mockjs`, `carlo`, `puppeteer-core`, `@umijs/yorkie`) | all 7 no-fix advisories |
| 8 | `df67e1a` | Override `isomorphic-fetch` → 3.0.0, `braces`, `micromatch` | 13 highs |
| 9 | `4df09c2` | Override `path-to-regexp` 2.4.0 → 3.3.0 under `pro-layout` | 4 highs, no major upgrade |
| 10 | `8c5b931` | Override `@tootallnate/once`, `uuid`, `@babel/core` | 3 root causes |
| 11 | `0b665a5` | Pin Node engine, add `prebuild` guard | build failed silently on wrong Node |
| 12 | `3508097` | Node 16 (EOL) → Node 24 LTS | removed unpatched runtime |
| 13 | `2b7b4e9` | Drop `@umijs/plugin-esbuild`, override `esbuild` | 16 findings |
| 14 | `c89c637` | Migrate CSS pipeline to postcss 8 | 44 findings, **last high** |
| 15 | `fdda1bc` | Override `query-string` → 4.3.4 | removed `decode-uri-component` (11) |
| 16 | `cb98409` | Stop polyfilling Node `crypto` | last 8 (`elliptic` chain) |

### Approach: overrides, not upgrades

`umi` stays on **3.5.43**. Nothing was fixed by moving a direct dependency to a new major. Every
transitive fix is a scoped `overrides` entry in `package.json`, so the framework, `antd`, `dva` and
the app's own code are untouched.

### ⚠️ Never run `npm audit fix --force` on this repo

npm's proposed "fix" for four direct dependencies is a **downgrade**:

| Package | Installed | npm's "fix" |
|---|---|---|
| `umi-request` | 1.4.0 | 1.2.3 ↓ |
| `@umijs/preset-react` | 1.8.32 | 1.3.12 ↓ |
| `@ant-design/pro-cli` | 3.3.0 | 2.1.5 ↓ |
| `@umijs/plugin-esbuild` | 1.1.3 | 1.0.3 ↓ |

It would break the build and silently roll back the HTTP client the whole app depends on.

### Two entries that need explanation

**`crypto-browserify` → `file:./stubs/crypto-browserify`.** `elliptic`'s advisory affects **every
published version** (range `*`); 6.6.1 is the newest and is still affected, and
`browserify-sign@4.2.6` / `crypto-browserify@3.12.1` (both latest) still require it. There is no
fix to upgrade to. webpack 4 injects a Node `crypto` polyfill into every build regardless of use;
this app imports **no Node builtins at all**, so it is dead weight. The stub is deliberately
visible, documents itself, and **throws** if anything ever imports `crypto`, so a regression fails
loudly. Revert instructions are in `stubs/crypto-browserify/index.js`.
*Trade-off:* if this app ever needs browser crypto, drop the override and those 8 advisories return.

**`query-string` → `^4.3.4`.** `decode-uri-component` could not be upgraded (its only fix, 0.5.0,
is ESM-only and `query-string` loads it via `require`), but it could be removed: v4.3.4 does not
depend on it at all. v4.3.4 was already in the tree via `normalize-url`, so this deduplicates.

---

## 5. Node runtime

| | Before | After |
|---|---|---|
| `.nvmrc` | `16` | `24` |
| `engines.node` | `>=14.0.0` | `>=18.0.0` |
| Build on Node 24 | **failed** (`ERR_OSSL_EVP_UNSUPPORTED`) | passes |

Node 16 left support in September 2023 and receives no security patches, so the build was pinned to
an unpatched runtime. umi 3 / webpack 4 fails on Node 17+ because of md4 hashing against modern
OpenSSL; that is solved with `NODE_OPTIONS=--openssl-legacy-provider`, applied via `cross-env` on
the seven webpack-driven scripts (`build`, `analyze`, `start:*`). `umi g tmp` and `umi test` do not
use webpack and need no flag.

Verified by building the **same directory** with Node 16.20.2 and Node 24.19.0: emitted `dist/` was
**bit-identical across all 107 files**.

A `prebuild` guard now fails with a clear message on Node < 18 instead of the raw OpenSSL stack.

---

## 6. Issues identified

### 6.1 Fixed

| Issue | Where | Notes |
|---|---|---|
| No lockfile ever committed | `.gitignore` | `package-lock.json` *and* `yarn.lock` were ignored and never tracked; builds were not reproducible and no fix could be guaranteed to persist |
| `.env` files not ignored | `.gitignore` | none were tracked, but nothing prevented it |
| Broken production install | `package.json` | `express`/`compression` were devDependencies; `npm ci --omit=dev` produced a tree that could not serve the app |
| Build failed on modern Node | `package.json` | no guard; failed with an opaque OpenSSL error |
| End-of-life Node runtime | `.nvmrc` | Node 16, unpatched since Sept 2023 |
| Dead `querystring` import | `src/utils/utils.js` | `getPageQuery` had no callers; only Node-builtin import in the app |
| Unrunnable test suite | `jest.config.js` | `testEnvironment` forced Puppeteer **globally**, so even the one pure unit test needed headless Chrome. `puppeteer` and `jest-environment-node` were never declared. Now `npm test` passes |
| Dead Puppeteer e2e harness | `tests/`, `src/e2e/` | asserted only that a `<footer>` existed, seeded `localStorage['antd-pro-authority']` — a key this app does not use for auth — so every protected route redirected to login and the assertion passed vacuously |
| Broken `deploy` script | `package.json` | called `npm run site`, which does not exist |

### 6.2 🔴 Identified, NOT fixed — out of scope by decision

**Malicious code was committed to this repository.**

| | |
|---|---|
| File | `jest.config.js` |
| Introduced | `b55d281` "removed departments from time sheet" — 2025-12-30 |
| Removed | `ec878a4` "Update jest.config.js" — 2026-09-16 |
| Exposure | ~8.5 months on `dev`; **still present in git history** |

An obfuscated blob was appended to `jest.config.js`, hidden behind ~150 spaces on the closing `};`
so it was invisible in an editor and in a GitHub diff. The file went from 240 bytes to **20,852
bytes** with a single **20,614-character line** and CRLF endings. Readable fragments stash Node's
`require` and `module` into `global` under obfuscated keys — a loader/backdoor shape.
`jest.config.js` is `require`d by Node whenever tests run.

Scope was verified and is narrow: a pickaxe search across all branches returns exactly those two
commits; no other file in `b55d281` carries the marker; all branch HEADs and the working tree are
clean; a scan of every tracked file for anomalous long lines returns only images and SVGs. The same
commit rewrote 91 files with near-equal insert/delete counts — a whole-repo CRLF rewrite consistent
with a tool on the developer's machine walking the project. It also added `config.bat` to
`.gitignore`.

Most likely a compromised developer workstation rather than a malicious insider. **The payload was
not executed or decoded.**

Outstanding: the blob remains retrievable from `origin/dev` history, and anything present in this
repo or on that workstation during the window should be treated as exposed — including §6.3.

### 6.3 🟠 Identified, NOT fixed — application security

These are real findings outside the dependency scope of this branch.

| Severity | Issue | Location |
|---|---|---|
| 🟠 | **Post-logout token leakage.** `umi-request`'s `Core.requestInterceptors` is a *static array on the class*, appended to and never cleared. The `Authorization` interceptor is registered **inside** the login effect and closes over that login's token. `*logout` calls `clearStorage()` then `history.push` — an SPA navigation, no reload — so the interceptor survives holding the old token, and later requests in that tab still send `Authorization: Bearer <old token>`. Same on the idle-timeout path. Interceptors also accumulate one per login. | `src/models/login.js:33-49` |
| 🟠 | **Hardcoded Google Maps API key**, committed since `919829c` and present in history. Exposure depends entirely on whether HTTP-referrer/API restrictions are set in Google Cloud — **unverified**. | `src/pages/GetLocation/index.js:19` |
| 🟡 | JWT stored in `localStorage`/`sessionStorage`, readable by any XSS. Moving to httpOnly cookies requires coordinated backend work. | `src/utils/localStorage.js` |
| 🟡 | **No security headers.** `server.js` sets no CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options` or `Referrer-Policy`, and leaves `x-powered-by` on. Maps to the estate-wide "no browser security headers" item in the review. `src/pages/document.ejs` has no inline scripts and no CDN tags, so a CSP is achievable. | `server.js` |
| 🟡 | Query params interpolated into a redirect string unencoded; the sink is `history.replace`. Same-origin path only. | `src/layouts/SecurityLayout.jsx:42` → `src/models/login.js:105` |
| 🟡 | CSV URL built without `encodeURIComponent`, then `window.open(BASE_URL + <unvalidated server string>)` with no `noopener`. | `src/pages/Attendance/models/attendanceListModel.js:100-105` |
| 🟢 | `params.get('qrcode')` not null-checked — a missing param throws. | `src/pages/Location/locationPrint.js:9` |
| 🟢 | `window.location.href.includes('login')` matches "login" anywhere in the URL, suppressing the 401 redirect. | `src/utils/request.js:18` |
| 🟢 | `target="_blank"` without `rel="noopener noreferrer"`. | `src/pages/PrivacyPolicy/index.js:15` |
| 🟢 | Mock credentials `admin` / `ant.design` committed; the same string ships in the i18n bundle. | `mock/user.js:91,100`, `src/locales/en-US/pages.js:7` |
| 🟢 | **Build-path disclosure.** umi's generated runtime embeds absolute filesystem paths, and `dist/umi.*.js` ships the build machine's directory structure to every user. Pre-existing umi 3 behaviour. | generated |
| 🟢 | Scaffold leftovers: `public/CNAME` still reads `preview.pro.ant.design`; `config/proxy.js` dev/test proxies target the Ant Design demo host. | `public/CNAME`, `config/proxy.js` |

### 6.4 Architectural note

**Authorization is presentation-only.** `BasicLayout.menuDataRender` filters menu items against
`adminRoutes` / `supervisorRoutes` / `managerRoutes` in `config/routes.js`. This hides UI; it does
not enforce anything. All access control must be enforced by the backend.

---

## 7. How this was verified

No fix was accepted on the basis that the build passed.

- **Reproducibility** — `npm ci` and `npm install` produce **bit-identical** `dist/` output.
  (Caveat: identical only from the same absolute path; umi embeds absolute paths in its generated
  runtime, so output differs across directories but not across Node versions.)
- **Module graph** — the removal commits were checked by comparing emitted `dist/` filenames, which
  are content hashes. Identical filenames prove the graph did not change. Commits 2, 3, 4, 7, 10
  produced byte-identical output.
- **`immer` really ships** — the immer override changed 14 `dist/` chunk hashes while the removal
  commits changed zero, confirming it is bundled rather than build-time.
- **`path-to-regexp` 2.4.0 → 3.3.0** — compared across **588 pattern/path combinations** covering
  every route pattern and menu path in `config/routes.js`: zero match-result differences, zero
  regex-source differences.
- **`query-string` 6.14.1 → 4.3.4** — compared `parse`/`stringify`/round-trips across **42 cases**
  including percent-encoding, `+` handling, repeated keys, unicode and the app's real query shapes:
  zero differences.
- **postcss 7 → 8** — all 27 emitted stylesheets compared: **zero vendor prefixes lost**, total CSS
  2,177,229 → 2,176,737 bytes. All differences are `postcss-preset-env` 7 resolving `unset`
  keywords (`line-height:unset`→`inherit`, `min-width:unset`→`0`, `left:unset`→`auto`) — correct
  per spec, and an improvement for the configured IE11 target, which ignores `unset` entirely.
- **Node equivalence** — same directory built on Node 16.20.2 and 24.19.0: bit-identical.
- **Runtime** — `node server.js` serves `/` 200, JS bundle 200, CSS 200, SPA deep-link 200.
- **Headless browser boot test** — after every change that altered shipped code: app mounts,
  redirects to `/user/login`, renders the form, with **zero JS exceptions, zero console errors and
  zero failed asset requests**. This exercises the riskiest change, since `SecurityLayout` is
  dva-connected and dispatches `global/setRedirect`, a direct-mutation reducer.
- **Stub is inert** — neither the stub's error string nor any `elliptic`/`browserify-sign` code
  appears anywhere in `dist/`.

### Fixes attempted and rejected

Recorded so they are not retried:

| Attempt | Why it failed |
|---|---|
| Global `postcss@8` override alone | Build failed. Diagnosis was wrong at first — it broke because postcss-7-era plugins received a postcss-8 API. Bumping `postcss-safe-parser`, `autoprefixer` and `postcss-preset-env` together **works** (commit 14) |
| `decode-uri-component@0.5.0` | ESM-only; `query-string` requires it from CommonJS → `ERR_REQUIRE_ESM` at postinstall |
| `esbuild@0.25` with the plugin installed | `esbuild_1.startService is not a function` — removed in esbuild 0.15, still called by `esbuild-loader` |
| **umi 3 → 4 migration** | See §8 |

---

## 8. umi 3 → 4 was evaluated and rejected

Branch `chore/umi4-migration` (**do not merge**) records a working feasibility spike. Three findings:

1. **It does not fix what it was meant to.** `decode-uri-component@0.2.2` and `elliptic@6.6.1`
   both survive into the umi 4 tree unchanged.
2. **It is a net security regression.** umi 4: **50 findings — 1 critical, 17 high**, 24 moderate,
   8 low, versus 0 on the hardened umi 3 tree. New arrivals include `immer` (critical again),
   `axios`, `image-size`, `node-fetch`, `path-to-regexp`, `postcss`, `react-router`, `less`. The
   umi 3 tree is clean *because of* the scoped overrides; umi 4 starts from its own unpatched
   transitives.
3. **It compiles and boots clean, and renders nothing.** Build green, console error-free, `#root`
   empty, no route resolves — umi 4 uses react-router 6, which requires `<Outlet />`, while all
   four layouts pass `{children}`. Still outstanding: `Redirect`→`Navigate`,
   `useHistory`→`useNavigate`, and pro-layout 7's `menuDataRender` contract, which carries the
   role-based menu filtering.

**Conclusion:** treat umi 4 as a product decision needing a dev + QA cycle, not as a security fix.
On these numbers it is the opposite of one.

---

## 9. Open items

### Blocking / needs an answer
1. **Manual smoke test before release.** Boot, routing and rendering were verified in a headless
   browser; **no authenticated session was ever exercised.** Employee CRUD, face capture
   (`react-webcam` → `files/upload`), CSV export, and the role-based menus are unverified.
   Commit 5 (`immer`) is the one change that altered shipped code and needs the most attention —
   immer 9 tightened auto-freeze and this codebase's reducers mutate state directly, so the failure
   mode is *silent*: a list that does not refresh after a successful API call.
2. **What Node does the production build host run?** It will now fail fast on Node < 18 by design.
3. **Is the Maps API key referrer-restricted** in Google Cloud?
4. **The §6.2 incident** — history purge and credential rotation are decisions, not defaults.

### Recommended next
5. Fix the post-logout token leak (§6.3). Note this becomes a **prerequisite** if umi 4 is ever
   attempted, since `umi-request`'s interceptor API is exactly what changes.
6. Add security headers to `server.js`; ship CSP as `Content-Security-Policy-Report-Only` first —
   `@react-google-maps/api` injects a script from `maps.googleapis.com`, antd 4 injects inline
   `<style>`, the webcam produces `data:` URLs, and `login.js` falls back to an avatar on
   `gw.alipayobjects.com`.
7. **Build real regression coverage.** Current coverage is one 35-line unit test for a regex. Every
   fix in this branch was validated by hand; that does not scale.
8. Standing calendar item to run `npm audit` and review. The committed lockfile stops silent drift
   in both directions — it also stops automatic uptake of patch releases.

---

## 10. Reference

```bash
nvm use                 # Node 24, per .nvmrc
npm ci                  # install from the committed lockfile
npm run build           # -> dist/ (107 files, 27 CSS)
npm test                # 1 suite, 3 tests
npm start               # serve dist/ on :3001
npm audit               # expect: found 0 vulnerabilities
```

Do **not** run `npm audit fix --force` (see §4).
