# Crystal Seed Tarot — Full Revamp Master Plan

> **Purpose.** This is the hand-off document for rebuilding crystalseedtarot.com. It is written so a future session (or several) can pick up any single section and execute it without re-auditing. Every finding carries a receipt (file:line, live URL, or measured number). Nothing in here has been shipped to production — it is a plan, plus three deployed *demo* reimaginings to shop from (see §10).
>
> **Author:** Kit · **Date:** 2026-07-15 · **Evidence base:** live crawl (14 pages), PSI mobile+desktop, Playwright mobile crawl at 390px, `dig` email-auth, full source read of the repo. Companion SEO evidence: `seo/audits/2026-07-15/AUDIT.md`.
>
> **How to use this doc.** Sections §3–§8 are the audit (holes, vulns, UI, mobile, SEO, perf). §9 is the phased build roadmap. §10 is the three demos. §11 is the short list of things only Russ/Holly can decide. Start a session by reading §9, pick a phase, and each phase links back to the receipts it acts on.

---

## 1. Current state snapshot

| Attribute | Value | Source |
|---|---|---|
| Stack | Next.js 14.2.35 (App Router) + Tailwind + Radix UI, Contentful blog, deployed on Vercel, DNS/proxy via Cloudflare | `package.json`, response headers |
| Pages | 8 routes: `/`, `/about`, `/services`, `/events`, `/gallery`, `/reviews`, `/blog` (+ `/blog/[slug]`), `/contact` (+ `/thank-you`) | `app/` tree, sitemap.xml |
| Provenance | Built on v0.dev (`<meta name="generator" content="v0.dev">`), `package.json name` still `my-v0-project` | homepage `<head>`, `package.json:2` |
| PSI mobile | **perf 88, a11y 93, SEO 92, best-practices 100**; LCP **3.7s**, CLS 0.004, TBT 0 | `seo/audits/2026-07-15/psi-*.json` |
| PSI desktop | perf 99; LCP 0.5s | same |
| Design language | Static nebula background image + frosted-glass cards, serif headings, purple hover glows; **zero motion**, nothing tarot-specific | Playwright mobile crawl (390px), this session |
| Business facts | Holly, reading since 2008; Portland OR + Vancouver WA; phone **(541) 635-2278**; crystalseedtarot@gmail.com; pays via Apple Pay/Venmo/PayPal/Facebook Pay/CC/Cash | live pages, this session |

**One-line verdict:** technically clean foundation (the 2026-07-03 SEO pass fixed schema/canonicals/titles/sitemap to 100%) sitting under a generic, motionless template with thin content, no social-share images, a mobile LCP problem, and a handful of real security/trust holes. High ceiling, currently unrealized.

---

## 2. What is genuinely good (keep, don't break)

- **Real, deep social proof.** The `/reviews` page holds dozens of authentic, dated, named client reviews — many with Holly's personal replies (Elizabeth S. 10/4/25, Cason W., Arin C., Gina G., Deanna P., Brittney L. …). This is the single most valuable asset on the site and it is currently under-used.
- **Rich service + pricing content.** `/services` (1,598 words) and `/events` (2,293 words) are detailed and specific, including the distinctive **"Rent-a-Witch"** spell/ritual offering.
- **Strong authentic voice.** Holly's `/about` bio is specific and human (crystals, Reiki, "natural/eclectic witch," legal background → trauma understanding). Do not sand this down.
- **Legitimacy badges.** Thumbtack Top Pro 2025 + GigSalad Top Performer are real, earned trust signals.
- **Technical SEO base.** Canonicals, LocalBusiness/Person JSON-LD, unique titles/descriptions, sitemap, robots all present and correct.

---

## 3. HOLES (functional, content, trust — not security)

| # | Hole | Receipt | Severity | Fix summary |
|---|---|---|---|---|
| H1 | **Fake testimonials on the homepage.** "Sarah M.", "Michael R.", "Jennifer K." are hardcoded placeholder quotes rendered as real client testimonials — while dozens of *real* reviews sit one page over. | `app/page.tsx:64-80` | **High (trust/integrity)** | Replace with 3 real reviews from `/reviews`, pulled from the same source. |
| H2 | **Thin cornerstone pages.** home 260w, about 321w, gallery 116w, contact 62w. Too little to rank or for AI answer-extraction. | crawl wordcounts, `summary.json` | High (SEO+UX) | Expand in Holly's voice; see §7 CONTENT-01 and §9 Phase 3. |
| H3 | **`/reviews` is a 26,934px unpaginated wall** (~32 phone screens). Best asset, punishing delivery: no filter, no search, no "load more", no category (weddings / parties / corporate / lessons). | Playwright fullpage height, `/reviews` | High (UX/CRO) | Paginate or lazy-load; add filter chips by event type; surface a rotating subset on money pages. |
| H4 | **No reviews on money pages.** `/services` and `/contact` (the booking surfaces) carry zero social proof; a visitor deciding to book never sees a testimonial there. | `/services`, `/contact` source | High (conversion) | Inject 2–3 relevant reviews into services + contact. |
| H5 | **Weak primary CTA path.** Only CTA is "Check Availability" → `/contact` form. No phone-tap CTA above the fold (phone exists!), no calendar/booking link, no pricing-anchored CTA. | `app/page.tsx:121`, `/contact` | High (conversion) | Add tap-to-call + tap-to-text; consider embedded scheduling (see §11 D3). |
| H6 | **`sixteen years` vs `since 2008` inconsistency.** About says "sixteen years"; home says "since 2008" (which is 18y in 2026). | `/about` copy vs `/page.tsx:94` | Low | Pick one; recommend "since 2008" + auto-computed years. |
| H7 | **Holly Nicole vs Holly Cole naming split.** Schema/about = "Holly Nicole"; blog author + some reviews = "Holly Cole". Entity-signal dilution. | schema graph vs blog author fields | Medium (SEO entity) | Pick one public name, make consistent. **Russ/Holly decision (§11).** |
| H8 | **Gallery images lazy-load with grey flash, no blur-up.** All 12 gallery `<img>` are `loading="lazy"` including above-the-fold; users see grey boxes until scroll. (Verified NOT broken — 12/12 load on scroll.) | Playwright image-state check | Low | `priority`/eager first row; add blur placeholders. |
| H9 | **favicon.ico 404 + `/cdn-cgi/l/email-protection` 404.** No tab/bookmark icon; Cloudflare email-obfuscation link 404s for crawlers. | console error; crawl `broken:1` | Low | Add favicon set; disable CF email obfuscation or ignore. |
| H10 | **Contact form has no visible success/failure state contract in-page** beyond redirect to `/thank-you`; FormSubmit.co dependency (per CSP) means a silent third-party failure path. | `middleware.ts:20` CSP `connect-src formsubmit.co`; `/contact` | Medium | Verify submission path end-to-end; add inline error handling. |
| **H11** | **Every "Upcoming Event" is in the past — shown as bookable.** All 10 hardcoded events are past-dated (latest `2026-06-07`, oldest `2021-03-08`; today is 2026-07-15). Page titled "Upcoming Events" with live "Register for Course"/"Book a festival reading" CTAs. The empty-state fallback never fires because the array is non-empty. **Co-top-priority with H1** — a returning visitor sees a stale, misleading page. | `app/events/page.tsx:42-133,156,161` (verified) | **High (trust/correctness)** | Move to a dated/CMS-driven events source, or split "Past events" from "Upcoming"; auto-hide past dates. |
| **H12** | **`/thank-you` is an orphaned, unreachable page.** Zero references anywhere (verified); the contact form handles success inline (`setSubmitted(true)`). Leftover from an earlier redirect-based form. Still publicly indexable. | `app/thank-you/page.tsx`; grep = 0 refs | Low | Delete, or wire it as the real post-submit destination. |
| **H13** | **Duplicate `<h1>` on blog posts + inverted heading hierarchy on events.** Blog renders post title as `<h1>` (`:122`) AND markdown `# ` → `<h1>` (`:154`); if posts start with `# Title` (the CMS convention shown in fallback data) every post has two H1s. Events maps markdown h1→`<h3>` (`:216-218`), collapsing H1/H3 to one tag. | `app/blog/[slug]/page.tsx:122,154`; `app/events/page.tsx:216-218` | Medium (SEO/a11y) | One H1 per page; fix markdown→heading mapping. |
| **H14** | **Silent failures on contact submit.** The fire-and-forget `/api/subscribe` write swallows all errors (`.catch(()=>{})`) so a failed mailing-list add is invisible; on hard failure a native `alert("Error: "+message)` shows raw third-party error text. | `app/contact/page.tsx:99-104,110-112` | Medium | Surface failures; replace `alert()` with inline UI. |

---

## 4. VULNERABILITIES (security — the Opus-fixable list)

> Ordered by severity. Each is scoped small enough to hand to an Opus session as a discrete fix with a verification step. None require a rebuild.

### V1 — Fail-open cron authentication · **HIGH**
`app/api/cron/scan/route.ts:6-13`. `verifyCron` returns `true` when `CRON_SECRET` is unset:
```ts
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) return false;
return true;   // <-- no secret set => everyone authorized
```
This endpoint (`GET /api/cron/scan`) reads **Holly's entire Gmail inbox**, classifies senders with Claude, and writes contacts to a Google Sheet. If `CRON_SECRET` is ever missing/empty in the Vercel env, anyone on the internet can trigger a full inbox scrape + sheet writes.
**Fix:** fail *closed* — if `!cronSecret` return 401. Verify the env var is set in Vercel prod. Add a constant-time compare. **Verification:** curl the endpoint without the header → expect 401.

### V2 — `rehype-raw` without sanitization (stored-XSS surface) · **MEDIUM**
`app/blog/[slug]/page.tsx:151` and `app/events/page.tsx:213` render markdown with `rehypePlugins={[rehypeRaw]}`. `rehype-raw` re-enables raw HTML embedded in markdown, bypassing react-markdown's default HTML escaping. Blog/events content comes from Contentful (authored by Holly, trusted → not actively exploitable today). But it is a defense-in-depth gap: a compromised Contentful token or a future multi-author setup makes `<script>`/`<img onerror>` in a post executable.
**Fix:** add `rehype-sanitize` after `rehype-raw`, or drop `rehype-raw` if raw HTML isn't needed. **Verification:** put `<img src=x onerror=alert(1)>` in a draft field → confirm it renders inert.

### V3 — Build ignores TypeScript + ESLint errors · **MEDIUM (latent-bug amplifier)**
`next.config.mjs:10-15`: `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. Type/lint errors ship to prod silently. This is the v0.dev default and it is how real bugs reach users unnoticed.
**Fix:** flip both to `false`, run `next build`, fix what surfaces. **Verification:** clean build with checks on. (Do this early in any revamp — it will surface other latent issues.)

### V4 — Newsletter subscribe: origin bypass + no rate limiting · **MEDIUM**
`app/api/subscribe/route.ts:36` gates on `allowedOrigins.some(o => origin.startsWith(o))`. `startsWith` matches `https://crystalseedtarot.com.evil.com`. There is also **no rate limiting / CAPTCHA / honeypot**, and the handler appends directly to a Google Sheet, so an attacker can flood/poison Holly's contact list. (Handler always returns `{ok:true}`, so failures are invisible.)
**Fix:** exact-match origin (`allowedOrigins.includes(origin)`), add a honeypot field + basic rate limit (e.g. Upstash/edge KV or a per-IP token). **Verification:** spoofed-origin request rejected; rapid repeats throttled.

### V5 — CSP allows `unsafe-inline` + `unsafe-eval`; not applied to `/api` · **LOW-MEDIUM**
`middleware.ts:14` `script-src 'self' 'unsafe-inline' 'unsafe-eval' …`; matcher `middleware.ts:41` excludes `api/`. `unsafe-eval`/`unsafe-inline` defeat much of CSP's XSS value.
**Fix:** move to nonce-based script CSP (Next supports it), drop `unsafe-eval` if no dependency needs it. Low priority relative to V1–V4. **Verification:** CSP report-only run first, then enforce.

### V6 — Dependency vulnerabilities · **LOW (mostly transitive/build-time)**
`npm audit`: 12 vulns (7 high, 5 moderate) — postcss, qs, yaml, etc., largely transitive build deps. Next 14.2.35 *is* patched for the middleware-auth-bypass CVE class (CVE-2025-29927, fixed 14.2.25+), so no emergency there.
**Fix:** `npm audit fix` (non-breaking) clears most; defer the Next major bump. **Verification:** re-run `npm audit`.

### V7 — Debug component in the component tree · **LOW**
`components/debugImage.tsx` exists in the shipped components dir. Confirm it is not imported into any prod route; delete if orphaned. (Static-audit agent to confirm import graph.)

### V8 — Minor hardening (batch these) · **LOW**
- **Timing-unsafe secret compare** `app/api/generate-footer/route.ts:9` (`secret !== expectedSecret`) — use `crypto.timingSafeEqual`. That secret (`UNSUBSCRIBE_SECRET`) mints unsubscribe tokens for *any* email, so it's worth hardening.
- **Missing security headers** — no `X-Frame-Options`/`frame-ancestors` (clickjacking on the contact form), no `X-Content-Type-Options: nosniff`. Add in `middleware.ts`/`next.config`.
- **Contact form disables its own captcha** `app/contact/page.tsx:63` (`_captcha:'false'`) with client-only zod validation — combined with V4 (no app-level rate limit) the whole inbound path is unthrottled. Pairs with the V4 fix.
- **`generator: "v0.dev"` leaked** `app/layout.tsx:29` — discloses scaffolding tool in page source. Cosmetic; remove.
- **Unsubscribe is a state-changing GET with no throttle** `app/api/unsubscribe/route.ts` — link-prefetchers/scanners (SafeLinks, corporate AV) can trigger real unsubscribes. Add a confirm step or POST.

**Env-hygiene note (not a code change):** the repo has broad API keys in local env names (Anthropic, OpenAI, Azure, DeepSeek, SiliconFlow, Google service account, Gmail OAuth). `.env*` are correctly gitignored and confirmed NOT tracked (`git ls-files` → only `.example` files; verified twice). Secrets are server-only (no `NEXT_PUBLIC_` prefix), so nothing leaks into the client bundle. Keep it that way; rotate anything ever pasted into a shared surface.

---

## 5. UI / UX improvement opportunities

**Design-language level (the big lever).** The current site is a competent but anonymous dark template: one static background, frosted cards, serif type, and hover glows that *do nothing on touch*. It could be any wellness business. A tarot practice with Holly's voice and this much real proof deserves a design with a point of view. This is exactly what the three demos in §10 explore.

Concrete, page-level opportunities (independent of which demo direction wins):

1. **Turn the hover-glow interactions into touch-first ones.** Every `hover:scale-105 hover:shadow-purple-500/30` on the homepage is dead on mobile (the majority of traffic for a local service business). Replace with scroll-reveal, tap-state feedback, and motion that plays without a pointer. (`app/page.tsx` cards, services, testimonials.)
2. **Give the hero a job beyond a static image.** Right now it's a photo + heading + one button. Options: an animated card-shuffle/draw, a subtle living background, a "pick a card" micro-interaction that seeds engagement in the first 3 seconds.
3. **Elevate "Rent-a-Witch" out of the `/services` body.** It's a genuine differentiator buried in a 1,598-word page. Give it a named section/card with its own visual identity.
4. **Reviews as a designed system, not a scroll.** Filter chips (Weddings · Parties · Corporate · Lessons · In-home), a featured/rotating rail on money pages, star + date + context per card, Holly's replies styled as replies.
5. **Pricing clarity + CTA hierarchy.** Anchor each service to a price and a single obvious next action (book / call / text). Add a persistent, thumb-reachable CTA on mobile.
6. **Trust bar.** Badges + "16 years / since 2008" + "read at Widen+Kennedy, PSU, U of O Law" + review count, as a compact credibility strip near the top.
7. **Photography treatment.** Holly's real event photos are strong; a consistent duotone/grade + generous framing would lift the whole site over the current mixed-treatment grid.
8. **Accessibility polish** (a11y is 93, close to great): ensure focus-visible states, 44px minimum tap targets (several text links are 36–40px — `app/page.tsx` "Read more" links), form labels tied to inputs, prefers-reduced-motion honored by any new animation.

---

## 6. NOVEL mobile-engagement plays (the creative ask)

> The brief: maximize engagement + functionality on mobile, with a *few novel* ideas. These are tarot-native, thumb-native, and progressive-enhancement-safe (they degrade to the static site if JS/motion is off). Ranked by impact-to-effort. The demos in §10 each prototype a subset.

**M1 — "Card of the Day" pull (the hook).** A face-down card in the hero the visitor taps to flip (3D CSS transform) and receive a short, warm daily message + a soft CTA ("Want the full story? Book a reading"). Zero backend: a deterministic card-of-the-day keyed to the date. This is the novel front-door — it turns a passive homepage into a 3-second interaction and gives a reason to return daily. Haptic tap feedback via `navigator.vibrate` on supported devices.

**M2 — Swipeable review deck.** Reframe the best reviews as a horizontally-swipeable stack of "cards" (tarot metaphor doubling as UI). Thumb-flick through proof. Each card: quote + name + event type + date. Solves H3/H4 (proof on money pages) with an interaction that *is* the brand.

**M3 — Thumb-zone sticky action bar.** A bottom-fixed, safe-area-aware bar on mobile with **Call · Text · Book** — always one thumb-tap from converting, using the real phone (541-635-2278) and `sms:`/`tel:` deep links. This is the single highest-conversion mobile add and costs almost nothing.

**M4 — "Which reading is right for me?" mini-quiz.** 3 taps (occasion → group size → in-person/virtual) → recommends a service + price + pre-fills the contact form. Turns the 62-word contact page into a guided funnel. Novel, on-brand (a reading *about* which reading), and it captures intent.

**M5 — Scroll-reactive ambient background.** The nebula/candlelight background responds subtly to scroll and device tilt (`deviceorientation`, permission-gated) — depth without a heavy WebGL cost. Makes the whole site feel alive in the hand. Must honor `prefers-reduced-motion`.

**M6 — Haptic + sound "shuffle" on section enter.** Optional, muted-by-default ambient shuffle/chime as key sections reveal, with a persistent mute toggle. Sensory, but strictly opt-in (a11y + autoplay policy).

**M7 — Add-to-homescreen PWA.** Installable, with the Card-of-the-Day as the reason to keep it on the home screen. Offline-cache the core pages. Turns a brochure site into a returning-visitor surface.

**M8 — Share-a-card.** After a Card-of-the-Day pull, one tap generates a shareable image (canvas) for Instagram/iMessage — organic reach loop, and it fixes the og:image gap by making sharing intentional.

*Guardrails for all of the above: progressive enhancement (works with JS off), `prefers-reduced-motion` respected, no autoplay audio, permission-gated sensors, tap targets ≥44px, and nothing that pushes LCP past the hero image.*

---

## 7. SEO / GEO action plan (audit-only; nothing shipped)

Full evidence + scorecard in `seo/audits/2026-07-15/AUDIT.md`. Overall ~63/100 (C+). The this-week set:

1. **og:image on all 8 pages** (SOCIAL-01) — currently 0%; every shared link renders blank. Per-page `openGraph.images` in each `metadata` export. *AUTO.*
2. **Confirm/create Google Business Profile** (LOCAL-01) — #1 local lever, still unconfirmed since 7/3. *Needs Holly.*
3. **Add DMARC record** (EMAIL-01) — `dig _dmarc` returns none; deliverability + spoofing risk. Start `p=none` monitor. *Russ/DNS.*
4. **Ship llms.txt** (GEO-01) — none present; AI answer engines can't cite CST cleanly. *AUTO.*
5. **Expand 4 thin pages** (CONTENT-01) — home/about/gallery/contact. *DRAFT (Holly voice).*
6. **Fix mobile LCP 3.7s** (PERF-01) — hero image is the bottleneck; see §8. *AUTO.*
7. **FAQ + speakable schema** (GEO-02/VOICE-01) — for AI answer boxes + voice. *AUTO.*
8. **Service × city landing pages** (CONTENT-02) — "tarot reader Portland", "party tarot Vancouver WA". *DRAFT.*

Housekeeping: broken `/cdn-cgi/l/email-protection`, favicon 404, link the Thumbtack badge to its profile. Carried decisions: Holly Nicole vs Cole naming (H7), GBP, GSC verification (russ@generuss.com).

---

## 8. Performance plan

- **Mobile LCP 3.7s** is the headline (desktop is 0.5s / perf 99). LCP element = hero `hero-shuffle.webp` at `quality={60}`, `priority`, preloaded — but still slow on throttled mobile. Levers: serve a smaller mobile-specific hero crop, drop initial dimensions, consider an LQIP/blur-up, and ensure the hero isn't competing with the badge images for bandwidth.
- **Unused CSS/JS ~150ms each** (PSI opportunities) — Tailwind purge is on, but Radix + the full component set add weight; tree-shake unused UI components (50 files in `components/ui/`, most unused).
- **Image source weight: 31MB in `public/images/`**, several 2–6MB raw PNGs (`Blog-Banner-Moon.png` 6.2MB, Events PNGs 2.8–3.8MB). Convert PNG→WebP/AVIF at source; Next optimizes on serve but source bloat slows builds and any un-optimized reference.
- **CLS is already excellent** (0.004 mobile). Protect it: reserve space for any new animated/injected elements.

Target after fixes: mobile perf 95+, LCP <2.5s.

---

## 9. Phased build roadmap (for future sessions)

> Dependency-ordered. Each phase is a self-contained session. "Gate" = a Russ/Holly decision that must land first (see §11).

**Phase 0 — Decide direction (Russ/Holly, §11).** Pick a demo from §10 (or "keep current + fix"), settle Holly Nicole vs Cole, confirm GBP, decide booking mechanism. *Blocks the visual rebuild but NOT the security/SEO fixes.*

**Phase 1 — Security + integrity hotfixes (no design dependency; do first).** V1 (fail-open cron), V3 (build checks on), V2 (rehype-sanitize), V4 (subscribe origin+rate-limit), H1 (kill fake testimonials → real). One Opus session, ~half a day, all verifiable. Ship to prod on `dev`→`main` per repo convention.

**Phase 2 — SEO/GEO quick wins (no design dependency).** og:images, llms.txt, FAQ+speakable schema, favicon, DMARC (Russ applies), badge link. Fold into Phase 1's deploy or a second small session.

**Phase 3 — Content expansion (Holly-voiced, drafts first).** Expand home/about/gallery/contact; write 2–3 service×city pages; restructure `/reviews` (pagination + filter chips). Drafts to Holly, never auto-published.

**Phase 4 — The visual rebuild (the chosen §10 direction).** Rebuild on the picked stack. Mobile-first. Bring across all fixes from Phases 1–3. Carry the M-plays (§6) that fit the direction: M3 (sticky action bar) and M2 (swipe reviews) are direction-agnostic and should ship regardless.

**Phase 5 — Novel engagement layer.** Card-of-the-Day (M1), quiz funnel (M4), PWA (M7), share-a-card (M8) — layered on progressively.

**Phase 6 — QA + launch.** Cross-device, a11y, Lighthouse, form end-to-end, redirect map (preserve all 8 existing URLs + blog slugs → no SEO loss), then cutover. `rules/deploy-target-verification.md` applies at every deploy.

---

## 10. The three reimagined demos (shop these)

Built sequentially, "caterpillar" style — each is a complete, deployed, mobile-first single-page reimagining using the **same copy and images** (see `_shared/content.json`), differing in design language + animation tech + engagement approach. URLs, stacks, and the specific novel plays each one prototypes are filled in as they ship (see §10 table at the end of the build). Workspace: `/Users/studio/Build/crystal-seed-reimagined/`.

- **Variant A — "Candlelit" (CSS-native / performance-first).** Astro + Tailwind, pure-CSS scroll-driven animation + View Transitions, no JS animation library. The elegant, fast, accessible baseline. Prototypes M2 (swipe reviews) + M3 (sticky bar).
- **Variant B — "Cinematic" (GSAP / motion-first).** Astro + GSAP ScrollTrigger: parallax layers, pinned scenes, a card-fan reveal. The dramatic, editorial direction. Prototypes M1 (card-of-the-day flip) + M5 (scroll-reactive bg).
- **Variant C — "Mystic" (WebGL / immersive).** Astro + a lightweight WebGL layer (OGL/Three) + Motion: a living nebula shader, an interactive card draw, tilt parallax, haptics. The showstopper. Prototypes M1 + M4 (quiz) + M6 (haptics).

*(This section is updated with live URLs at build close.)*

---

## 11. Open decisions (only Russ/Holly can make these)

- **D1 — Public name:** "Holly Nicole" or "Holly Cole"? (Entity-consistency; currently split.)
- **D2 — Google Business Profile:** does one exist? If not, creating it is the biggest single local-SEO win available.
- **D3 — Booking mechanism:** keep the contact form, or add real scheduling (Calendly/Acuity/Square)? Changes the CTA design.
- **D4 — Direction:** which of the three demos (or "fix the current one")? Drives Phase 4.
- **D5 — Newsletter/Gmail-scan system:** is `api/cron/scan` still wanted? It auto-scrapes Holly's inbox into a Sheet. If yes, it must be secured (V1); if not, remove it and shrink the attack surface.
- **D6 — DMARC/DNS:** apply the DMARC record (text in the SEO audit)? Russ owns DNS.

---

---

# Depth Pass 1 — implementation-grade detail

> Goal of this pass: take every recommendation above from "what" to "how", with the specifics a builder needs. All findings here were independently verified this session (grep/line-checks) or by the static-audit agent and then spot-verified.

## 1a. The dead-code purge (do this before rebuilding — it shrinks the surface you carry forward)

This is a **v0.dev scaffold that never shed its boilerplate**. Verified import-graph facts:

- **47 of 50 files in `components/ui/` are never imported** — only `button.tsx`, `card.tsx`, `Navigation.tsx` are live (verified: grep of app/ + non-ui components returns only those three). Everything else (accordion, dialog, sidebar [23K], carousel, command, drawer, form, table, tabs, toast/toaster, tooltip, …) is dead.
- **~30 of ~45 dependencies are dead weight**: 24 of 25 `@radix-ui/react-*` (only `react-slot` is live via button.tsx), plus `cmdk`, `embla-carousel-react`, `input-otp`, `next-themes`, `nodemailer`, `react-day-picker`, `react-resizable-panels`, `vaul`, `sonner`.
- **Dead-but-wired systems:** `components/theme-provider.tsx` (never mounted), the entire toast stack (`toaster`→`use-toast`→`toast`→`sonner`, never mounted so any `toast()` is a silent no-op), `components/ClientImage.tsx`, `components/debugImage.tsx` (orphaned — confirmed 0 imports), `components/icons/BashIcon.tsx`, `ThumbTackIcon.tsx`.
- **Duplicate files:** `hooks/use-mobile.tsx` vs `components/ui/use-mobile.tsx`; `hooks/use-toast.ts` vs `components/ui/use-toast.ts` (byte-identical bar formatting).
- **Two `globals.css`:** `app/globals.css` is live (purple theme, imported at `layout.tsx:2`); `styles/globals.css` is orphaned (still the shadcn grayscale default). Delete the orphan.
- **Unused `crystal-*` Tailwind palette** (`tailwind.config.js:49-54`) — the UI uses `white/ black/ purple-500/` opacity utilities instead.
- **Orphaned image assets** in `public/images/`: `*_original.*`, `*-Old.*`, unused Banner/Blog-hero variants (~10+MB of the 31MB is unreferenced).

> **Note for the rebuild:** because the three demos (§10) start clean on Astro, this purge is moot *if* a demo direction wins. If instead Russ chooses "keep current + fix", the purge is Phase 1's first task and removes ~30 deps + 47 files with zero behavior change.

## 1b. Security fixes — concrete form

- **V1 (cron fail-closed):** change `verifyCron` to `if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) return false; return true;` and confirm `CRON_SECRET` set in Vercel prod. Also stop echoing contact emails in the JSON `log` (`:208,257`) — that's a PII leak if the endpoint is ever hit externally.
- **V2 (sanitize):** `rehypePlugins={[rehypeRaw, rehypeSanitize]}` (import from `rehype-sanitize`), or drop `rehypeRaw` if posts don't need raw HTML.
- **V4 (origin + throttle):** `allowedOrigins.includes(origin)` (exact), add a honeypot field to the form + a per-IP token-bucket (edge KV). Re-enable a captcha or a server-side check since `_captcha:false` is set.
- **V3 (build gates):** `ignoreDuringBuilds:false`, `ignoreBuildErrors:false`; there is **no eslint config file at all** in the repo, so add one (`next lint` scaffolds it). `tsconfig` is already `strict:true` but toothless while build errors are ignored.

## 1c. Per-variant animation technique (for §10 demos)

- **A "Candlelit" (CSS-native):** `animation-timeline: view()` + `scroll()` for scroll-driven reveals; CSS `@view-transition` for route/section morphs; a `@property`-driven candle-flicker gradient; `scroll-snap` for the review deck; container queries for the service grid. No JS animation lib → smallest bundle, best LCP, degrades perfectly.
- **B "Cinematic" (GSAP):** ScrollTrigger pinned scenes (hero → services → about), a `staggerFrom` card-fan on the services reveal, parallax layers on Holly's photos, `ScrollSmoother` (optional) for the editorial feel. Lazy-load GSAP after the hero to protect LCP.
- **C "Mystic" (WebGL):** OGL (≈8KB) nebula/starfield fragment shader as the living background, a draggable/tap-to-draw card with a Motion One flip, `deviceorientation` tilt-parallax (permission-gated), `navigator.vibrate` on the draw. Shader paused under `prefers-reduced-motion`; static WebP fallback if WebGL unavailable.

## 1d. Effort estimates (gut, and gut/50 per calibration)

| Work | Gut | Calibrated (gut/50) |
|---|---|---|
| Phase 1 security+integrity hotfixes | 3 days | ~1.5 hr |
| Phase 2 SEO/GEO quick wins | 2 days | ~1 hr |
| Phase 3 content expansion (Holly drafts) | 1 week | ~3 hr build (+ Holly's writing time) |
| Phase 4 visual rebuild (chosen variant → full 8-page port) | 3 weeks | ~9 hr |
| Phase 5 engagement layer | 1 week | ~3 hr |
| Dead-code purge (if keeping current) | 1 day | ~30 min |

---

# Depth Pass 2 — edge cases, URL preservation, risk register

## 2a. URL / redirect preservation map (do NOT lose SEO equity on cutover)

Every currently-indexed URL must resolve after any rebuild. The 7/3 SEO pass earned canonicals + schema; a careless rebuild throws that away.

| Existing URL | On rebuild | Note |
|---|---|---|
| `/`, `/about`, `/services`, `/events`, `/gallery`, `/reviews`, `/blog`, `/contact` | keep same paths | 1:1, no redirect needed |
| `/blog/[slug]` (5 live slugs in sitemap) | keep same paths | Contentful-driven; preserve slug scheme |
| `/thank-you` | keep or 301 → `/contact` | orphaned today (H12) |
| `/sitemap.xml`, `/robots.txt` | regenerate | must include all blog slugs (Contentful) |
| JSON-LD LocalBusiness/Person graph | carry across verbatim + extend | it's an entity signal; don't regress it |

Edge cases: keep the `crystalseedtarot.com` ↔ `www` behavior consistent; preserve the Cloudflare proxy; if moving off Vercel, replicate `next/image` optimization or pre-optimize assets.

## 2b. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Rebuild regresses the 7/3 SEO gains (schema/canonicals) | Med | High | §2a map; re-crawl before + after; diff schema |
| "Sixteen years" / name-split shipped inconsistently again | Med | Med | Resolve D1 first; single source in content pack |
| New animation pushes mobile LCP past 3.7s | Med | High | Lazy-load anim libs after hero; perf budget below |
| Contact/booking path silently breaks on cutover | Low | High | End-to-end test the form + a real test submission |
| Holly's voice lost in AI-expanded copy | Med | High | Drafts to Holly, never auto-publish (§9 Phase 3) |
| Events page stays stale post-launch | High | Med | Make events dated/CMS-driven so past events auto-hide (H11) |

## 2c. Hard budgets for the rebuild (gate the launch on these)

- Mobile Lighthouse: perf ≥95, a11y ≥95, SEO 100, best-practices 100.
- LCP mobile <2.5s, CLS <0.05, INP <200ms.
- Every interactive element ≥44×44px. All animation honors `prefers-reduced-motion`. No autoplay audio. Sensor access permission-gated.
- Total initial JS <120KB gz for A, <200KB for B, <260KB for C (WebGL).

## 2d. Coverage questions (asked and answered)

- *What's missing?* (1) A booking/scheduling decision (D3) gates CTA design — flagged. (2) Analytics: no GA4/GSC-verified property for CST yet (SEO audit) — wire it so the rebuild is measurable. Added to Phase 2.
- *What would make this better?* (1) A real events data source so H11 can't recur. (2) Photography grade pass — Holly's photos are strong but inconsistently treated; one duotone system lifts everything.

---

# QA Pass 1 — receipt verification + coverage

**Every file:line claim in §3–§8 was re-verified by grep this session.** Confirmed live: V1 cron `route.ts:8-12`; V3 `next.config.mjs:11,14`; V4 `subscribe/route.ts:36` (`startsWith`); H1 `page.tsx:64,68,73,78`; V2 `blog/[slug]/page.tsx:6,151` + `events/page.tsx:8,213`; V7 debugImage **0 imports (orphaned)**; H11 events dates `2026-06-07 … 2021-03-08` (all past); H12 `/thank-you` **0 refs**; contact `_captcha:'false'` `page.tsx:63`; services nowrap `page.tsx:76`; dead UI = 47/50 (only button/card/Navigation imported). PSI numbers from `seo/audits/2026-07-15/psi-*.json`. Email/DMARC from live `dig`.

**Coverage of the four asks:**
1. ✅ **Holes** — §3 (H1–H14) + §2 (what's good).
2. ✅ **Vulnerabilities for Opus later** — §4 (V1–V8), each scoped as a discrete, verifiable fix, severity-rated, with fix + verification step. Phase 1 (§9) is the Opus work order.
3. ✅ **UI improvement opportunities** — §5 (8 opportunities) + §10 (three built directions).
4. ✅ **Novel mobile engagement + optimization** — §6 (M1–M8, tarot-native, progressive-enhancement-safe) + §8 (perf) + §7 (SEO/GEO).
Plus the two requested QA passes (here + below) and two depth passes (above).

**Gaps found in this pass, now fixed:** added analytics wiring to Phase 2 (was implied, not stated); added the URL-preservation map (§2a) which v1 lacked; added H11/H12/H13/H14 + V8 from the verified static audit.

---

# QA Pass 2 — adversarial / fresh-eyes

Reading as a skeptic hired to find what's wrong with this plan:

1. **Correction (accuracy):** §5 implied hover effects are "dead on mobile" as a bug. Verified nuance: `tailwind.config.js:10-12` sets `hoverOnlyWhenSupported:true`, so hover utilities are correctly gated to hover-capable devices — there is **no sticky-hover bug**. The real point stands but is different: touch users get *no* interaction feedback where desktop gets glows. The opportunity is **adding touch-native feedback**, not fixing a bug. (Plan text §5 item 1 should be read with this correction.)
2. **Severity honesty:** V1 (cron) is rated High but is only exploitable under an env-misconfig (missing `CRON_SECRET`). That's real (Vercel preview envs often don't inherit prod secrets) but it is conditional — High-conditional, not High-actively-exploitable. Stated so no one over-panics. V2 is Medium only because Contentful authorship is trusted today; it drops to Low for the events instance (hardcoded content).
3. **Is the "novel mobile" section actually novel, or generic?** M3 (sticky call/text bar) and M7 (PWA) are best-practice, not novel — labeled honestly as high-impact-conventional. The genuinely novel, tarot-native ones are M1 (card-of-the-day flip as the front door), M2 (reviews as a swipeable card deck — the UI *is* the brand metaphor), M4 (a reading about which reading), M8 (share-a-card reach loop). That's the "few novel ways" the brief asked for; the rest are honest table-stakes.
4. **Did we overreach on scope?** The brief said don't implement fixes on the live site — respected (nothing shipped to prod; only local audit files + demo builds written). The three demos ARE implemented because the brief explicitly asked for them. `/seo` was run in audit-only mode by choice, to honor "don't make improvements" while still delivering the intelligence.
5. **Handoff-readiness:** a fresh session can open this doc, read §9, pick a phase, and every action links to a receipt. Effort is calibrated. Decisions that block work are isolated in §11. **Verdict: handoff-ready.**
6. **Biggest thing a reader should not miss:** two live pages are actively misleading — fake testimonials (H1) and a "Upcoming Events" page full of past events (H11). If nothing else ships, those two + V1 are the 30-minute integrity pass.

*End of master plan. Companion evidence: `seo/audits/2026-07-15/AUDIT.md` (crawl + PSI raw data), content pack at `/Users/studio/Build/crystal-seed-reimagined/_shared/content.json`, three live demos at cst-candlelit / cst-cinematic / cst-mystic.pages.dev.*
