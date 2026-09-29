# Paperbag — clone and page refinement

## CURRENT SCOPE — latest user request supersedes draft-based launch
User: "Bro tulisan meet bag worker itu ganti jadi Every Token Has a Bag Worker. Biar pas, lalu juga tampilan web masih kurang bgt timpang tindih sama logo 2d dan modelan web kaya biasa gitu harusnya kaya gitu nih bro tampilannya https://parasiteonsol.fun/ tapi jangan pixel tapi mainin paper art gitu di setiap section tulisan modul dll , dan terkahir jangan ada draf bro launch token deploy = auto masuk ke olatform plus tambahin connect wallet mockup aja paham lah lu cara kerja launchpad gmn, dah itu aja"

Explicit confirmation: "Ya, wallet mockup → isi data token → Deploy → token tersimpan dan langsung muncul di daftar serta halaman trading, tanpa draf atau transaksi blockchain". Additional preference: "Buat model webnya kara art sketch paper gitu modelan kaya https://parasiteonsol.fun/ tapi jangan pixel, 2d".

### Current requirements (2026-09-29)
- Entire site uses cohesive 2D hand-drawn paper/sketch art inspired by reference composition, not pixel art or mixed photo/SaaS styling.
- Exact heading "Every Token Has a Bag Worker." in hero, home introduction, and Bag Worker page.
- No draft flow or draft API. Single-page form deploys a DEMO token directly into the actual MongoDB projects collection and navigates to its trading page.
- Mockup Phantom / Solflare wallet connection, browser persistence, shared virtual SOL balance, copy/disconnect. This is NOT authentication and never uses a wallet extension, signatures, seed phrases, or private keys.
- New tokens automatically appear at the top of newest Bags/home catalog. Images, description, HTTPS socials, and Bag settings persist.
- Preserve separate /bag-worker and /global-bag pages, explanation of both on home, seed charts, practice buy/sell, leaderboard, FAQ and cycle animation.
- No real blockchain token deployment or money movement was requested. Do not dispatch platform deployment agents for the term "deploy token".

### Implemented — paper-art and direct-launch update, 2026-09-29
- Three original custom ink-and-colored-pencil artworks (workshop landscape, worker machine, global vaults) generated, then converted to transparent PNG so drawings blend with every paper section; all bags remain plain and faceless.
- `paper-art.css` supplies graph-paper background, handwritten headings/nav, paper labels, tape accents, ledger lines, sketchy outlines, flat ink shadows, and consistent forms/trading modules. No pixel or 3D artwork.
- Home hero rebuilt as a full illustrated workshop, with centered Paperbag branding, exact headline, working launch/explore links. Photo hero removed from visible UI.
- WalletProvider shares the existing simulation state across header, dialog, launch, and trading. WalletDialog offers Phantom/Solflare MOCKUP connections, balance, copy and disconnect. Mobile menu auto-closes whenever wallet dialog opens.
- LaunchFlow replaced completely: one form with token data, real object-storage upload, optional HTTPS links, SOL target, fill/global assets and SHARE/BURN. No autosaved form/draft/wizard steps. A specimen preview updates while editing.
- `launching.py` adds validated, idempotent POST `/api/launch`, returning the public Project model. UUID request index prevents duplicate publish on retries/concurrent calls. Internal request/creator handles never reach public responses.
- Draft endpoints removed (404). Historical draft data left untouched, not used by current UI.
- Newly published demo tokens start with 0 volume, 0 holders, empty Bag history, an assigned worker, and a fixed demo quote. No fake backdated market activity. `launched_market.py` derives holder counts and last-24h volume from stored simulated trades, plus flat time-bucket candles since launch.
- `/market/:id/trades` and `/holders` support arbitrary launched UUID tokens; TokenActivity deduplicates the user's fills and exposes saved social links. After buy/sell, counts and chart data refresh and positions persist on reload.
- Main implementation files: backend/launching.py, launched_market.py, server.py, market.py; frontend/src/lib/wallet.js, components/WalletDialog.jsx, LaunchFlow.jsx, launch/TokenFields.jsx, Hero.jsx, HomeEcosystem.jsx, paper-art.css, pages/TokenPage.jsx.

### Latest validation — 2026-09-29
- Independent test report `/app/test_reports/iteration_2.json`: **36/36 backend tests passed**, all critical frontend flows passed.
- Tests cover direct publish/validation/idempotency/concurrency, image storage, no draft endpoints, no internal field leakage, new-token charts/activity/holders, existing trading/economics and routes.
- Main agent verified connect → enter token → deploy → redirect → buy → reload; token and 25M practice position persisted, holder count became 1, volume reflected 1 virtual SOL.
- Test projects and linked demo sessions removed after validation; source sample tokens preserved.
- One minor tester finding (mobile menu remaining expanded under wallet modal) FIXED via wallet-open effect in Header. Reproduced actual menu-open state and verified aria-expanded becomes false on wallet open.
- Final desktop 1920x800 and mobile 390x844 checks: no horizontal-overflow offenders, including wallet/toast/mobile trading; all artwork loads and plain bags remain recognizable.
- Backend test_public_api.py updated for new contract; test_launch_market.py added. Test-only script changes inspected.
- Final production build compiled successfully without warnings. External overview/list endpoints return the six original sample tokens after test cleanup; no test tokens remain. Overview now includes the same derived demo volume as the list/detail endpoints.
- Hardened the optional test-cleanup helper to require explicit `--project-id` values; removed broad name/ticker matching to avoid deleting unrelated future tokens.

### Current backlog
- P0: none in requested scope after final verification.
- P1 optional product additions: My Tokens view for the demo wallet; illustrative workshop motion; shareable token launch cards.
- Real wallet/RPC/minting/distributions are OUT OF SCOPE by the user's explicit simulation choice, not unfinished setup for this iteration.

---
The original clone history below records the first iteration. Where it mentions draft launches or the photograph hero, the current scope above takes precedence.

## Original problem statement
"Clone https://github.com/xonasy02-cmyk/Ppb sama persis jangan ada yang ketinggalan, lalu ubah gambar paperbagnya jangan pake yg ada gambar wajahnya polos aja, terus page page nya masih berantakan rapihkan pagenya, untuk carry itu ganti jadi bag worker, pisahkan juga pagenya jangan menyatu sama global bag"

### Explicit user choices
- Public GitHub repository: "Ya, gunakan isi repositori yang tersedia".
- "Ya, pertahankan semua fitur dan identitas desain aslinya, tetapi rapikan tata letaknya".
- "Untuk halaman depan kasih tambahan section dan kata kata untuk global bag dan bag worker walaupun ada di page teripisah tapi di home perlu di jelaskan agar org mengerti".
- Speak Indonesian with the user. Preserve the source product's English interface copy.

## Personas
- Visitors learning how project Bags, Bag Worker, and Global Bag differ.
- Token explorers comparing market stats, charts, and Bag progress.
- Creators preparing token drafts with metadata, artwork, and reward settings.

## Static core requirements
1. Preserve all existing source features, data contracts, and paper/kraft/yellow brand identity.
2. Remove faces and printing from ALL paperbag art: hero photograph, reusable SVG illustrations, and favicon/logo.
3. Rename the Carry feature to Bag Worker across visible UI while retaining backend field/API compatibility.
4. Independently routed Bag Worker and Global Bag; concise explanatory homepage sections for both.
5. Tidy desktop/mobile page hierarchy, spacing, typography, navigation, and responsive layouts.
6. Preserve existing explicit limits: illustrative market data, virtual trading, disabled live wallet/Pump.fun launch, and no live asset distribution.

## Architecture and provenance
- Source: https://github.com/xonasy02-cmyk/Ppb, main commit 97d45b678fa9097cd3b68642e7fa3f610fb4bb3a.
- Source frontend/src, frontend/public, backend files and tests imported into /app. Source backend trading/economics/drafts logic preserved.
- React 19, React Router, Framer Motion, Lenis 1.3.26, Lightweight Charts 5.2.1.
- FastAPI, Motor, MongoDB; original MONGO_URL, DB_NAME and REACT_APP_BACKEND_URL preserved.
- Existing PNG/JPEG/WebP uploads use Emergent Object Storage with only references in MongoDB, not base64. Keys remain backend-only.
- Source's opaque draft/practice session UUIDs and localStorage preserved. No auth/account system added.
- Assets: locally saved edited hero at frontend/public/images/plain-paperbag.jpeg; no faces in BagArt or bag-mark.svg.
- Design reference: /app/design_guidelines.json; source DM Sans/Space Grotesk/Caveat and cream/kraft/charcoal/yellow maintained.

## Routes
- `/`: original hero, moving editorial strip, metrics, featured tokens, simple Bag-cycle intro, NEW explanatory Bag Worker and Global Bag sections, launch CTA.
- `/bags`: search, 8 sort options, grid/list discovery, market cap/volume/holders/changes and Bag progress.
- `/token/:id`: full trading chart and stats, 5 timeframes, candle/line and price/mcap, activity/holders/my trades/about, watch/share, virtual buy/sell positions and Bag history.
- `/launch`: CURRENT single-page token publish form with mock wallet, upload, metadata, settings, and immediate demo deployment. The original draft flow was removed in the paper-art update at the user's request.
- `/bag-worker`: isolated worker animation with pause/play and project nodes, risk statement, three-step explanation, link to separate Global Bag page.
- `/global-bag`: isolated four asset vaults, honest 24-hour planned cadence (not a live countdown), native PAPERBAG 80/20 cycle, link to separate worker page.
- `/ecosystem`: Bag-cycle animation and FAQ; no longer combines worker and global dashboards.
- `/leaderboard`: five ranking categories with token links.
- Compatibility: `/carry` and `/ecosystem#carry` → `/bag-worker`; `/paperbag` and `/ecosystem#paperbag` → `/global-bag#paperbag`; `/ecosystem#global-bag` → `/global-bag`; `/bags/:id` → `/token/:id`.
- Unknown paths retain friendly 404. Async hash scrolling waits for destination content to mount.

## Implemented — 2026-09-29
- Full source feature import and dependency installation; original APIs working with six seeded projects.
- Plain paperbag hero photo generated by editing original image, with face and printed label removed; reusable SVG face paths removed, logo/favicon replaced with plain bag.
- New BagWorkerPage, GlobalBagPage, HomeEcosystem sections, footer links, updated header/mobile navigation and active states.
- Carry terminology changed in cards, sorts, ranking tabs, FAQ, token sidebar, and active worker page. Backend carry_* fields remain compatible intentionally.
- Improved text contrast, readable sizes, symmetric spacing, grid tracks, mobile token-list stacked layout, responsive footer and cards. Original visual identity and moving marquee maintained.
- Original image storage configured for the new environment and verified with real API upload/download.
- Browser scroll warning fixed by positioning document scroll container relative; no change to domain logic.

## Verification — 2026-09-29
- Frontend production build compiled successfully.
- External API health and six-project list passed initial checks.
- Main-agent desktop 1920x800 and mobile 390x844 screenshots for home, worker and global pages; no horizontal-overflow offenders.
- Independent testing report: /app/test_reports/iteration_1.json.
- 31/31 backend regression tests passed: queries/validation, simulated trading persistence/idempotency/concurrency, Decimal economics, draft CRUD, PNG/JPEG object-storage reads/writes, fail-closed launch.
- Frontend critical checks passed: full navigation and legacy redirects, separate pages, home sections, charts and stats, simulation buy/sell/persistence/reset, search/sort/grid-list, all leaderboard tabs, FAQ/cycle animation, wallet status dialog, and full launch draft lifecycle including upload/save/reload/edit/discard.
- Tester modified only backend/tests/test_public_api.py (added JPEG coverage) and test report. Changes inspected.
- No blocking defects. Illustrative financial flows remain illustrative by original design, not missing integrations introduced by this clone.
- Final follow-up screenshots under /app/test_reports/final-*.jpeg: desktop 1920px and mobile 390px have zero overflow offenders; scrolling animation warnings absent, yellow worker CTA has dark ink contrast, and mobile home Global Bag CTA successfully opens the independent page.

## Prioritized backlog / next tasks
### P0 — Requested scope
- None outstanding. Final animation-warning fix and screenshot verification completed successfully.
### P1 — Source product backlog (not authorized for this task)
- Actual Solana wallet and audited Pump.fun launch/trading require separate requirements and integrations.
- Verified real market feeds, holder snapshots, settlement, and profit reconciliation before any live rewards.
- Do not enable real funds, fake mint addresses, or promise earnings as part of UI refinement.
### P2 — Optional visible enhancements
- Watched-token filter for the already-saved watch toggles.
- Compact side-by-side comparison of project Bag / Bag Worker / Global Bag.
- Shareable image summary of a token's Bag progress.

## Handoff notes
- No credentials needed to browse. See /app/memory/test_credentials.md.
- No scheduling/background distribution was added: 24H is source presentation only, not a live task.
- Continue to preserve original English UI and Indonesian user communication.