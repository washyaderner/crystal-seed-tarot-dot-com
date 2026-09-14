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

## 2026-09-13 10:17 | 6f9bba1

feat(videos): every card is the real Tarotdoxa art


## 2026-09-13 14:17 | 325ad8e

fix(site): Crystal Seed crystal favicon replaces the Tarotdoxa T


## 2026-09-13 | SHIP | Crystal Seed crystal favicon replaces the Tarotdoxa T

Russ: "crystalseedtarot.com is using tarotdoxa's logo as its favicon. please fix that". The Tarotdoxa T had been app/favicon.ico, app/icon.png and app/apple-icon.png since 86342a3 (8/19). Holly has no official logo (header is text, YouTube avatar is a photo, the old WordPress site used the WP default, .tmp/logos are unpicked drafts), so the icon is the gold crystal from crystal-seed-signup/public/icon.svg, scaled up with a heavier rim and brighter facets because the original read as dark mush at 16 and 32 px. Source SVGs and the generator: tools/favicon/ (build.py rebuilds all three files byte for byte).
Verified: npm run build green; local next start served all three files with md5 equal to source and the new hashed links on /, /videos, /tarotdoxa, /about; production deployment 6426568129 (325ad8e) success; live HTML carries icon.png?8189702cbe22ada7 and apple-icon.png?671bf0ed493b21ed and no old hash; live /favicon.ico (plain and cache-busted), icon.png and apple-icon.png all md5-match the new files.
Gotcha: Cloudflare sits in front of Vercel and icon files carry max-age=14400; none of CF_DNS_TOKEN, CF_CACHE_PURGE_TOKEN, CLOUDFLARE_API_TOKEN can purge this zone (10000 Authentication error). The Portland edge picked up the new favicon.ico within a minute anyway.

## 2026-09-13 15:10 | d141386

feat(brand): Russ's Crystal Seed logo and favicon across the site


## 2026-09-13 | SHIP | Russ's official Crystal Seed logo and favicon

Russ made a logo (1254 square, crystal + CRYSTAL SEED / TAROT wordmark) and a favicon (1024, crystal alone): "distribute them accordingly please". Originals: /Users/studio/Build/_biz/Crystal Seed Tarot/Brand/. On this site (d141386): favicon.ico/icon.png/apple-icon.png from public/images/brand/crystal-seed-mark.png (resized only, tools/favicon/build.py), a 40px crystal mark before the site name in the header (lg nav spacing space-x-3 so 1024 still fits), JSON-LD logo = /images/brand/crystal-seed-logo.jpg. OG images left alone on purpose. The interim gold crystal SVGs are retired. Same pass: sign-up PWA (e3da7a5) and Flyer Studio (8950b73) got the favicon too.
Verified: build green; header measured on the local build and on production at 390/768/1023/1024/1280/1440, no overflow; production deployment 6427068706 success; 12 of 12 live checks (new icon hashes in HTML, no old hash, JSON-LD logo, header img, spacing class, favicon plain and cache-busted, icon.png, apple-icon.png, logo JPEG bytes, optimized mark 200 avif).
Open: Holly's social profile pictures need her logins (inbox line 8, kit_gates da767315).

## 2026-09-13 15:59 | 702a55c

feat(videos): true card shapes, Crystal Seed number chips, YouTube-red play


## 2026-09-13 | SHIP | /videos restyle: true card shapes, brand number chips, YouTube red, dollar sign, cut-out mark, T icon

Russ (screenshots): the little cards' corners looked cut; numbers and CTAs should fit the rest of the site and the new logo instead of purple; red for YouTube on the play buttons; money icon just a dollar sign like the heart; no background on the nav crystal; the real Tarotdoxa T in the home banner. Shipped in 702a55c: card backs clip with the art's own corner curve (CARD_BACK_RADIUS 8.7% / 5%, measured ~30.5px on 369x640) instead of a fixed 12px; deck faces at their own 350:600 box; .brand-chip number badges (ivory numeral, champagne ring, maroon core, crystal glow); white outline CTAs like every other page; YouTube red icon, play buttons and archive badges; DollarSign topic icon; header crystal cut out (tools/favicon/cutout.py); banner T icon from tarotdoxa.com/icon-t-clean.jpg.
Verified: build green; local 38/38 restyle checks + smoke 34/34; production deployment 6427506768 success; live 38/38 restyle checks (card ratios and radii at 1440 and 390, flipped face 350:600, no solid purple fills, red play, dollar icons, header fits at six widths, cut-out mark, banner icon) + live smoke 34/34, 0 console errors.

## 2026-09-13 16:16 | 8aa3b44

feat(videos): number chips light up from dark to the lit crystal; path step unnumbered


## 2026-09-13 | SHIP | /videos: path step unnumbered, number chips glow from dark to the lit crystal

Russ: "On Choose a Path: 1. Watch the intro. 2. Pick your reading." How it works "for Pick Your Path: 1. Watch the short intro. 2. Choose your reading." And "different levels of darkness to glowing of the Crystal Seed logo, from the current dark look to the glowing amber/pink of the actual crystal". Shipped in 8aa3b44: progress row = Choose a path, 1 Watch the intro, 2 Pick your reading ("Your reading" step removed); How it works = Pick your path ($ and heart icons, no number), 1 Watch the short intro, 2 Choose your reading. New .brand-chip-2 (ember) and .brand-chip-3 (lit crystal) with colors sampled from the cut-out crystal; chipGlowClass lights a sequence first-dark to last-lit (cards 1/2/3, How it works 1/2); progress chips light by state (dark ahead, ember current, lit done).
Verified: build green; local 52/52 checks + smoke 34/34; production deployment 6427652363 success; live 52/52 checks; live smoke 34/34 three times: run 1 logged one console error whose text my filter hid, runs 2 and 3 had 0 errors.

## 2026-09-13 16:38 | 16f96a1

feat(videos): choose-your-own-adventure path tree; How it works icons only


## 2026-09-13 | SHIP | /videos: choose-your-own-adventure path tree; How it works icons only

Russ: the 1 and 2 on How it works "don't make sense", use just the play and click icons (keep dollar + heart on Pick your path); drop the sequential steps and illustrate the adventure: Start, then Money or Love, three readings on each, nine nodes, each tier its own color like the hero cards, every node labeled. Shipped in 16f96a1: components/videos/PathTree.tsx replaces the progress row (tier colors dark/ember/lit, dotted open paths, solid lit path taken, other branch faded, current node outlined); How it works cards show icons only. Also fixed a pre-existing sideways scroll on phones once the player mounts (.player-glow::before bled 5 to 6px past the edge; #start now overflow-x-clip).
Verified: build green; local 55/55 checks + smoke 34/34; production deployment 6427835811 success; live sideways scroll 0px at start, after Love, after reading 2; live 55/55 checks; live smoke 34/34 with 0 console errors.

## 2026-09-13 17:19 | 55ba563

feat(services): a real photo of Holly on every service card


## 2026-09-13 | SHIP | /services: a real photo of Holly on every service card

Russ asked for images for the four service cards. Sources checked: public/images, _biz/Crystal Seed Tarot, the Pics & Vids drive, the vault, and Holly's last 60 Instagram posts (Apify apify/instagram-scraper). Shipped in 55ba563, all Holly's own photos: Private Readings = About-Holly-Rocky-2022 (unused before); Private Events/Party Readings = her candlelit table at the May 2026 1920s wedding at Cornelius Pass Roadhouse (from Instagram, saved 2000px, no metadata); Private Tarot Lessons = About-Holly-Nicole-Laughing-2022; Private Group Tarot Lessons = About-Holly-Kyle-Reading (no photo of an in-person group class exists in any source checked). Also fixed a pre-existing 186px sideways scroll on phones from the whitespace-nowrap tagline.
Verified: build green; local 32/32 checks at 1440/1024/768/390; production deployment 6428180941 success; live 32/32 checks (right photo per card, loaded, 3:2, 0px sideways scroll, no console errors); live viewport screenshots read back.

## 2026-09-13 18:14 | 180382e

feat(services): real group class photo on Private Group Tarot Lessons


## 2026-09-13 | SHIP | /services: real group class photo on Private Group Tarot Lessons

Russ sent two class photos and picked the wide one (~/Downloads/IMG_3530.JPG, iPhone 2026-03-29, Holly teaching a full room at round tables). Shipped in 180382e as public/images/Services-Group-Tarot-Class-2026.jpg (2000x1500, metadata stripped, no GPS in the original), objectPosition 50% 80% so the 3:2 trim takes ceiling, not people. Replaces the Kyle stand-in.
Verified: build green; local 32/32 checks at 1440/1024/768/390; production deployment 6428669316 success; live 32/32 checks; live screenshots read back.

## 2026-09-14 12:03 | 42613f3

feat(videos): general readings as a third path; a round may carry one, two or all three


## 2026-09-14 13:06 | e90ab17

feat(videos): the path tree is a fixed map with General in the center


## 2026-09-14 13:59 | a408d7d

feat(brand): Russ's pink Crystal Seed favicon replaces the red-orange crystal


## 2026-09-14 13:59 | df179f7

feat(brand): Russ's pink Crystal Seed favicon replaces the red-orange crystal


## 2026-09-14 | SHIP | Russ's pink Crystal Seed favicon replaces the red-orange crystal

Russ: "This is Holly's new favicon. Replace the current one on her site with this one, please" (1254 square, _biz/Crystal Seed Tarot/logo/exec-45ba43e3-c840-4a7a-8237-f3085c3c1d5f.png; a Brand/Pink 2026-09-14/ folder made at 1:15 PM already held a 1024 copy, 16/32 exports and the generation prompts). Same crystal, rose-pink (mean hue 343 deg) instead of red-orange (hue 5 deg), same flat #0e030a background (within 4 levels), so both build scripts ran unchanged: tools/favicon/build.py rebuilt app/favicon.ico (16/32/48), app/icon.png (512), app/apple-icon.png (180); tools/favicon/cutout.py rebuilt the header mark and the /videos Start node (323x480, was 320x480; the header shows it 30x45, a 1 percent ratio change). JSON-LD logo (the wordmark version) unchanged: no new logo was supplied. The same crystal shipped to Flyer Studio (2ee3570, Worker version adac0e2f) and the sign-up PWA (8a42b04, Worker version 225152f1).
Verified: build green; commit df179f7 (the first push dropped mid-transfer with "unexpected disconnect while reading sideband packet" and left the remote untouched; the second push landed); GitHub deployment 6446354278 success 2:00 PM; live: HTML links icon.png?0aa01f6a8a139031 and apple-icon.png?dc5424788aa22afd with the old hashes gone, favicon.ico (plain and cache-busted), icon.png, apple-icon.png and the cutout PNG md5-match the committed files (5 of 5), and the header image through the next/image optimizer measures hue 343 (pink). Cloudflare served the new plain /favicon.ico on the first read (cf-cache-status EXPIRED).
