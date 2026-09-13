# Project Journal - crystal-seed-tarot-dot-com

> Auto-generated build journal. Captures commits, decisions, friction, and lessons.

## 2026-03-03 | SHIP | 535a91e...5dde603

Shipped: GigSalad Top Performer badge added across site - homepage hero, nav bar, and reviews page with side-by-side achievement cards
Commits: 4 since last ship
Key changes:
- GigSalad Top Performer (blue) badge placed next to Thumbtack in hero section and navigation
- Reviews page converted from single Thumbtack banner to side-by-side achievement cards with logos and left-aligned text
Lesson: This project had no .git directory locally despite having a GitHub remote - bsync likely stripped it. Reconnecting required staging all untracked files before merging to reconcile main-only commits back into dev.

## 2026-05-14 | SHIP | 5dde603..d84c2c8

Shipped: Tarot Foundations 4-week course (June 2026) added as newest upcoming event on /events page
Commits: 3 since last ship
Key changes:
- New event entry with full course details, pricing ($144), discount codes, curriculum, and Eventbrite registration link
- Custom flyer image (Holly's Kumara Academy design) added to public/images

## 2026-07-03 08:50 | aa3e4ff

SEO: unique titles/descriptions, canonicals, LocalBusiness schema, H1 hierarchy


## 2026-07-03 08:59 | 5907a7a

Add sitemap.xml + robots.txt (Next metadata routes)


## 2026-07-03 09:00 | 2adf6e1

Add /seo audit workspace: site profile + 2026-07-03 fix-pass record


## 2026-07-04 13:44 | 4abc9a2

chore: WIP sync snapshot 2026-07-04


## 2026-07-04 13:53 | 32d68e6

chore: WIP sync snapshot 2026-07-04


## 2026-07-04 14:07 | ba296b3

chore: WIP sync snapshot 2026-07-04


## 2026-07-08 21:40 | 4129d59

chore: WIP sync snapshot 2026-07-08


## 2026-07-08 22:09 | 294d316

chore: WIP sync snapshot 2026-07-08


## 2026-07-08 22:36 | b1963ef

chore: WIP sync snapshot 2026-07-08


## 2026-07-08 22:45 | 98b1b77

chore: WIP sync snapshot 2026-07-08


## 2026-07-18 14:40 | ffa3712

Fix FormSubmit autoresponse: use lowercase email field for attendee confirmation


## 2026-07-22 11:25 | 1ef211e

fix(seo): derive sitemap routes from app/, add the Magic of Tarot class page


## 2026-07-23 17:38 | c855bcf

chore: WIP sync snapshot 2026-07-23


## 2026-07-26 13:07 | e341f27

chore: WIP sync snapshot 2026-07-26


## 2026-07-31 15:16 | fb40208

chore: WIP sync snapshot 2026-07-31


## 2026-08-06 17:46 | 6062b41

fix(seo): og:image on every page, llms.txt, and the entity-name conflict


## 2026-08-14 11:32 | a800e36

fix(email): replace FormSubmit with first-party Gmail SMTP for signup + contact lanes


## 2026-08-14 11:46 | 455db74

chore: ignore all .env variants (added by vercel link)


## 2026-08-14 11:59 | faaf4e1

feat(email): Holly notifications note the list-add and link the Google Sheet


## 2026-08-18 18:49 | d3e6a78

feat(events+tarotdoxa): Holly's Aug-Sep 2026 events, Tarotdoxa page + banner + navbar, Card of the Day


## 2026-08-19 15:38 | 86342a3

feat(site): Tarotdoxa T logo as the site favicon


## 2026-08-21 10:10 | f01f4b8

chore: WIP sync snapshot 2026-08-21


## 2026-08-21 13:10 | 71eb717

chore: WIP sync snapshot 2026-08-21


## 2026-08-21 13:27 | b5d8b00

chore: WIP sync snapshot 2026-08-21


## 2026-08-28 16:29 | cfec208

chore: WIP sync snapshot 2026-08-28


## 2026-08-28 19:01 | cdf2a2e

chore: WIP sync snapshot 2026-08-28


## 2026-08-29 18:32 | 7e7d1b3

chore: WIP sync snapshot 2026-08-29


## 2026-09-04 14:35 | 9b4780a

chore: WIP sync snapshot 2026-09-04


## 2026-09-13 | SHIP | /videos: interactive choose-your-own-adventure readings page

Shipped: new /videos page (nav "Videos") that embeds Holly's YouTube channel and turns her monthly interactive readings into a native pick-a-card flow: choose Money & Career or Love & Relationships, the short intro plays, three face-down cards sit under the player, the IFrame Player API reports when the intro ends and the cards start "calling", tapping one flips it and plays that reading in the same player; hash deep links (/videos#love/2025-10/2); "Every reading so far" archive for both rounds (Sept + Oct 2025); the rest of the channel (lessons, season readings, card care, welcome) as click-to-play cards; JSON-LD ItemList of 23 VideoObjects.
Key changes:
- lib/youtube-videos.ts is the single data file (all 23 videos, pulled with yt-dlp 2026-09-13). New month = one ROUNDS entry + 8 videos.
- middleware.ts CSP now allows www.youtube.com scripts and youtube-nocookie.com/youtube.com frames; next.config.mjs allows i.ytimg.com thumbnails.
- Header link row moved from md to lg (hamburger through 1023px). The live site already overflowed the viewport from 768 to about 850px wide with 9 links; a 10th made it worse.
- layout.tsx sameAs gained the channel URL; llms.txt lists the page.
Verified: npm run build green; Playwright smoke (scratchpad smoke.mjs, 36 checks) on the local prod build at 1440/1280/1024/768/390: CSP headers, JSON-LD count, topic pick, real ENDED event from the player API after the 42 s intro, card pick + hash, topic/round switches, start over, archive jump, grid embed, deep-link restore, no horizontal overflow, mobile menu has Videos; 0 console errors.
Lesson: rebuilding while `next start` is still running leaves the old process serving old HTML against new chunk names (unstyled page). Kill by port (lsof -t -iTCP:PORT) before rebuilding; pkill -f "next start" did not catch it.

## 2026-09-13 09:43 | 38fbaed

feat(videos): interactive choose-your-own-adventure readings page from Holly's YouTube channel


## 2026-09-13 09:46 | bafed63

test(videos): keep the /videos Playwright smoke test in the repo


## 2026-09-13 | SHIP | /videos cards are now the real Tarotdoxa art

Russ, after seeing the page ("Holly was so excited"): make every card on the page the actual Tarotdoxa card art, like the back of the cards in the app. Every face-down card (hero fan, the mini fans on the two path cards, the three pick cards) is now https://tarotdoxa.com/cardback.jpg, the same file the app and /tarotdoxa use, shown untouched at its own 369x640 ratio with a small purple number chip. A picked reading flips to a real deck card from https://tarotdoxa.com/cards/{id}.jpg: Money 1/2/3 = Ace, Nine, Ten of Pentacles; Love 1/2/3 = The Lovers, Two of Cups, Ten of Cups (fixed and decorative, not the cards Holly pulls). The drawn gradient cards and the shimmer CSS are gone.
Verified: build green; the 34-check smoke on the local prod build; screenshots at 1440 and 390 read back (hero fan, path cards, pick cards, flipped face with a one-line Now playing pill).
