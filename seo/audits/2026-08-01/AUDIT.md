# SEO Audit: crystalseedtarot.com — 2026-08-01

Mode: **monthly report cycle** (`/seo report`). Full gather run (not the 15-min quick pass): live crawl (15 URLs), PSI mobile+desktop on homepage + 3 money pages, email-auth dig, WebSearch brand/category sampling (12 queries, under the 15 cap). No fixes shipped — diagnostic only, per this run's instructions.

**Baseline note (read before anything else below):** `seo/audits/2026-07-15/AUDIT.md` exists and reports an informal "~63/100 (C+)" overall, but **no `latest.json` was ever written for that or any prior run** (confirmed missing on disk before this run started). There is no machine-diffable baseline. This run's `latest.json` is the FIRST structured data point for this site. Every score below is computed fresh from this run's evidence per the rubric in `playbooks/reporting.md` — it is **not** a delta against 7/15's number, and the two are not directly comparable (see "Why this cycle's numbers read lower" below). Where a 7/15-flagged issue is checked again this cycle, status is reported as improved/unchanged/worse in prose only.

## Scorecard (0-100, evidence-sourced, reproducible from findings below)

| Module | Score | Grade | Basis (this run's evidence) |
|---|---|---|---|
| Technical | 89 | B | 14/14 indexable, canonical 100%, schema 100%, sitemap live (14 URLs), all 10 AI bots allowed. Deductions: 1 broken link (-1), thin-page class present (-5), hygiene: favicon.ico + apple-touch-icon both 404 (-5). |
| Content | 54 | F | Keyword coverage ~24/40 (services/events/home map to primary keywords; no service×city pages exist yet). Striking-distance 5/20 (no GSC connected; WebSearch sampling shows zero CST appearance in any of 6 category queries tried). Cannibalization 10/10 (none). Gap plan 2/10 (no dated plan on file). Journey balance 7/10. E-E-A-T 6/10 (real bio + 4,087-word reviews page, undercut by the name inconsistency below). |
| Local (GBP) | 9 | F | GBP still unconfirmed to exist (see Problem #1). Rubric's 80 GBP-dependent points (categories/attributes/reviews/response/posting/description/photos) score 0 by definition with no listing. Services-complete 6/10 (site services list matches 3rd-party directory listings). NAP 3/10 (phone consistent; name and city are NOT, see Problem #3). |
| Authority | 33 | F | Marketplace citations present and reasonably strong (Thumbtack, GigSalad, The Bash, Facebook) ≈25/40 parity. No Yelp listing found (competitors have one). 0/15 unlinked-mention outreach, 0/15 dated link plan. Citation consistency 5/20 (name/city drift). One citable asset (reviews page) not yet repurposed, 3/10. |
| GEO/AEO | 20 | F | Bot access deliberate and full 10/10. llms.txt still 404, 0/10. No answer-first H2+40-60w blocks anywhere in the 15-page crawl, 0/25. Schema depth 8/20 (LocalBusiness has foundingDate/areaServed/founder, but no telephone despite it being known, sameAs = Facebook+Instagram only, missing GBP/Thumbtack/GigSalad). AI presence 0/20 (0 of 12 sampled WebSearch queries surfaced CST). Entity consistency 2/15 (name conflict below). |
| Voice | 9 | F | No FAQ or speakable schema anywhere (0/15). No question-form H2/H3 content (0/30). No snippet-formatted answer blocks (0/25). Local voice hooks 3/20 (phone number is published; no GBP for "near me"/hours). Conversational copy 6/10 (blog posts read in a warm human voice). |
| Performance | 94 | A | PSI mobile: home 88 (LCP 3.7s), services 95 (LCP 2.6s), contact 96 (LCP 2.9s), magic-of-tarot 93 (LCP 3.0s) — avg 93. Desktop 100 on every page tested. No CrUX field data (low traffic, lab-only, stated). Home unchanged vs 7/15's reported 88, not a regression. Composite score is high; the standing homepage LCP miss is called out separately below because it's the one page still failing the 2.5s mobile threshold. |
| Email | 55 | F | Infrastructure only (Layer 2 engagement needs Holly's own ESP login — not accessed, out of scope). `email-auth.sh` verdict: **FAIL**. SPF pass, MX pass (Google Workspace), DMARC still no record at `_dmarc.crystalseedtarot.com`, DKIM inconclusive (no common selector resolved — platform-specific, not counted as a fail). |
| Social | 24 | F | OG/card coverage 43% sitewide (13/30, up from 0% on 7/15 — see win #1) but the money pages (home, services, contact, gallery, reviews, events) still have `og.image:false`; only the new class page + 5 blog posts carry real OG images. Render quality 3/15 (money pages would still unfurl blank). 0/10 unique money-page images. Graph wiring 8/15 (sameAs = FB+IG only). 0/20 platform-fit strategy documented. 0/10 flywheel evidence. |
| CRO | 44* | F | *Renormalized to the 75/100 of sub-checks actually run this cycle; the site-rx P0/P1 sub-component (25 pts) was NOT invoked this cycle (report-mode time budget) and is excluded rather than zeroed — full CRO deep-dive needs a dedicated `/site-rx` pass. Of what was checked: intent match 18/30, path friction 12/25 (FormSubmit-based contact form, not walked this cycle), trust minimum 3/10 (reviews exist but aren't surfaced near CTA on money pages), measurement 0/10 (no GA/GTM/analytics script found in homepage or contact-page HTML — standing finding). |

**Weighted overall: 49/100 (F)** — weights per reporting.md (tech .15, content .20, local .15, authority .10, geo .10, voice .05, perf .10, cro .10, email .05, social .05; local stays in scope, no renormalization needed, since Crystal Seed Tarot is a service-area business regardless of GBP status).

### Why this cycle's numbers read lower than 7/15's informal "~63"
7/15's AUDIT.md gave real, specific evidence (correctly) but several of its module scores (GEO 55, Voice 50, Local 45, Social 40) don't arithmetically trace back to the rubric weights in the same way this run's do — e.g. GEO was scored 55/C- with a basis stating "no llms.txt, no FAQ/speakable schema, no answer-first content blocks," which by the current rubric's own point allocation (llms.txt 10 + answer-first 25 + AI presence 20 = 55 of the module's 100 points already gone) can't reach 55 once bot-access and partial schema credit are added on top. This run applies the reporting.md rubric literally and shows the arithmetic per module above, per the "scores must be reproducible" requirement. Nothing on the site got worse to produce this number — it is a stricter accounting of the same open gaps, most of which (GBP, llms.txt, DMARC, mobile LCP, thin pages) were already known and are simply still open a month later.

## Status of the 6 issues flagged 7/15 (informal, not scored)

| Issue | 7/15 status | 2026-08-01 status |
|---|---|---|
| og:image | 0% coverage | **Improved, partial.** 43% sitewide (6/14 pages: the new /events/magic-of-tarot page + 5 blog posts). Home, services, contact, gallery, reviews, events still `false`. |
| DMARC | Missing | **Unchanged.** `dig _dmarc.crystalseedtarot.com` still returns no record; email-auth verdict FAIL. |
| llms.txt | Missing | **Unchanged.** `/llms.txt` still 404. |
| Mobile LCP | 3.7s (home, PSI) | **Unchanged on home** (3.7s, same page, same hero image `Home-Shuffle.webp`). Other money pages tested this cycle are better: services 2.6s, contact 2.9s, magic-of-tarot 3.0s — all still over the 2.5s good threshold but closer. |
| 4 thin pages | home 260w, about 321w, gallery 116w, contact 62w | **Mixed.** About is no longer thin at 321w (crawl's <300w threshold; this may have been a borderline mis-flag in 7/15, not a real fix — same 321w both times). Currently thin: home 260w, blog 160w, contact 62w, gallery 116w, and the new /events/magic-of-tarot page at 139w. Net: still 5 thin pages, not fewer. |
| GBP unconfirmed | Unconfirmed | **Still unconfirmed, and now evidenced negatively.** 12 WebSearch queries across every core category keyword (tarot reader Portland OR, tarot reading Portland Oregon, party tarot reader, tarot reader near me, tarot lessons Portland, best tarot reader Portland Oregon 2026) returned zero appearances of Crystal Seed Tarot. Competitors (Present Path Tarot, Portlandia Fortune Tellers, Miss Renee, Hanna Brooks Olsen, Lionel Tarot, Raven Greywolf) fill every result. Third-party directories (Thumbtack, GigSalad, The Bash) list the business in **Beaverton, OR** — not Portland/Vancouver as the site markets — which is itself a new, more specific finding this cycle. |

## New finding this cycle (not on the 7/15 list)

**Entity name/location conflict, evidenced directly.** Site schema (`Person.name`) says "Holly Nicole." Every independent third-party citation found this cycle (Thumbtack, GigSalad, The Bash, and the business's own Facebook page title) says "Holly Cole." Those same three marketplace listings give the business address as Beaverton, OR, while the website's copy and schema `areaServed` claim Portland + Vancouver, WA. This was flagged as an open question in the 7/3 audit ("confirm preferred public name") but this cycle is the first time it's been confirmed as an actual, active conflict across real external citations rather than a hypothetical to resolve — it directly suppresses the Authority and GEO entity-consistency sub-scores above.

## 3 wins

1. **og:image pipeline works, it just hasn't reached the money pages.** 0% → 43% sitewide since 7/15. The new class-registration page and all 5 blog posts ship correct OG images. The fix pattern is proven; it needs to be applied to home/services/contact/gallery/reviews/events.
2. **Technical foundation is holding at a high bar.** 14/14 pages indexable, 100% schema and canonical coverage, zero duplicate or missing titles/descriptions, sitemap clean, all 10 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) deliberately allowed. This is the same clean base the 7/3 and 7/15 passes built and it hasn't regressed.
3. **Performance is genuinely strong outside the homepage hero.** Desktop is 100 on every page tested. Mobile is 93-96 on services, contact, and the new class page — only the homepage still carries the old hero-image LCP problem.

## 3 problems

1. **Google Business Profile still does not exist, and it is now costing visibility, not just theory.** Zero appearances across every core category search tried this cycle while five-plus direct competitors dominate all of them. This is the single largest number on the scorecard (Local 9/100) and the biggest drag on Voice and GEO too, because both lean on GBP for "near me" and local entity confidence.
2. **DMARC is still missing a month after being flagged.** `email-auth.sh` verdict is FAIL. Mail from crystalseedtarot@gmail.com (bookings, newsletter) remains spoofable with no monitoring visibility into who's sending as the domain.
3. **The business's public identity is actively inconsistent across the web, not just internally.** "Holly Nicole" (site) vs "Holly Cole" (every third-party listing) plus a Beaverton, OR address on directories vs a Portland/Vancouver marketing story on the site. This is exactly the kind of signal that keeps Google and AI engines from being confident the entity is real, which is a prerequisite for GBP ranking, knowledge panels, and AI citations alike.

## The one most-important next action

**Get a yes/no answer from Holly: does a Google Business Profile exist under any of her emails?** Nothing else on this list matters as much. If yes: Kit needs access to run the local-gbp playbook's 8 plays. If no: creating one, using "Holly Cole" (the name every real-world citation already uses) and picking Portland/Vancouver as the service area explicitly, is the highest-leverage single action available on this entire scorecard — bigger than DMARC, bigger than the thin pages, bigger than llms.txt.

## Findings (ranked, tier-labeled)

| # | Finding | Evidence | Impact | Effort | Tier |
|---|---|---|---|---|---|
| 1 | GBP unconfirmed/absent | 12 WebSearch category queries, 0 appearances (this run) | H | S (verify) / M (create+build out) | RUSS (Holly must confirm/create) |
| 2 | DMARC missing | `dig _dmarc.crystalseedtarot.com` empty; email-auth verdict FAIL | H | S | RUSS (DNS apply). Record: `v=DMARC1; p=none; rua=mailto:crystalseedtarot@gmail.com` |
| 3 | og:image missing on 8 of 14 pages, including every money page | crawl `og.image:false` on home/services/contact/gallery/reviews/events/about/blog-index | H | S | AUTO |
| 4 | Entity name/city conflict | site schema "Holly Nicole" vs Thumbtack/GigSalad/TheBash/Facebook "Holly Cole"; site markets Portland/Vancouver vs directories list Beaverton, OR | H | S (decision) | RUSS (which name/area is canonical) |
| 5 | Homepage mobile LCP 3.7s | PSI mobile lab, home only; unchanged since 7/15 | M-H | M | AUTO (hero image sizing) |
| 6 | llms.txt missing | `/llms.txt` 404 | M | S | AUTO |
| 7 | No FAQ/speakable schema, no answer-first content anywhere | crawl schemaTypes = LocalBusiness/Person/WebSite only, sitewide | M | M | AUTO |
| 8 | 5 thin pages (home 260w, blog 160w, contact 62w, gallery 116w, events/magic-of-tarot 139w) | crawl wordcounts | M | M | DRAFT (needs Holly's voice) |
| 9 | favicon.ico + apple-touch-icon 404 | curl 404/404 | L | S | AUTO |
| 10 | Broken link `/cdn-cgi/l/email-protection` (Cloudflare email obfuscation) | crawl broken:1, 404 | L | S | RUSS (CF dashboard toggle) or AUTO (stop emitting the link) |
| 11 | sameAs graph incomplete | schema sameAs = Facebook + Instagram only; Thumbtack/GigSalad/The Bash exist and aren't linked | M | S | AUTO |
| 12 | 6 pages with non-ideal title length (too short: blog/gallery/events index; too long: magic-of-tarot, 2 blog posts) | crawl titleLength issues | L | S | AUTO |
| 13 | No analytics/conversion tracking detected | grep of homepage + contact-page HTML for gtag/GA4/GTM/Clarity/Hotjar/Plausible/Fathom: none found | H (measurement, not traffic) | S-M | RUSS (tool choice) |
| 14 | No service×city landing pages (Portland vs Vancouver) | crawl: only generic /services | M | M | DRAFT |

## Access notes / what was skipped and why

- **GSC / GA4**: not connected for this site (T2, registry lists "verify"/no confirmed access). Content and CRO striking-distance analysis used WebSearch sampling as the stated fallback, not a census.
- **Apify (T1) GBP competitor teardown**: available but **not run this cycle, $0 spent.** Judgment call: the teardown's core value is a categories/attributes/NAP *parity* comparison against **our own listing**, and there is no confirmed GBP listing to anchor that comparison against. Running a competitor-only teardown without an anchor doesn't produce the rubric's actual deliverable, and this is a monthly report cycle, not the deeper revamp-scope full audit. WebSearch category sampling (free, T0) already delivered the decision-relevant fact: CST does not surface for any core keyword. Recommend running the full Apify teardown in the SAME session Holly confirms/creates the GBP, so it has a real anchor.
- **Klaviyo / email engagement (Layer 2)**: not read. The connected Klaviyo MCP is Generuss's account; this is Holly's property and no Holly-owned ESP access was available or used. Email module scored on infrastructure only, as the rubric specifies for this case.
- **No source failed twice.** Crawl, all 8 PSI calls, and email-auth all returned clean on first attempt. No DEGRADED sources this cycle.

## Artifacts written this run

- `seo/audits/2026-08-01/AUDIT.md` (this file)
- `seo/audits/2026-08-01/latest.json`
- `seo/audits/2026-08-01/pages.json`
- `seo/audits/2026-08-01/summary.json`
- `seo/audits/2026-08-01/email-auth.txt`
- `seo/audits/2026-08-01/psi-mobile-crystalseedtarot-com.json` / `psi-desktop-crystalseedtarot-com.json`
- `seo/audits/2026-08-01/psi-mobile-crystalseedtarot-com-services.json` / `psi-desktop-crystalseedtarot-com-services.json`
- `seo/audits/2026-08-01/psi-mobile-crystalseedtarot-com-contact.json` / `psi-desktop-crystalseedtarot-com-contact.json`
- `seo/audits/2026-08-01/psi-mobile-crystalseedtarot-com-events-magic-of-tarot.json` / `psi-desktop-crystalseedtarot-com-events-magic-of-tarot.json`

No files outside `seo/audits/2026-08-01/` were touched. No commits, no pushes, no deploys, no GBP/social/email sends of any kind.
