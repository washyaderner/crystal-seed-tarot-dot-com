# SEO Audit: crystalseedtarot.com — 2026-07-15

Mode: **audit-only** (full revamp context; no fixes shipped per Russ instruction). Evidence: live crawl (14 pages), PSI mobile+desktop, email-auth dig, Playwright mobile crawl. Prior fix pass 2026-07-03 (canonicals/schema/titles/sitemap 0→100%) still holding.

## Scorecard (0–100, evidence-sourced)

| Module | Score | Grade | Basis |
|---|---|---|---|
| Technical | 90 | A- | canonical 100%, schema 100%, sitemap live, AI bots unblocked, robots OK. −points: 1 broken link, og:image 0% |
| Content | 68 | C+ | 3 rich pages (services 1598w, events 2293w, reviews 4087w) but 4 thin (home 260w, about 321w, gallery 116w, contact 62w) |
| Local (GBP) | 45 | F+ | **GBP existence still unconfirmed** — single biggest local lever unaddressed. NAP partial (no consistent address; phone now known) |
| Authority | 60 | C- | Thumbtack Top Pro 2025 + GigSalad Top Performer badges = real citations; no structured backlink/citation strategy |
| GEO/AEO | 55 | C- | schema graph present (good AI base) but **no llms.txt**, no FAQ/speakable schema, no answer-first content blocks |
| Performance | 82 | B | desktop perf 99 (LCP 0.5s); **mobile perf 88, LCP 3.7s** (over 2.5s good threshold) — hero image is the LCP bottleneck |
| Email | 50 | F+ | SPF pass, MX Google, but **DMARC missing** (FAIL) — deliverability risk for the newsletter Holly sends |
| Social | 40 | F | **og:image false on every page** — shared links render with no preview image on FB/iMessage/Instagram/Slack |
| Voice | 50 | C- | no speakable schema, no FAQ; conversational "tarot reader near me" queries under-served |
| CRO/UX | 62 | C- | clean form + clear pricing, but no reviews on money pages, reviews page is 26,934px unpaginated, weak above-fold CTA hierarchy |

**Weighted overall: ~63/100 (C+)** — technically clean foundation (the 7/3 pass did its job) sitting under thin content, zero social-share images, missing local + AI-answer surfaces, and a mobile LCP problem.

## Findings (ranked by impact-per-effort — this-week first)

### This week (high impact, small effort)
1. **[SOCIAL-01] og:image missing on all 8 pages** | crawl: `og.image:false` every page | shares render blank on every platform | H impact / S effort. Fix: per-page `openGraph.images` in each `metadata` export (evergreen cards image default; page-specific where one exists).
2. **[LOCAL-01] Google Business Profile unconfirmed** | profile line 11 "unknown", still open from 7/3 | for a Portland/Vancouver service business this is the #1 local-visibility lever; without it CST is invisible in Map Pack + "tarot reader near me" | H impact / S effort (verify → claim/create → NAP + categories + photos + review link). **Needs Holly.**
3. **[EMAIL-01] DMARC record missing** | `dig _dmarc` → no record | newsletter + booking replies from crystalseedtarot@gmail.com risk spam-foldering; also spoofable | H impact / S effort. Record text: `v=DMARC1; p=none; rua=mailto:crystalseedtarot@gmail.com` (start monitor-only, tighten to quarantine later). **Russ/DNS.**
4. **[GEO-01] No llms.txt / llms-full.txt** | crawl `llmsTxt:NO` | ChatGPT/Perplexity/Claude answer "who does tarot in Portland" without CST in the set | M-H impact / S effort. Ship `/llms.txt` (services, areas, pricing, booking URL, entity facts).

### Next (high impact, medium effort)
5. **[CONTENT-01] 4 thin pages** | home 260w, about 321w, gallery 116w, contact 62w (crawl wordcount) | too little for ranking or AI extraction | H impact / M effort. Expand in Holly's voice: home (services intro + local + trust), gallery (event-type captions + copy), contact (booking FAQ, response time, service area), about (already good voice, add credentials block).
6. **[PERF-01] Mobile LCP 3.7s** | PSI mobile lab | hero `Home-Shuffle.webp` is LCP element, q=60 but still slow on mobile throttle | M-H impact / M effort. Preload is present; reduce hero dimensions for mobile, consider a lighter above-fold, trim unused CSS/JS (~150ms each per PSI).
7. **[GEO-02 / VOICE-01] No FAQ or speakable schema** | no FAQPage/speakable in JSON-LD | misses AI answer boxes + voice results | M impact / M effort. Add an FAQ section (pricing, what to expect, service area, virtual option) with FAQPage schema.
8. **[CONTENT-02] Service × city pages absent** | only generic /services | "tarot reader Portland" / "party tarot Vancouver WA" have no dedicated target page | M impact / M effort. 2–3 location/service landing pages.

### Housekeeping (low effort)
9. **[TECH-01] Broken link /cdn-cgi/l/email-protection (404)** | crawl `broken:1` | Cloudflare email-obfuscation link 404s for crawlers | L impact / S effort. CF dashboard: Scrape Shield → Email Obfuscation off, or ignore (cosmetic). **Russ.**
10. **[TECH-02] favicon.ico 404** | Playwright console error | no tab/bookmark icon | L impact / S effort. Add favicon + apple-touch-icon set.
11. **[AUTHORITY-01] Badge citations not linked to profiles** | Thumbtack badge is an `<img>` with no link (home) | small trust + citation loss | L impact / S effort. Link Thumbtack badge to the live Thumbtack profile (GigSalad already linked).

## Carried from 2026-07-03 (still open)
- Holly Nicole vs Holly Cole naming inconsistency (schema=Nicole, blog author=Cole) — entity signal. **Russ/Holly.**
- GBP existence — see LOCAL-01.
- Submit sitemap to GSC once GSC access exists (GSC now = russ@generuss.com per gate).

## New facts captured this session (fold into profile)
- Phone: **(541) 635-2278** (Call/Text) — was missing from profile.
- Payment methods: Apple Pay, Venmo, PayPal, Facebook Pay, Credit Card, Cash.
- Unique offering: **"Rent-a-Witch Services"** (spell/ritual work) — distinct differentiator, currently buried in /services body; deserves its own surface + schema.
- Reviews page = 4087 words / 26,934px tall, unpaginated (CRO + UX issue, big untapped social-proof asset).

## Access still needed (unlock next pass)
- GBP dashboard access (or confirmation none exists) — blocks the entire local module.
- GSC property verification for crystalseedtarot.com (russ@generuss.com account) — unlocks real query/CTR data vs the current SERP-sampling fallback.
