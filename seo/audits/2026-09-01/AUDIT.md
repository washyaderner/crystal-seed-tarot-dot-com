# SEO Audit: crystalseedtarot.com - 2026-09-01

Mode: **monthly report cycle** (`/seo report`), unattended run under Russ's 2026-07-07 standing opt-in. Full gather: live crawl (16 URLs), PSI mobile+desktop on homepage + 3 money pages, email-auth dig, WebSearch brand/category/GBP sampling (10 queries, under the 15 cap). No fixes shipped, no commits, no pushes, no sends - diagnostic only, per this run's instructions.

Baseline for this cycle: `seo/audits/2026-08-01/latest.json` (overall 49/100, the first structured baseline for this site; `seo/audits/2026-07-15/` has no machine-readable latest.json so it cannot be diffed).

## Scorecard (0-100, evidence-sourced, reproducible from findings below)

| Module | Score | Grade | vs 8/1 | Basis (this run's evidence) |
|---|---|---|---|---|
| Technical | 91 | A- | +2 | 15/15 indexable, canonical 100%, schema 100%, sitemap live (15 URLs), all 10 AI bots allowed (summary.json, crawl 9/1). Deductions: 1 broken link (-1, `/cdn-cgi/l/email-protection` still 404), thin-page class present (-5, still 5 pages), hygiene partial (-3: favicon.ico now 200, verified `curl -o /dev/null -w "%{http_code}"`, but apple-touch-icon.png still 404). |
| Content | 56 | F | +2 | Keyword coverage 24/40 (unchanged: no service x city pages, new `/tarotdoxa` page targets the app, not a tarot-reading keyword). Striking-distance 5/20 (no GSC; WebSearch sampling, 8 category queries this cycle, zero CST appearance, same as 8/1). Cannibalization 10/10. Gap plan 2/10 (still no dated plan on file). Journey balance 7/10. E-E-A-T 8/10 (up from 6: the Holly Nicole/Holly Cole name conflict is resolved site-wide, see win #1; still capped below 10 by the Beaverton-vs-Portland city conflict). |
| Local (GBP) | 12 | F | +3 | GBP still unconfirmed (see Problem #1; 10 WebSearch queries this cycle, zero appearances, same negative evidence as 8/1). GBP-dependent 80pts remain 0 by definition. Services-complete 6/10 unchanged. NAP 6/10 (up from 3: name now consistent site vs. citations; phone consistent; city/address still conflicts, Beaverton on directories vs Portland/Vancouver on site). |
| Authority | 38 | F | +5 | Marketplace parity ~25/40 unchanged (Thumbtack, GigSalad, The Bash, Facebook; Alignable newly surfaced this cycle's WebSearch, Yelp still absent). Unlinked-mention outreach 0/15, dated link plan 0/15 - both unchanged, no fixes this cycle. Citation consistency 10/20 (up from 5: name now matches across all citations checked; city still drifts). One citable asset (reviews page) still not repurposed, 3/10. |
| GEO/AEO | 38 | F | +18 | Bot access 10/10 unchanged. **llms.txt now live, 10/10 (was 0/10 - was a confirmed 404 on 8/1)**: verified via direct `curl https://crystalseedtarot.com/llms.txt`, real content (business summary, services, FAQ-style Q&A, page directory), also confirmed in crawl `summary.json` (`"llmsTxt": true`). Answer-first coverage on money pages 0/25 unchanged (llms.txt content doesn't live on the actual page HTML the rubric checks). Schema depth 8/20 unchanged (still no `telephone` in LocalBusiness, checked via grep on 3 pages; `sameAs` still Facebook+Instagram only). AI presence 0/20 unchanged (0 of this cycle's WebSearch queries surfaced CST outside its own site/directories). Entity consistency 10/15 (up from 2: `Person.name` is now "Holly Cole" sitewide, verified on 5 pages via direct grep of live JSON-LD, matching every third-party citation found; held below full marks by the city/address conflict). |
| Voice | 9 | F | 0 | Re-verified, genuinely unchanged: no FAQ/speakable schema anywhere (0/15, crawl schemaTypes = LocalBusiness/Person/WebSite/MobileApplication only). No question-form H2/H3 (0/30). No snippet-formatted answer blocks on-page (0/25). Local voice hooks 3/20 (phone tel: link confirmed live on /contact; still no GBP for "near me"/hours). Conversational copy 6/10 unchanged. |
| Performance | 94 | A | 0 | PSI mobile this run: home 87 (LCP 2.7s), services 95 (LCP 2.6s), contact 92 (LCP 2.9s), magic-of-tarot 94 (LCP 2.9s) - avg 92. Desktop 100 on every page. Formula: avg*0.8 + no-regression bonus (20, nothing dropped >10) = 93.6, rounds to 94, same as 8/1's 94 despite real underlying movement (see win #2). No CrUX field data, lab-only, stated. |
| Email | 60 | F | +5 | Infrastructure only (Layer 2 needs Holly's own ESP, not accessed, out of scope, same as 8/1). `email-auth.sh` verdict upgraded **FAIL -> WARN**. SPF pass, MX pass (unchanged). **DMARC record now exists** (`dig +short TXT _dmarc.crystalseedtarot.com` -> `v=DMARC1; p=none; rua=mailto:russ@generuss.com; fo=1`) - real change from "no record" on 8/1, monitoring-only (p=none) so not yet enforcement. DKIM still inconclusive (no common selector resolved; per script, not counted as fail). See Problem #2 on the `rua=` address. |
| Social | 46 | F | +22 | **OG/card coverage now 100%** sitewide (was 43%, 6/14 pages on 8/1). Verified directly in `pages.json` this run: home, services, contact, gallery, reviews, and events all now carry real `og.image:true` alongside title/description - the money pages that unfurled blank on 8/1 are fixed. Render quality 8/15 (up from 3, credit for images now present on money pages; dimensions/text-light quality not independently re-rendered this cycle, so not full marks - unverified claim flagged, not scored as certain). Unique money-page images 0/10 (not verified this cycle whether each is a distinct image, left conservative). Graph wiring 8/15 unchanged (`sameAs` = Facebook + Instagram only, confirmed via curl). Platform-fit strategy 0/20, flywheel 0/10, both unchanged. |
| CRO | 44* | F | 0 | *Same renormalization as 8/1 (75/100 checked; site-rx/Playwright conversion walk not invoked this cycle either - report-mode time budget, consistent decision). Measurement re-verified this cycle: grepped homepage + contact HTML for gtag/GTM/GA4/Clarity/Hotjar/Plausible/Fathom - still zero matches, still 0/10. Trust minimum, intent match, path friction not independently re-walked; carried forward unchanged per last cycle's method. |

**Weighted overall: 54/100 (F)** - weights per reporting.md (tech .15, content .20, local .15, authority .10, geo .10, voice .05, perf .10, cro .10, email .05, social .05).

Overall: **49 -> 54** (first baseline -> this cycle), **+5**. Still an F by grade boundary (<60), but the first real movement since the 8/1 baseline, and every point of it traces to a verified, specific change (not measurement noise): see wins below. No module dropped by >=10 or by >=20% on any KPI, so the anomaly-investigation rule does not fire in the negative direction this cycle. GEO (+18) and Social (+22) are large positive swings; each is backed by a direct, repeatable check (curl/grep/dig shown above), not a single flaky sample, so they are reported as real, not suspect.

## Zero-delta check

Voice (9) and CRO (44) came back numerically identical to 8/1. Per the zero-delta suspicion rule: both were independently re-verified this cycle, not just copied forward. Voice: crawl was a fresh run (`summary.json` timestamp 2026-09-01T13:49), schema types and phone link were re-checked live. CRO: the measurement grep was re-run fresh against freshly-curled HTML this cycle. Both flats are confirmed-unchanged, not stale-data artifacts. Performance's 94 also repeated but the underlying LCP numbers moved (3.7s -> 2.7-3.0s); the composite score coincidentally lands on the same rounded value - flagged explicitly so it doesn't read as "nothing happened."

## Zero-delta streak check across cycles

Only one prior data point exists (2026-08-01; 2026-07-15 has no latest.json to chain from). A 2+ flat-cycle streak call does not yet apply to this site - this cycle is the second recorded point, and it is not flat (49 -> 54, and several modules moved individually). No kill-review candidate.

## GBP status this cycle

**Still unconfirmed.** 10 WebSearch queries this cycle (brand, GBP-specific, and 6 core category/location terms) returned zero evidence of a Google Business Profile or Google Maps listing for Crystal Seed Tarot under any name. The business continues to show up only on marketplace/directory platforms (Thumbtack, GigSalad, The Bash, Facebook, Alignable - new this cycle), all of which list the address as **Beaverton, OR**, while the site markets Portland/Vancouver. No change in confirmation status since 8/1; this is the single largest number still dragging the scorecard (Local 12/100).

## 3 wins

1. **The entity name conflict flagged 8/1 is resolved on the site side.** `Person.name` in JSON-LD is now "Holly Cole" sitewide (verified on 5 pages: /, /about, /services, /reviews, /events), matching every third-party citation (Thumbtack, GigSalad, The Bash, Facebook, Alignable) instead of the old "Holly Nicole." This directly lifted E-E-A-T, citation consistency, and GEO entity-consistency sub-scores. The remaining half of that finding - Beaverton (directories) vs Portland/Vancouver (site marketing) - is still open.
2. **llms.txt shipped, and it's good.** 404 on 8/1, now a real file at `/llms.txt`: business summary, service list, an FAQ-style Q&A block, and a page directory with one-line descriptions. Full marks on GEO's llms.txt sub-score (10/10, was 0/10). Alongside it: OG/card coverage went from 43% to 100% sitewide, closing the exact gap called out as win #1 last cycle ("it just hasn't reached the money pages" - it now has, verified in pages.json: home/services/contact/gallery/reviews/events all carry real og:image).
3. **Two small technical/email fixes landed.** favicon.ico is now 200 (was 404). DMARC went from no record at all to a real (if monitoring-only, p=none) policy. Neither is a big point mover alone, but both were standing findings from 8/1 and both are gone now.

## 3 problems

1. **Google Business Profile is still the single biggest number on the scorecard, unchanged a month later.** Local sits at 12/100 for the same reason it sat at 9/100 on 8/1: zero confirmed listing, zero appearances across every category query tried. This is still the one action that would move Local, Voice, and GEO simultaneously, and it still needs a yes/no from Holly before anything else can happen here.
2. **The new DMARC record reports to `russ@generuss.com`, not a Crystal Seed / Holly-owned address.** Verified via `dig +short TXT _dmarc.crystalseedtarot.com`: `rua=mailto:russ@generuss.com`. This is Holly's domain and this account's tools are supposed to stay scoped to Holly/Crystal Seed, never conflated with Russ's own Generuss accounts (per the profile's account-scope rule). Whoever set the DMARC record used a convenient address rather than a scoped one. Not a fix I'm making in report mode (DNS is Russ-tier anyway) - flagging it as a decision: should this route to crystalseedtarot@gmail.com instead?
3. **The Beaverton/Portland-Vancouver location conflict is still live and now sits next to a resolved name conflict, making it more conspicuous.** Every third-party directory (Thumbtack, GigSalad, The Bash, Alignable) lists the business in Beaverton, OR. The site's copy, schema `areaServed`, and marketing all say Portland + Vancouver, WA. With the name now unified, this is the one remaining entity-consistency gap suppressing Authority and GEO scores, and it will matter even more once/if a GBP listing goes up (whichever city gets used there needs to be a real, defensible answer).

## The one most-important next action

**Same as 8/1, and now more urgent given the rest of the entity work has landed: get a yes/no from Holly on whether a Google Business Profile exists under any of her emails, and settle the Beaverton-vs-Portland/Vancouver question at the same time.** The name conflict got fixed this cycle without that conversation; the city conflict can't be, because it's a real-world fact question (where does she actually want to be found), not a copy edit. Once both are settled: Local, Voice, and GEO all move together, and the site is finally ready for the Apify GBP teardown that's been sitting unrun (still $0 spent) for two cycles because there's no listing to anchor it against.

## Findings (ranked, tier-labeled)

| # | Finding | Evidence | Impact | Effort | Tier | Status |
|---|---|---|---|---|---|---|
| 1 | GBP unconfirmed/absent | 10 WebSearch queries this cycle, 0 appearances | H | S (verify) / M (create+build) | RUSS (Holly) | Unchanged from 8/1 |
| 2 | Beaverton vs Portland/Vancouver city conflict | Thumbtack/GigSalad/TheBash/Alignable = Beaverton; site/schema `areaServed` = Portland+Vancouver | H | S (decision) | RUSS (Holly, which city is canonical) | Unchanged from 8/1 |
| 3 | DMARC `rua=` points to russ@generuss.com, not a Holly-owned address | `dig` this run | M | S | RUSS (account-scope decision) | NEW this cycle |
| 4 | Homepage mobile LCP still over 2.5s threshold | PSI mobile lab, 2.7s this run (re-check same session: 3.0s) | M | M | AUTO (hero image sizing) | Improved (was 3.7s) but not resolved |
| 5 | No FAQ/speakable schema, no answer-first content anywhere | crawl schemaTypes sitewide; llms.txt content not mirrored on-page | M | M | AUTO | Unchanged |
| 6 | 5 thin pages (home 284w, blog 161w, contact 63w, gallery 117w, events/magic-of-tarot 140w) | crawl wordcounts this run | M | M | DRAFT (needs Holly's voice) | Unchanged (word counts moved a few words, not materially) |
| 7 | apple-touch-icon still 404 (favicon.ico now fixed) | curl this run | L | S | AUTO | Half-fixed |
| 8 | Broken link `/cdn-cgi/l/email-protection` | crawl broken:1, 404 this run | L | S | RUSS (CF dashboard) or AUTO | Unchanged |
| 9 | `sameAs` graph incomplete, no telephone in LocalBusiness schema | curl/grep this run | M | S | AUTO | Unchanged |
| 10 | 6 pages with non-ideal title length | crawl this run, same 6 URLs as 8/1 | L | S | AUTO | Unchanged |
| 11 | No analytics/conversion tracking detected | grep of homepage + contact HTML this run: no gtag/GTM/GA4/Clarity/Hotjar/Plausible/Fathom | H (measurement) | S-M | RUSS (tool choice) | Unchanged |
| 12 | No service x city landing pages | crawl this run: /services still the only generic page; new /tarotdoxa page targets the app, not a location keyword | M | M | DRAFT | Unchanged |
| 13 | Yelp listing still absent (competitors have one) | WebSearch this cycle | M | S | RUSS/DRAFT | Unchanged |

## Access notes / what was skipped and why

- **GSC/GA4**: still not connected (T2). Content/CRO striking-distance used WebSearch sampling again, labeled as a sample, not a census.
- **Apify (T1) GBP competitor teardown**: not run this cycle, $0 spent. Same judgment as 8/1: no confirmed GBP listing to anchor a categories/attributes/NAP comparison against. Recommend running it the same session Holly confirms/creates the GBP.
- **Klaviyo/email engagement (Layer 2)**: not read. Connected Klaviyo MCP is Generuss's account; this is Holly's property, no Holly-owned ESP access available. Email scored on infrastructure only, per rubric.
- **site-rx / Playwright conversion walk**: not invoked this cycle, consistent with 8/1's report-mode time budget. CRO score carried forward with only the measurement sub-check independently re-verified.
- **No source failed twice.** Crawl, all 8 PSI calls, email-auth, and all 10 WebSearch queries returned clean on first attempt. No DEGRADED sources this cycle. One PSI anomaly was caught and resolved: the first mobile-home PSI run showed CLS 0.186 (would have read as a new regression); a same-session re-run showed CLS 0.004, matching the 8/1 baseline and every other page tested. Treated as lab noise, not reported as a finding, per the evidence-bar rule that a consequence needs two agreeing samples before it's named as real.

## Artifacts written this run

- `seo/audits/2026-09-01/AUDIT.md` (this file)
- `seo/audits/2026-09-01/latest.json`
- `seo/audits/2026-09-01/pages.json`
- `seo/audits/2026-09-01/summary.json`
- `seo/audits/2026-09-01/email-auth.txt`
- `seo/audits/2026-09-01/psi-mobile-crystalseedtarot-com.json` / `psi-desktop-crystalseedtarot-com.json`
- `seo/audits/2026-09-01/psi-mobile-crystalseedtarot-com-services.json` / `psi-desktop-crystalseedtarot-com-services.json`
- `seo/audits/2026-09-01/psi-mobile-crystalseedtarot-com-contact.json` / `psi-desktop-crystalseedtarot-com-contact.json`
- `seo/audits/2026-09-01/psi-mobile-crystalseedtarot-com-events-magic-of-tarot.json` / `psi-desktop-crystalseedtarot-com-events-magic-of-tarot.json`

No files outside `seo/audits/2026-09-01/` were touched. No commits, no pushes, no deploys, no GBP/social/email sends of any kind. All new audit files are untracked in git (confirmed: this directory did not exist before this run and nothing was staged).
