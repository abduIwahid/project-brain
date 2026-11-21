# Brain — NearSend
_Last full analysis: 2026-10-24 (repo read end-to-end + live site check). Repo: github.com/abduIwahid/NearSend (main). Live: share-any-file.vercel.app (static 200 verified; transfers need 2 real devices to verify). Local copy read: ~/workspace/nearsend-analysis/NearSend-main/._

## What it is
Browser-to-browser nearby file sharing: no accounts, no cloud upload. Vanilla JS (ES modules) + Node (express + ws). PWA. Version 1.2.0 (package.json name is "nearsend-vercel" — drift from product name).

## Architecture (as built)
- **Rooms:** online mode groups peers by sha256 hash of public IP (`ip:<16 hex>`); optional user room code `?room=` (`c:<code, ≤12 chars, lowercased>`); local mode = single room `local`.
- **Signaling server** (server/signaling.js, reused by api/ws.js on Vercel): assigns 8-char random peer IDs + playful names ("Swift Panda"), broadcasts peer lists per room, forwards signal/relay/pair messages only to existing room members. Protections: 20 conn/min/IP, 64 KB text cap, heartbeat 15 s, rename strips `<>`, ≤24 chars.
- **Pairing:** explicit pair-request/accept before any WebRTC; then per-file meta → receiver accept/decline (120 s timeouts both waits).
- **Transfer** (public/js/transfer.js): ordered RTCDataChannel, 16 KB chunks, backpressure (pause >1 MB buffered, resume at bufferedamountlow/256 KB), live speed, byte-count verification at end (mismatch = fail), cancel both directions, safeName() sanitizes received filenames.
- **Relay fallback:** if direct WebRTC fails, file bytes relay through the WS server in ≤64 KB frames prefixed with the 8-char target ID (app.js toasts "Direct connection failed. Using relay (slower)"). Means the "server never sees files" claim only holds on the direct path.
- **Receive:** all chunks held in memory → single Blob → object URL save. No streaming to disk.
- **ICE:** STUN only (Google default, STUN_URL env override). No TURN anywhere.
- **PWA:** manifest + icons; sw.js cache `nearsend-online-v4`, network-first navigations, cache-first assets, /api excluded. Assets cache-busted manually with ?v=20261012-4.
- **Rendering safety:** peer/file names rendered via textContent everywhere; innerHTML only for static Lucide icon markup. XSS-safe.
- **Docs (unusually thorough + honest):** PRD, ARCHITECTURE, DESIGN, BUILD_PLAN, TESTING (manual matrix only), DEPLOY-AND-TEST, VERCEL-DEPLOY. The Vercel doc itself states the deployment is "a demo adaptation, not production-ready."

## Ranked weaknesses (2026-10-24)
1. **Production signaling unreliable on Vercel** — in-memory rooms + WebSocket beta on Functions: two clients may land on different instances and never discover each other. Own comment in api/ws.js says move rooms/presence to Redis. Fix options: run server/index.js on Render/Railway/Fly (it's ready), or Upstash Redis pub/sub behind api/ws.js.
2. **No TURN server** — same-Wi-Fi works; cross-network / symmetric NAT (campus firewalls) often fails to relay path. Free TURN: Cloudflare Calls/TURN or metered.ca free tier; wire via env like STUN_URL.
3. **In-memory receive ceiling** — large files (hundreds of MB) can crash low-end phone tabs; no size warning. Future: File System Access API / OPFS streaming + a soft size notice.
4. **Discovery visibility** — everyone sharing your public IP (whole campus NAT) sees your device name; room codes are user-chosen and guessable. Mitigated for transfers by pair+file consent; visibility itself is by-design for the local use case, but worth a line in the product copy.
5. **Repo hygiene** — NO LICENSE file, NO .gitignore (README itself prescribes one), no automated tests (no test script), lucide loaded unpinned from unpkg @latest (jsQR from jsDelivr on demand).

## Strengths to preserve in any refactor
Transfer engine (backpressure + verification + consent handshake), XSS-safe UI rendering, signaling server's rate/size limits, honest docs voice, zero-framework footprint (~1,200 LOC total), graceful relay degradation with a user-facing toast.

## Fix round APPLIED 2026-10-24 (Abdul Wahid: "kro phir fix apny hissab se") — pushed to main, live-verified
- **Signaling host now configurable**: `/api/info` (both Vercel api/info.js and server/index.js) returns `signal: SIGNAL_WS_URL || null`; client connects there when set, else same-origin `/api/ws`. Hosting the standalone server + setting that one env var is the ONLY remaining step for reliable production discovery (needs Abdul Wahid's host account — Render/Railway/Fly).
- **TURN support wired end-to-end**: env `TURN_URL`/`TURN_USERNAME`/`TURN_CREDENTIAL` → iceConfig() in server/util.js → hello message + /api/info carry `turn` → peer.js builds iceServers [STUN, TURN]. Inactive until Abdul Wahid sets the env vars (live /api/info verified: turn:null, signal:null).
- **ETA** on transfer rows (from live speed: "~Xs left" / "~Xm Ys left", ui.js updateTransfer).
- **Retry button** on failed sends (transfer.js failedSends map + retrySend; declines/cancels are NOT retryable by design). Removes the old row and re-sends the same File.
- **Private room button** (index.html pair-actions): generates a random 6-char code from an unambiguous alphabet, reloads into ?room=CODE; toggles to "Leave private room". Room toast on load.
- **Signaling smoke test**: test/signaling.test.js (npm test) — boots real attach(), two clients, discovery + signal forwarding + ICE fields in hello. PASSES locally (found+fixed a test-side race, server was correct).
- **Hygiene**: MIT LICENSE added, .gitignore added, package-lock.json committed, lucide pinned 0.469.0 (was @latest), SW cache v5, asset ?v=20261024-1.
- Docs: README gained a Production configuration env table; VERCEL-DEPLOY.md gained the SIGNAL_WS_URL alternative paragraph.
- NOTE: the large-file receive warning already existed (ui.js askReceive, >500 MB) — analysis overstated its absence; threshold is 500 MB.

## Still open (deliberately NOT done in the 2026-10-24 round)
- **Transfer resume** (chunk-offset renegotiation) and **streaming receive to disk** (File System Access/OPFS): protocol-level changes that need two real devices to verify; do them as their own round with device testing, not blind.
- **Actual signaling hosting + TURN credentials**: code-ready, waiting on Abdul Wahid's host/credentials. HOSTING HUNT 2026-10-24 (all verified live/sourced): Render requires a card on file even for the FREE web service on new accounts ($1 verification hold) — Abdul Wahid stopped at the card screen, correctly. Hugging Face **Docker Spaces are now PAID** (lock badge in the create-Space UI; Gradio/Static still free but wrong runtime for this Node server). Koyeb requires a card since Feb 2026 ($29 pre-auth hold, per Koyeb's own pricing FAQ). Railway free = one-time $5/30-day credit then $1/mo — won't keep a WS server up 24/7. Verdict given to Abdul Wahid: park it; local mode is the product's heart, SIGNAL_WS_URL makes any future host a 5-minute job. Repo contains deploy/signaling-space/ (Dockerfile + Space README) and a sync GitHub Action that no-ops until HF_TOKEN/HF_USER are set — reusable if HF Docker ever frees up or he gets PRO.
PYTHON PORT DONE 2026-10-24 (Abdul Wahid approved after the cost/benefit talk; goal = online sending without devices being nearby, for the portfolio demo): deploy/signaling-space/app.py is a protocol-compatible FastAPI/Gradio port of the Node signaling server (rooms, hello ICE fields, peers, signal/relay/pair forwarding, binary relay framing, rename sanitize, rate/size limits; uvicorn ping heartbeat). PASSES the full compat suite locally (test/signaling-remote.test.js — discovery, signal, rename, binary relay). Pushed to main + raw-verified. Deployment path simplified to MANUAL upload (the connector cannot push workflow files, so the auto-sync Action never landed): Abdul Wahid creates a Gradio Space named nearsend-signaling and uploads app.py + requirements.txt in the Space Files tab; then SIGNAL_WS_URL=wss://<hf-user>-nearsend-signaling.hf.space/api/ws on Vercel + redeploy, then run npm run test:remote against the live Space. Free Spaces sleep after 48h idle (client auto-reconnect covers wake-up).
- Discovery visibility on shared public IPs and remembered paired devices (localStorage favorites) — smaller product ideas from the same analysis, untouched.

## If Abdul Wahid resumes work here — suggested order
Host signaling (set SIGNAL_WS_URL) → set TURN env → resume/streaming round with device tests → device favorites.

## HF Space saga — diagnostics log (2026-10-24 evening)
- Space `abdu1wahid/nearsend-signaling` (Gradio SDK). Free tier = **ZeroGPU only**; CPU basic is PRO-locked ("downgrade" rule) and Docker Spaces are paid. Verified live.
- Runtime error #1: proxy env vars (NO_PROXY with bracketed IPv6) crash httpx at gradio import → fixed by scrubbing *_proxy vars at the top of app.py (locally reproduced + verified).
- Runtime error #2: "No @spaces.GPU function detected during startup" — ZeroGPU kills Spaces with no GPU function. A top-level @spaces.GPU dummy did NOT fix it under **Gradio 6.30** (HF's auto sdk_version): Gradio 6 breaks ZeroGPU's detection. **Fix that worked: pin Gradio 5.50.0** (README sdk_version + requirements) AND place `import spaces` + `@spaces.GPU(duration=1)` dummy right after the imports (HF-forum-proven arrangement). After this the GPU error disappeared.
- Current state (21:47): GPU check PASSED, but the app now exits with **code 3** during startup; HF's API errorMessage only shows a pip-as-root warning (unreliable last-line capture). Real traceback is in the Space's Container logs — owner's view only. Awaiting Abdul Wahid's screenshot of the log tail.
- Local repro environment: ~/workspace/.tools/hfvenv (gradio 5.50.0 + spaces installed; app boots + full WS compat test passes locally under both gradio 6.30 and 5.50).

- 2026-10-24 (late): Oracle Cloud Always Free flagged as the clean exit from the HF Space fight (saved-references item 100): a real always-on ARM VPS, now capped at 2 OCPU / 12 GB total after Oracle halved it in Jun 2026, 200 GB storage, 10 TB egress. The original Node signaling server could run on it 24/7 with a public IP. Blocker: signup requires a real credit card for identity verification (refundable hold) and Abdul Wahid's card is currently empty.

## Audit — 2026-10-24 (GitHub-wide review)
- **Verified repo state:** root matches the post-fix-round picture — LICENSE, .gitignore, package-lock.json, test/, deploy/, server/, api/, public/, and the full doc set (PRD / ARCHITECTURE / DESIGN / BUILD_PLAN / TESTING / DEPLOY-AND-TEST / VERCEL-DEPLOY). The README has been rewritten since the analysis above: it now leads with QR invitations and camera QR scanning.
- **Drift vs this file:** (a) the architecture section above never mentions QR invite/scan, yet the README documents QR generation + camera scanning with image-upload fallback (jsQR) — reconcile which is true of the shipped app. (b) The README's project-structure tree omits deploy/ and test/ although both exist. (c) The README's production section documents only the Node server; the Python Gradio port in deploy/signaling-space/ is invisible there.
- **New suggestions:**
  1. The README's opening section has no live-demo link or screenshot — add the share-any-file.vercel.app link plus one phone screenshot/GIF; the docs are thorough, but a visitor can't see the product in five seconds.
  2. Document the Python signaling port in the README production table (or mark deploy/signaling-space/ as experimental) so the repo doesn't present two silent server implementations.
  3. Add a one-page "deployment paths" decision table (Vercel demo / hosted Node / HF Gradio port / Oracle VPS) to DEPLOY-AND-TEST.md — three-plus paths now exist and only the chat history knows which is recommended.
