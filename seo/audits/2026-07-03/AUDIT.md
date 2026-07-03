# SEO Audit + Fix Pass: crystalseedtarot.com - 2026-07-03

Mode: fix (T0 crawl-driven) · Live before/after verified by re-crawl of production.

## What changed (all live on prod, commits aa3e4ff + 5907a7a on dev, 838f418 + 9d406ef on main)

| Fix | Before (live crawl 7/3 AM) | After (live crawl 7/3 ~8:58 AM PT) |
|---|---|---|
| Canonicals | 0% of pages | 100% |
| Structured data | 0% (no JSON-LD anywhere) | 100% (LocalBusiness + Person + WebSite graph sitewide) |
| Unique titles | 6 pages all titled "Crystal Seed Tarot" | Every page unique + keyworded (Portland/services/booking) |
| Meta descriptions | 1 shared sitewide | Unique per page, 70-155 chars |
| H1 hierarchy | /events had 11 H1s | 1 H1 per page (cards → h2, markdown → h3) |
| sitemap.xml + robots.txt | Neither existed | Both live (Next metadata routes; sitemap includes Contentful slugs) |
| og:image default | none | Root default (evergreen cards image) |

## Still open

| # | Item | Tier | Note |
|---|---|---|---|
| 1 | Thin copy: home 260w, gallery 116w, blog index 160w, contact 62w | DRAFT | Holly-voice content; draft expansions on request, never auto-published |
| 2 | Holly Nicole vs Holly Cole naming inconsistency across the site | RUSS | Pick one public name; it is an entity/GEO signal. Schema currently says Holly Nicole |
| 3 | GBP: does one exist? | RUSS | If not, creating one = biggest local-SEO move available for a Portland service business |
| 4 | og:image per page (og "complete" coverage 27%: most pages lack og:image since per-page og blocks replace the root default) | AUTO | Next pass: add images array to each og export |
| 5 | Cloudflare email obfuscation generates /cdn-cgi/l/email-protection links that 404 for crawlers (2 inlinks) | RUSS | CF dashboard: Scrape Shield → Email Address Obfuscation off, or ignore (minor) |
| 6 | Submit sitemap to GSC once GSC access exists | RUSS | Pairs with the GSC wiring for generussdesign |

## Verification
- Build: next build green, 18 routes incl. /sitemap.xml + /robots.txt.
- Live: re-crawl after Vercel deploy confirmed titles/canonicals/schema (see this dir's crawl JSONs in the session scratchpad; next full audit writes them here).
