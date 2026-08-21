Phase: Holly's Aug-Sep 2026 events onto crystalseedtarot.com/events + new /tarotdoxa page + home banner + navbar link. Ships to production on push to main (Vercel).
1. All five new event entries use Holly's verbatim email copy; only mechanical adaptations: "Register at the link above" arrows flipped to "below", and two typo fixes ("It's.our" -> "It's our", "study Tarot though" -> "through").
2. Event dates/times were verified against Kumara Academy pages' JSON-LD (Aug 20 6:00-7:30pm, Aug 26 6:00-7:00pm, Sep 2 6:00-7:00pm, course Sundays Sep 6-27 2:00-4:00pm PT).
3. CardOfTheDay picks deterministically from an America/Los_Angeles date-string hash, client-side after mount to avoid hydration mismatch. All 78 ids verified to have live images at tarotdoxa.com/cards/{id}.jpg.
4. New pages hotlink images from tarotdoxa.com (our own property) through the Next image optimizer; remotePatterns added; optimizer returned 200 locally for wordmark + cardback.
5. Events sort uses build-time `now` (page is static): upcoming events sort soonest-first above past events. Known behavior: boundary only refreshes on redeploy.
6. Navigation fix removed an inline display:block that overrode md:hidden (hamburger showed on desktop). Verified hamburger hidden at 1440px, visible at 390px.
7. Unverified: production Vercel image optimization for the remote host (verified only locally); Contentful featuredImage remote URLs were never in remotePatterns before and are unchanged by this diff.
