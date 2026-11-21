# Project: Study Hub — fa24-bai.vercel.app

Overrides/additions to `../general/` for THIS project only.

- **Stack:** vanilla HTML/CSS/JS SPA + Vercel functions (repo:
  `abduIwahid/fa24-bai`). Course files live in the repo under
  `5th Semester/…`. Local clone: `~/workspace/study-hub-analysis/repo`.
- **Palette:** cream `#f0ede4` background + deep green `#004741` primary.
  Light theme default; dark via `fa24bai_theme` localStorage.
- **Icons:** Bootstrap Icons.
- **Audience:** the FA24-BAI cohort (BS AI, 5th semester, COMSATS Attock) —
  classmates, not the public internet. No student accounts; bookmarks/saved
  items are per-device (browser localStorage).
- **Footer (final, Oct 2026):** sticky, centered — Terms & Conditions ·
  Privacy Policy links + "Found this hub helpful? Give it a ⭐ (star icon)
  on GitHub" line to the repo. No "Maintained by" line (he removed it).
- **Header (2026-10-23 evening, at Abdul Wahid's direction):** converted to a
  FLOATING GLASS PILL like the portfolio's — detached from the top/edges
  (12px top offset, clamp side margins), border-radius 999px, translucent
  card-bg + blur(14px) saturate(1.4), soft green-tinted shadow. This
  superseded a same-evening tweak that only added corner padding to the
  old bar. Hero search bar rounded the same evening (bar 16px, button
  12px — was 8px/6px, read as square). CSS cache version bumped to ?v=21.
- **Uploads:** admin-only via `/api/upload`; Abdul Wahid's standing workflow — he
  sends PPT/PPTX, Muse converts to PDF, asks folder + password, uploads and
  live-verifies.
- **Known open risk:** the admin password still needs rotating (it's in git
  history) — his call, don't nag.

## 2026-10-23 (late evening round)
- Cards: --card-bg pure white #ffffff -> warm cream-white #fdfaf1 (he dislikes full white; brag video palette).
- Course cards restyled to the brag "SIX COURSES" scene: green accent bar (::before, inset, rounded), name -> code -> bold green "N files"; landing card lost its verbose text + Explore button (whole card clickable).
- Modals widened: generic/AI 500->620px, notices 460->600px (he: too vertical/lengthy).
- Header: ONE line at every width — mobile menu is inline now (hamburger hidden <=799px), icon-only nav <=560px, subtitle hidden, 36px toggle buttons.
- Recently Added + Most Downloaded home strips REMOVED entirely (containers + renderHomeStrips + call sites) at his request. Recently Viewed stays.
- AI Assistant: strict no-LaTeX plain-format rules in the prompt + frontend LaTeX scrubber in formatMarkdown (headings/hr/bullets now render); ListModels discovery moved to fallback-only; per-request timeouts (model 25s, PDF 15s, discovery 10s) after a worst-case test took ~4 min; chat maxOutputTokens 1024.
- README refreshed for all of the above. CSS ?v=23 / JS ?v=17.
- Suggestions round (AI summary caching, security round incl. ADMIN_PASSWORD rotation + ask rate-limit, back-to-top/scroll-progress/skip-link/print CSS, feedback button, liquid indicator spring) PROPOSED 2026-10-23 ~21:12 from the reel collection; Abdul Wahid DEFERRED all of it until after the KRR Assignment #1 is submitted ("ye kam krr assignment ke bad"). Do not start before that.

## 2026-10-23 late — full responsive audit + small-screen header fix
- Abdul Wahid asked for a self-run audit at every zoom/device ("khud try kro, bulky responsive check"). Browser audit (iframe harness, exact widths 320/360/390/414/768/1024/1280/1440/1920): PASS at 414 and all ≥768 widths (one-line header, no overflow, modals fit). ONE defect: at 320/360/390 the centered nav-icon row overflowed its flex box and painted over the STUDY HUB wordmark ("STU"/"STUDY" visible).
- Fix shipped (CSS v26, commit 59e6c2f, live-verified): ≤480px slimming block — pill margins 6px, padding .35rem .5rem, header gap .4rem, logo 26px, wordmark .78rem, menu items 5px padding, toggles 34px — so the full header truly fits 320–400px layouts.
- Abdul Wahid's own screenshots (iPhone, Safari AA 100/85/75/50%) all render clean; at 75% AA the labeled nav fits his 414pt phone fine.

## 2026-10-23 late — unified responsive scheme (CSS v27, commit 4968eed)
- Abdul Wahid compared his Safari AA zooms: 100/85% = icons only, 75% = "ajeeb" half-state (labels ON + subtitle truncated), 50% = desktop. Cause: double scaling (JS initial-scale meta × his AA zoom) jumping breakpoint bands + a cramped 700–860 labeled band.
- Fix: REMOVED the JS initial-scale hack — single scaling mechanism now: CSS body zoom (.75 phones ≤768px, .9 desktop). Unified header band: icons-only + subtitle hidden up to 860px; labels + subtitle switch on TOGETHER at 861px+ (padding rule moved 800→861). body overflow-x: clip as a zoom safety. His rule going forward: no half-and-half states at any zoom; breakpoints must be width-honest under ONE scaling mechanism.

## 2026-10-23 night — suggestions round SHIPPED (all 5, live-tested)
1. **AI summary caching** — /api/ask stores the first summary per file in repo `ai-cache/*.json` (GitHub Contents pattern) and serves it to everyone (`cached:true`, ~2s vs 16–57s fresh). Read goes through the Contents API because raw.githubusercontent caches 404s. Quiz/viva stay uncached (variety).
2. **Security** — password fallbacks re-verified absent in all api files (env-only, fail-closed). Rate limits added to /api/ask (AI 20/min/IP, verify 10/min/IP) and /api/feedback (5/min/IP). **ADMIN_PASSWORD ROTATED** via Vercel env edit + redeploy; new password verified live (success:true); old one is dead (the git-history exposure is closed). Abdul Wahid was handed the new password in chat 2026-10-23 (his pattern; vault unavailable in his region).
3. **Item-79 pack** — scroll progress bar, back-to-top button, skip-to-content link, print stylesheet. LIVE (CSS v31 / JS v20).
4. **Feedback** — pill button bottom-left on every page → modal → POST /api/feedback → stored in repo `feedback/feedback.json` (array, cap 500). One marked test entry from Claude sits at the top of the file. UI wording shipped: "Feedback" / "Send Feedback" / "Tell us what's missing, broken, or worth adding" / toast "Feedback sent - thank you!" — flagged to Abdul Wahid for tweaks.
5. **Nav polish** — indicator glide springier: .5s cubic-bezier(0.34, 1.45, 0.4, 1).

## 2026-10-23 night — Abdul Wahid's corrections after the round
- **Feedback + back-to-top REMOVED** at his instruction ("feedback or back to top hta do") — UI + JS wiring deleted (CSS v32/JS v21); the /api/feedback file remains in the repo but is inert with no UI. Scroll progress + skip link + print CSS were kept (he didn't object to them).
- **Two-tier phone header REVERTED** — he called it "kharab" and asked for the previous commit's header: single horizontal line with labels + bigger branding (the v29 state). Lesson recorded: he prefers ONE line even if tight; do not re-propose two-row headers or floating action buttons on this site.

## 2026-10-23 late — AI pre-caching system (Abdul Wahid's order)
- ask.js now caches **summary + quiz + viva** per file in `ai-cache/` (summary keeps the original filename; quiz/viva get `.quiz.json` / `.viva.json` suffixes). First generation is shared by everyone; repeats return in ~1–2s with `cached:true`. PDF fetch gained a Git Blobs API fallback for fresh uploads (raw CDN 404-lag).
- Backfill + sweep: `~/workspace/study-hub-cache/precache.py` lists /api/files, diffs against ai-cache/, and generates only what's missing via the site's own /api/ask (3 workers, paced under the rate limit). Full backfill launched 2026-10-23 (~23:45): 50 PDFs, 148 generations. Cron `study-hub-ai-precache-sweep` runs it every ~30 min, silent on success — so future uploads get pre-cached automatically (Abdul Wahid: "ainda bhi new file upload ho to pehly hi sari details nikal lo").
- Tradeoff Abdul Wahid accepted implicitly by ordering full caching: every student now gets the SAME quiz/viva per file (variety traded for speed).
- README gained his banner (cropped from his phone screenshot to the 900×510 green band) as `banner.jpg` at repo root, displayed centered at the top. Binary went in via /api/upload (the GitHub connector is text-only).

## 2026-10-24 — Ask the Hub (hubask) FIXED
- Root cause (found via temporary diagnostics exposed in the API response, since Vercel runtime logs were unreachable): the hubask branch hardcoded ['gemini-3.8-flash','gemini-2.5-flash','gemini-2.0-flash'] with NO fallback — Google has RETIRED 2.5-flash and 2.0-flash for this key (404 "no longer available to new users"), and 3.8-flash alone times out on the big pick prompt (15s). The main per-file flow survived because it has a discoverModels() fallback; hubask never did.
- Fix shipped in api/ask.js: hubask gained discoverHubModels() (same list-API strategy as the main flow), pick/answer timeouts raised to 30s, summary heads trimmed 220->160 chars, and a global.__hubModelHint remembers the model that answered so the answer call (and warm-container requests) skip the dead models. Debug instrumentation was added, used, and fully removed the same day.
- Live-verified: "deadlock" -> OS Chapter 6 Synchronization + ProcessSync sources (model honestly notes the cached summaries don't cover deadlock itself); "master theorem" -> full correct answer with DAA Lecture 11 + CDF + Lecture 7 sources. Typical latency ~60s (cold containers pay discovery; frontend shows a thinking state) — acceptable; further speed work would need model-order experiments.
- Lesson for future debugging: when Vercel logs are unavailable, temporary response-exposed diagnostics + a debug flag beats guessing; remove them in the same session.

## Audit — 2026-10-24 (GitHub-wide review)
- **Verified repo state:** root = index.html + css/ + js/ + api/ + ai-cache/ + feedback/ + "5th Semester/" + sw.js, manifest.json, sitemap.xml, robots.txt, llms.txt, terms.html, privacy.html, counts.json, notices.json, package.json, banner.jpg. README (7.4 KB) is current and detailed.
- **Drift vs this file:** this brain file stops at the hubask fix. Not recorded here: the Groq fallback later shipped in api/ask.js, and several README-documented features have no entry above — interactive tap-to-answer quizzes, Bookmarks / Saved view, WhatsApp share, midterm countdown, global search with `/` shortcut, deep links. The SEO files (sitemap.xml / robots.txt / llms.txt) sit in the repo unmentioned here.
- **New suggestions:**
  1. Add a LICENSE — none exists at repo root (verified in the listing), even though the code is shared with the whole cohort.
  2. Runtime data lives in git (ai-cache/, feedback/, counts.json, notices.json grow with use) — plan periodic archival/compaction before repo history bloats; longer-term, counters/feedback belong off-repo.
  3. Add a scheduled synthetic check of /api/ask (one canned question) — the hubask outage surfaced via a user report; a canary would catch Gemini model retirements / quota deaths first.

Saved-reference application (item 127, 25 Oct 2026): the grouped-list
pattern — resource/course lists should live as one grouped list in a
single card with monochrome icons rather than many separate floating
cards, and any status shown exactly once. Candidate for the next frontend
round; pairs with the view-first files change.

## Consolidation note — 2026-10-29 (nightly pass)
- SUPERSEDES the 2026-10-27 Book Stack logo + wordmark-removed header
  state AND the 2026-10-28 header-only note: LOGO NOW = old open-book
  RESTORED, then re-finalized as a NEW realistic open book (his pick
  from two preview rounds, 2026-10-28 ~21:02–21:52): white open book on
  sage #3E5F56 tile, redrawn as SVG in logo-full.svg, then iterated to
  a detailed realistic version (gutter shading, text lines, stacked-leaf
  bottom edge, page curl REMOVED at his flag, full-bleed square tile
  #004741, sage cover #8FAE9F, cream pages #F3EDDA). Visible stacked
  wordmark beside it: 'STUDY' over 'HUB', Archivo Black, sized to logo
  height (.site-wordmark; later shrunk 20px → 18px desktop, 17px → 15px
  mobile at his alignment spec). FULL ROLLOUT live 2026-10-28 22:06
  (deploy-watch landed: icon-512.png 20,599 bytes, style.css v39, sw
  v36): header, favicon, PWA, OG — everywhere, not header-only.
  SVG-first lesson: WeasyPrint preview misrendered SVG gradients
  (tile + left page vanished) — rebuilt with flat fills + translucent
  overlays; use that technique for future logo/icon SVGs.
- MATERIALS LIST NOW STATIC (2026-10-28 ~19:5x–20:15, durable fix for
  the evening's site-wide outage): GitHub API quota for the Hub backend
  token exhausted (~18:05, "API rate limit exceeded for user ID
  190056021") → /api/files 403 for everyone, direct PDF links
  unaffected. First step (api/files.js in-memory 1-hour cache) did not
  help a cold instance. DURABLE FIX: static `files.json` in repo root
  (63 entries as of 2026-10-28 evening, dates git-derived), vercel.json
  rewrites /api/files → /files.json, api/files.js DELETED,
  api/upload.js + api/delete.js keep files.json in sync (best-effort
  syncFilesJson). Frontend untouched (script.js still fetches
  /api/files). Same push fixed PDF cache headers under /5th Semester/
  (was Cache-Control immutable 1 year → max-age=3600 +
  stale-while-revalidate=86400). Live-verified ~20:15 while quota was
  still exhausted. NOTE: a '+' in a filename breaks its direct link
  (server reads + as space → 404) — ch3 (update-process+IPC).pdf was
  re-uploaded as ch3 (update-process-IPC).pdf.
- DOWNLOAD COUNTS REMOVED 2026-10-28 at his order: the ⬇-count badge
  AND /api/count tracking deleted from script.js (live v24) — this
  also kills the old per-view GitHub commit + full redeploy spam.
  File rows (.resource-item) background #fbfbf9 → var(--bg-color)
  cream, same evening (style.css v37). SW cache v33 at that point,
  later v36 with the wordmark/logo rollout.
- CONTENT 2026-10-28: 6 OS files converted + uploaded to
  `5th Semester/OS/Lectures` (ch5 CPU Scheduling 52pp, processor
  scheduling 35pp, ch3 Processes+IPC 48pp, Lab 05 commands 14pp, Lab 05
  manual 12pp, Process Management 44pp); re-sends because the old
  copies "nahi open ho rhi thi" — processManag's blank page was a
  stale browser/SW cache (server 200, 44 pages, blob-verified), fixed
  by SW cache bump v30 → v31 purging stale caches for all visitors.
  4 Statistics lectures uploaded by Abdul Wahid himself via GitHub web —
  Muse added the files.json entries + verified. Pre-cache sweep
  2026-10-29 00:13 reports 68 files / 204 caches, 0 to generate —
  that is 5 MORE than the 63-entry files.json recorded on the evening
  of 28 Oct; the gap is UNEXPLAINED in the notes (possible further
  web uploads overnight) — verify the count next session, do not
  quote 63 or 68 as settled until then.
- BOOKS: Abdul Wahid uploads whole books AS-IS himself via GitHub web into
  `5th Semester/<Course>/Book/`; Muse adds files.json entries +
  verifies. /api/upload REJECTS whole books (16.8 MB Weiss
  Introductory Statistics 9e → HTTP 413, payload limit ≈4.5 MB).
  Chapter-split route was built then CORRECTED by him ("books as it
  is upload kr do or kuch na kro") and the one uploaded chapter
  deleted — do not revive chapter-splitting unasked. First book
  pending from him: Weiss 9e for Statistics/Book.
- "Request a Material" form check 2026-10-28 08:46: no new responses.
- Still open from the audit: no LICENSE at repo root; runtime data
  growing in git; no synthetic /api/ask canary. Grouped-list pattern
  (item 127) queued for the post-midterms frontend round.

## Consolidation note — 2026-10-28 (nightly pass)
- PRE-CACHE CRASH ROOT-CAUSED + FIXED 2026-10-27: repeated IncompleteRead crashes fetching /api/files were NOT a site fault — Python urllib from this VM truncates the 8,209 B listing intermittently (1 of 3 test reads cut at 3,174 B) while curl succeeds 100%. FIX in ~/workspace/study-hub-cache/precache.py: fetch via curl subprocess first (urllib + `Connection: close` fallback); generate() retries twice. Post-fix validation clean.
- CACHE AUDIT + ORPHAN CLEANUP 2026-10-27 (at Abdul Wahid's order "aik dafa dobara check kro" then "kr do saaf"): independent audit found 55 PDFs, 165 expected caches, 0 missing, 0 empty, 166 present = exactly 1 orphan — `ai-cache/5th_Semester_Web_Technologies_Lectures_CSS_Cascading_Box_Model_and_Positioning_pdf.json` (old "Web Technologies" folder name). Deleted via GitHub; verified after: ai-cache = exactly 165 files. Sweeps from 06:43 PKT 27 Oct onward report cached_present=165 (earlier 166 readings predate the deletion). The surviving `5th_Semester_WEB_Lectures_CSS_...` Box_Model caches are the CURRENT file's legitimate 3 — do not confuse the two names again.
- "Request a Material" form check 2026-10-27 08:46: NO new responses (only Abdul Ahad's 25 Oct DAA request, already closed).
- CONTENT STATE 2026-10-28: 55 files, 165 caches exactly, 0 missing.

## Consolidation note — 2026-10-27 (nightly pass)
- LOGO FINALIZED 2026-10-26: "Book Stack" (3 stacked books, sage/cream/sage + gold spark, deep-green #004741 rounded tile) after 4 preview rounds (37 concepts; his taste: geometric, layered/node marks). Master: ~/workspace/your_files/study-hub-logo.svg (pixel-verified identical to approved render). Swap Phase A + B DONE + live-verified: logo.svg + favicon.svg replaced (old favicon was an "FA" mark), headers → logo.svg, manifest icons (icon-192/512 + maskable), logo.png/icon PNGs/apple-touch-icon + rebuilt banner.jpg uploaded via /api/upload, og/twitter → logo.png, logo.jpeg DELETED (live 404), sw cache → v28. SVG-first per his instruction: SVG everywhere platforms allow; PNGs only where SVG is unsupported (share crawlers, iOS touch icon, install icons).
- HEADER/HERO ROUND 2026-10-27 ~00:12–00:25, shipped + live-verified: display font Anton → **Archivo Black** (his pick #2 of 12 previewed fonts; hero clamp(1.9rem, 6vw, 2.6rem), small screens 2.05rem; font links added to privacy/terms); headers now use FULL-BLEED logo-full.svg (tile fills frame; .app-logo got #004741 backing — he objected to the white margin); visible "STUDY HUB" wordmark text REMOVED from all headers (logo only; sr-only h1 remains for SEO); hero title "Your Centralized Study Hub" → **"Study Hub - FA24 BAI"** (his exact wording). CSS ?v=35, sw cache v30 (precaches /logo-full.svg + style.css?v=35). The 1200×630 og-card.jpg experiment was installed 2026-10-26 ~23:21 then REVERTED at his instruction and DELETED — share image is now simply logo.png, not the big card.
- CONTENT STATE 2026-10-27: 55 files, 166 AI caches. DAA Lectures 1, 9, 10 FULLY COVERED (Lecture 09/10 PDF uploaded 2026-10-26 ~17:09; Lecture 01 PDF converted from a friend's PPTX and uploaded ~21:38, PPTX deleted from repo) — Abdul Ahad Siddiqui's 25 Oct "Request a Material" (Lec 1, 9, 10) is CLOSED; the prepared ask to Mr. Bilal Bukhari is now MOOT, do not send it. Duplicate-upload check 2026-10-26 ~23:11: the 3 DAA topic decks were already on the hub, no re-upload done.
- WHATSAPP PREVIEW: site side verified correct (WhatsApp-UA fetch 200, full OG set, og-card/logo 200) but previews do not render in this bridged chat; decisive test (send in a normal WhatsApp chat, pause 2–3 s) still PENDING on his side — not a site defect, do not re-change OG tags for it.
- OPS LESSONS (2026-10-27 round): re-fetch fresh copies via GitHub Contents API immediately before editing (stale local copies nearly reverted the logo edits; raw.githubusercontent.com is too stale to trust for edits); split large multi-file pushes (an 85 KB style.css + HTML push failed "Argument list too long").
- Still open from the audit: no LICENSE at repo root; runtime data growing in git; no synthetic /api/ask canary. Grouped-list pattern (item 127) queued for the post-midterms frontend round.

## Consolidation note — 2026-10-26 (founding nightly pass)
- Drift acknowledged, not re-verified tonight: the 2026-10-24 audit's unrecorded items (Groq fallback in api/ask.js; tap-to-answer quizzes, Bookmarks/Saved view, WhatsApp share, midterm countdown, global search with `/` shortcut, deep links; SEO files sitemap.xml/robots.txt/llms.txt) remain unfiled in the main narrative above — fold them into the next Study Hub round's notes rather than rewriting this file's history.
- Still open from the audit: no LICENSE at repo root; runtime data (ai-cache/, feedback/, counts.json, notices.json) growing in git; no synthetic /api/ask canary. Grouped-list pattern (saved-references item 127) is the queued next-frontend-round item.
- Live: https://fa24-bai.vercel.app (repo abduIwahid/fa24-bai). GSC verified 2026-10-24 via HTML meta tag in index.html — must stay. Sitemap submissions + Bing import still pending (see MASTER-PLAN.md).

## Consolidation note — 2026-10-30 (nightly pass)
- FILE COUNT SETTLED AT 68: the 68-vs-63 gap flagged 29 Oct is resolved — 68 = 63 after the icon cleanup + 3 WEB lectures + OS Lab Mid paper + PAI Lab Mid paper. Every pre-cache sweep 29 Oct and 30 Oct 00:13/00:43 confirms files=68, pdfs=68, cached_present=204, 0 to generate. Quote 68, not 63.
- WORDMARK FONT FIX (css v40, SW v37): Archivo Black set directly on `.site-wordmark .wm-line` (the `*` font rule beat inheritance) — pushed + verified on main ~22:11 PKT 28 Oct; live deployment was still queued at flush and is NOT confirmed in the notes — verify live before quoting v40 as live.
- LOGO AUDIT (item 183) RUN + PASSED 28 Oct ~22:15 at his "han": crisp 32px+, one-colour silhouette / grayscale / white-on-dark / dark-background pass; 16px partial only. Simplified favicon-only variant offered, NOT built.
- fa24-bai README refreshed 28 Oct ~22:25 (Hub repo only): static files.json architecture, /api/count row deleted, real cache policy, Archivo Black + Helvetica, Groq fallback + GROQ_API_KEY row, Books + exam papers in Course Explorer.
- "Vercel Upload" PAT EXPIRED ~30 Oct 00:12 PKT (29 Oct Gmail summary) — next upload is the test of whether files.json sync still works; verify before trusting the list after any upload.
- "Request a Material" check 29 Oct 08:46: no new responses (only Abdul Ahad's closed 25 Oct request).

## 2026-10-31 nightly consolidation note (30 Oct close-out)
- "Vercel Upload" PAT REGENERATED by Abdul Wahid 30 Oct (fa24-bai ONLY, Contents Read + Write, 1-year expiry); Vercel GITHUB_TOKEN updated + fa24-bai redeployed by him; site verified live post-redeploy (homepage 200, /api/files normal). Upload test VERIFIED end-to-end: vault admin sign-in worked automatically, "Upload successful!", test files deleted via connector (create_or_update_file is the reliable route), files.json re-synced to 68, live list confirmed back at 68 with no test entries. Old "password in chat" upload workflow retired — admin-panel route with vault login is now the way.
- NEW BUGS (fix AFTER midterms): admin Delete button fails silently (no dialog/message/deletion); file list takes ~5 minutes to show a new upload (caused 2 duplicate test copies during the test).
- Pre-cache all day 30 Oct + 31 Oct 00:13/00:43: files=68, pdfs=68, cached_present=210, 0 generated (brief files=70 reading at 06:45 was the two test files, cleaned the same morning). "Request a Material" check 30 Oct 08:46: no new responses.

## 2026-11-01 nightly consolidation note
- DOWNLOADS ROUND SHIPPED 31 Oct ~23:53 → 1 Nov ~00:40 (his orders): per-file Download in ⋮ menu (api/download.js) + folder Download All ZIP (api/download-zip.js, JSZip STORE, max 60 files); confirm dialog (compact, inline-styled after phone-cache poisoning — css v44 / script.js v27 / SW v41, commit 712ffc2); progress card with %, MB, Cancel (script.js v28 / SW v42); gzip defect fixed via Content-Encoding: identity + Cache-Control: no-transform (commit 1d29829); sizes for all 69 files.json entries + Downloaded badges via localStorage fa24bai-downloaded-v1 + exactly-proportional bar (script.js v29 / SW v43, commits 4a10e7e/071f684/29153c3). Live /api/files = 69/69 with size; script.js?v=29 → 200. PENDING: browser click-through of the sizes/badges round + owed WhatsApp completion report.
- PAI Complete Notes (Python to Machine Learning, 64 pp) live in 5th Semester/PfAI/Notes/ (new folder); spaced-path duplicate created then deleted repo-side (commit 5586faf); live list = 69 entries. Admin-UI Delete silent-fail bug re-confirmed (could not remove the duplicate).
- CONVENTIONS: push versioned assets BEFORE the index.html/sw.js referencing them (/css, /js immutable-cached 1 year); keep each GitHub connector push call under the ~128 KB --arguments-json ceiling.
- Pre-cache 1 Nov 00:43: files=69, pdfs=69, cached_present=213, 0 to generate.

## 2026-11-02 consolidation note (nightly pass)
- Downloads round fully verified 1 Nov ~00:41: click-through PASSED all 5 checks (CDF "178 KB" label, dialog size text, Downloaded badge appears + persists after reload, DAA ZIP dialog "~9.4 MB" cancelled); live line script.js v29 / SW v43 / css v44; consolidated report delivered to WhatsApp chat (#34 CLOSED).
- Statistics Central Tendency Handwritten Notes uploaded 1 Nov ~21:31 (21.8 MB, 25 pp) via GitHub web with the newly vault-saved GitHub login (2FA Mobile approval number 92) into `5th Semester/Statistics/Notes/` (commit 6badfa0); files.json entry added (size 21818253) → 70 entries; pre-cache generated its 3 caches (216 present by 22:13).
- OG card: HF hosting (commit 1609fff) SUPERSEDED — HF resolve answers 307, which WhatsApp's preview fetcher drops. Same-domain og-card.jpg uploaded to repo root (commit 7f7d847), meta repointed (commit fd70912), live-verified direct 200 image/jpeg 62,693 B. LESSON: og:image must be a direct, redirect-free URL, ideally same-domain.
- Link-preview diagnosis CLOSED 1 Nov ~21:47 as DEVICE-SIDE: his phone showed no preview for ANY site (Study Hub, ?v=3, portfolio, YouTube, www variant) while server-side checks as WhatsApp's fetcher show 200 + full OG tags. Troubleshooting given; outcome pending on his side. Do NOT re-change OG tags for this.
- "Request a Material" check 1 Nov 08:46: no new responses. Pre-cache 2 Nov 00:13 + 00:43: files=70, 216 caches, 0 to generate — routine.

## 2026-11-06 consolidation note (nightly pass — covers 3–5 Nov)
- STATE STEADY: still 70 files, 216 AI caches; every pre-cache sweep 3–5 Nov silent success (0 generated, 0 failed). "Request a Material" checks 3/4/5 Nov 08:46: no new responses (only the 25 Oct Abdul Ahad Siddiqui request).
- NOTICES: PAI examDate 2026-11-04 → 2026-11-12 in notices.json (commit cbb2626, 2 Nov) after the PAI move; all six exam dates live-verified correct (KRR 11-05, DAA 11-06, OS 11-07, Stats 11-07, Web 11-10, PAI 11-12).
- **ANNA FOUNDING BUILDER PROGRAM — INVITED 5 Nov 14:21 PKT:** email from Isabel at anna.partners inviting the Study Hub by name (course portal, summaries, quizzes, viva questions) to the Anna Founding Builder Program: $80,000 total monthly pool, grants by usage tier; first tier (200+ monthly users) = $50/month. Founding Builder qualification deadline **30 Nov 2026**. Earning anything would mean publishing the Hub as an Anna app — possibly a rebuild/migration off Vercel + Supabase. DECISION DEFERRED to after his last midterm (12 Nov), NOT a quick win. Draft reply ready but NOT SENT (yes to a quick overview, notes midterm week until 12 Nov, asks as-is vs migrate; commits nothing) — sending awaits his go-ahead. See MASTER-PLAN §5.
- POST-MIDTERMS QUEUE (unchanged): frontend round (item 127 grouped lists + LICENSE + canary), admin Delete silent-fail bug, ~5-min list lag after upload.
