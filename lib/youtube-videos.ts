/**
 * Holly's YouTube channel, as data.
 *
 * Every video on https://www.youtube.com/@CrystalSeedTarot as of 2026-09-13,
 * pulled with yt-dlp (ids, titles, durations, upload dates are YouTube's own).
 * The blurbs are ours, written for the cards on /videos.
 *
 * The interactive readings come in monthly rounds. Each round has, per topic,
 * one short intro where Holly lays out three readings, and the three readings
 * themselves. On YouTube the choice is made through the cards at the end of the
 * intro; on /videos the same choice is made with the three cards under the
 * player. To add a round: add its entry to ROUNDS (newest first) and its eight
 * videos below with the matching `round` key.
 */

export type Topic = "money" | "love";
export type Choice = 1 | 2 | 3;
export type VideoKind = "welcome" | "intro" | "reading" | "lesson" | "season" | "care";

export interface ChannelVideo {
  /** YouTube video id */
  id: string;
  /** Title as published on YouTube */
  title: string;
  kind: VideoKind;
  /** Seconds, from YouTube */
  duration: number;
  /** YYYY-MM-DD, YouTube upload date */
  published: string;
  /** One line for the cards on this site */
  blurb: string;
  /** Interactive videos only */
  topic?: Topic;
  /** Interactive videos only, matches a ROUNDS key */
  round?: string;
  /** Readings only: which of the three */
  choice?: Choice;
}

/** The Tarotdoxa card back, the same file the app and the /tarotdoxa page use (369x640) */
export const CARD_BACK_URL = "https://tarotdoxa.com/cardback.jpg";
export const CARD_BACK_RATIO = "369 / 640";
/**
 * The card back art has its own rounded corners (about 30.5px on the 369x640 file) with white
 * outside them. Clip with the same curve as a share of width / height so it holds at any size;
 * a hair larger than measured so no white shows at the corners.
 */
export const CARD_BACK_RADIUS = "8.7% / 5%";
/** Deck faces are 350x600 rectangles with a white margin; a small real-card corner stays inside it. */
export const CARD_FACE_RATIO = "350 / 600";
export const CARD_FACE_RADIUS = "4% / 2.33%";
export const cardFaceUrl = (id: string) => `https://tarotdoxa.com/cards/${id}.jpg`;

/**
 * The deck card a picked reading flips over to. Decorative and fixed: Pentacles
 * for money and career, the Lovers and Cups for love. Not the cards Holly pulls
 * in the video. Ids and names match lib/tarotdoxa-cards.ts (kept out of the
 * client bundle on purpose; six cards do not need the whole deck).
 */
export const REVEAL_CARDS: Record<Topic, Record<Choice, { id: string; name: string }>> = {
  money: {
    1: { id: "peac", name: "Ace of Pentacles" },
    2: { id: "pe09", name: "Nine of Pentacles" },
    3: { id: "pe10", name: "Ten of Pentacles" },
  },
  love: {
    1: { id: "ar06", name: "The Lovers" },
    2: { id: "cu02", name: "Two of Cups" },
    3: { id: "cu10", name: "Ten of Cups" },
  },
};

export const CHANNEL_NAME = "Crystal Seed Tarot";
export const CHANNEL_HANDLE = "@CrystalSeedTarot";
export const CHANNEL_URL = "https://www.youtube.com/@CrystalSeedTarot";
export const SUBSCRIBE_URL = "https://www.youtube.com/@CrystalSeedTarot?sub_confirmation=1";

export const ROUNDS: { key: string; label: string; short: string }[] = [
  { key: "2025-10", label: "October 2025", short: "Oct 2025" },
  { key: "2025-09", label: "September 2025", short: "Sept 2025" },
];

export const TOPICS: Record<
  Topic,
  { label: string; short: string; tagline: string; question: string }
> = {
  money: {
    label: "Money & Career",
    short: "Money",
    tagline: "Work, money, and the path you are building.",
    question: "What do the cards want you to know about your money and career path right now?",
  },
  love: {
    label: "Love & Relationships",
    short: "Love",
    tagline: "Partners, people, and what your heart wants to know.",
    question: "What do the cards want you to know about love and relationships right now?",
  },
};

const readingBlurb = (topic: Topic, round: string, choice: Choice) =>
  `${TOPICS[topic].label} reading ${choice} of 3 for ${ROUNDS.find((r) => r.key === round)?.label}.`;

export const VIDEOS: ChannelVideo[] = [
  // October 2025 round
  {
    id: "MS6HI6c15T0",
    title: "Interactive Tarot - Money & Career Intro (Oct 2025)",
    kind: "intro",
    topic: "money",
    round: "2025-10",
    duration: 42,
    published: "2025-10-24",
    blurb: "Holly lays out three money and career readings. Pick the one that pulls at you.",
  },
  {
    id: "gaH-kOJgvxs",
    title: "Interactive Tarot Reading - Money & Career #1 (Oct 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-10",
    choice: 1,
    duration: 639,
    published: "2025-10-24",
    blurb: readingBlurb("money", "2025-10", 1),
  },
  {
    id: "tpEw4FYLl3I",
    title: "Interactive Tarot Reading - Money & Career #2 (Oct 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-10",
    choice: 2,
    duration: 422,
    published: "2025-10-24",
    blurb: readingBlurb("money", "2025-10", 2),
  },
  {
    id: "1Pg69yLaK18",
    title: "Interactive Tarot Reading - Money & Career #3 (Oct 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-10",
    choice: 3,
    duration: 753,
    published: "2025-10-24",
    blurb: readingBlurb("money", "2025-10", 3),
  },
  {
    id: "9e3DURlOcs4",
    title: "Interactive Tarot - Love & Relationships Intro (Oct 2025)",
    kind: "intro",
    topic: "love",
    round: "2025-10",
    duration: 43,
    published: "2025-10-24",
    blurb: "Holly lays out three love readings. Pick the one that pulls at you.",
  },
  {
    id: "kdLTrf67f_A",
    title: "Interactive Tarot Reading - Love & Relationships #1 (Oct 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-10",
    choice: 1,
    duration: 730,
    published: "2025-10-24",
    blurb: readingBlurb("love", "2025-10", 1),
  },
  {
    id: "ep1YSRLGo8E",
    title: "Interactive Tarot Reading - Love & Relationships #2 (Oct 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-10",
    choice: 2,
    duration: 504,
    published: "2025-10-24",
    blurb: readingBlurb("love", "2025-10", 2),
  },
  {
    id: "YE9ozNCag5k",
    title: "Interactive Tarot Reading - Love & Relationships #3 (Oct 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-10",
    choice: 3,
    duration: 774,
    published: "2025-10-24",
    blurb: readingBlurb("love", "2025-10", 3),
  },

  // September 2025 round, the first one
  {
    id: "71ZoRwWras0",
    title: "Interactive Tarot - Money & Career Intro Sept 2025",
    kind: "intro",
    topic: "money",
    round: "2025-09",
    duration: 31,
    published: "2025-09-09",
    blurb: "The very first round. Holly offers three money and career readings to choose from.",
  },
  {
    id: "luTVmK6UZ1I",
    title: "Interactive Tarot Reading - Money & Career #1 (Sept 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-09",
    choice: 1,
    duration: 766,
    published: "2025-09-09",
    blurb: readingBlurb("money", "2025-09", 1),
  },
  {
    id: "tYu8i5efk1s",
    title: "Interactive Tarot Reading - Money & Career #2 (Sept 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-09",
    choice: 2,
    duration: 751,
    published: "2025-09-09",
    blurb: readingBlurb("money", "2025-09", 2),
  },
  {
    id: "vwJm9y-dPk8",
    title: "Interactive Tarot Reading - Money & Career #3 (Sept 2025)",
    kind: "reading",
    topic: "money",
    round: "2025-09",
    choice: 3,
    duration: 692,
    published: "2025-09-09",
    blurb: readingBlurb("money", "2025-09", 3),
  },
  {
    id: "nuZpHWGVIH8",
    title: "Interactive Tarot - Love & Relationships Intro Sept 2025",
    kind: "intro",
    topic: "love",
    round: "2025-09",
    duration: 31,
    published: "2025-09-09",
    blurb: "The very first round. Holly offers three love readings to choose from.",
  },
  {
    id: "Zt82372f6p0",
    title: "Interactive Tarot Reading - Love & Relationships #1 (Sept 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-09",
    choice: 1,
    duration: 685,
    published: "2025-09-09",
    blurb: readingBlurb("love", "2025-09", 1),
  },
  {
    id: "r97BI6uLfVE",
    title: "Interactive Tarot Reading - Love & Relationships #2 (Sept 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-09",
    choice: 2,
    duration: 555,
    published: "2025-09-09",
    blurb: readingBlurb("love", "2025-09", 2),
  },
  {
    id: "MKg3G4qECyY",
    title: "Interactive Tarot Reading - Love & Relationships #3 (Sept 2025)",
    kind: "reading",
    topic: "love",
    round: "2025-09",
    choice: 3,
    duration: 707,
    published: "2025-09-09",
    blurb: readingBlurb("love", "2025-09", 3),
  },

  // The rest of the channel
  {
    id: "1E_-ACF3sME",
    title: "Crystal Seed Tarot Introduction",
    kind: "welcome",
    duration: 509,
    published: "2025-07-25",
    blurb: "Meet Holly, hear how Crystal Seed Tarot started, and learn how the monthly readings work.",
  },
  {
    id: "47UOQXY1LLU",
    title: "Tarot Lesson - The Wands - What Fires You Up?",
    kind: "lesson",
    duration: 2248,
    published: "2025-12-20",
    blurb: "Wands are fire. Holly breaks down what that means for your energy, drive, and spirit, so the suit finally makes sense.",
  },
  {
    id: "Tcc9MKQ56TI",
    title: "Swords in Tarot: Why This Suit Isn't as Bad as You Think",
    kind: "lesson",
    duration: 1488,
    published: "2025-11-12",
    blurb: "Swords get a bad rap. Holly explains why the suit of air is not the villain of the deck.",
  },
  {
    id: "xi3DOg93VeI",
    title: "Scorpio Season Tarot Reading: Release & Rebirth",
    kind: "season",
    duration: 793,
    published: "2025-10-24",
    blurb: "A death-and-rebirth season reading on what is ready to fall away so something new can grow.",
  },
  {
    id: "lTf9nGaJdMI",
    title: "Sagittarius Season Tarot Reading - Adventure... Within",
    kind: "season",
    duration: 884,
    published: "2025-12-20",
    blurb: "Adventure, but inward. A season reading on taking stock and setting your sights on the year ahead.",
  },
  {
    id: "msSg78S2wF8",
    title: "How I Store My Tarot Cards (And Why I Skip the Silk & Wooden Box)",
    kind: "care",
    duration: 372,
    published: "2026-03-10",
    blurb: "Holly's real setup after almost 20 years of reading, and the myths about silk and wooden boxes.",
  },
  {
    id: "hizuClTSsOo",
    title: "Cleaning Tarot Cards",
    kind: "care",
    duration: 331,
    published: "2026-03-12",
    blurb: "Holly's go-to method for resetting a deck's energy, with commentary from a very loud crow.",
  },
];

export const INTERACTIVE_VIDEOS = VIDEOS.filter((v) => v.kind === "intro" || v.kind === "reading");

export const CHANNEL_GROUPS: { title: string; blurb: string; videos: ChannelVideo[] }[] = [
  {
    title: "Tarot lessons",
    blurb: "Holly teaches Tarot for a living. These are full lessons, free.",
    videos: VIDEOS.filter((v) => v.kind === "lesson"),
  },
  {
    title: "Season readings",
    blurb: "A reading for the whole season, as the sun moves into a new sign.",
    videos: VIDEOS.filter((v) => v.kind === "season"),
  },
  {
    title: "Caring for your cards",
    blurb: "How Holly stores, cleans, and resets her decks.",
    videos: VIDEOS.filter((v) => v.kind === "care"),
  },
  {
    title: "Meet Holly",
    blurb: "The channel welcome, in her own words.",
    videos: VIDEOS.filter((v) => v.kind === "welcome"),
  },
];

export function getIntro(topic: Topic, round: string): ChannelVideo | undefined {
  return VIDEOS.find((v) => v.kind === "intro" && v.topic === topic && v.round === round);
}

export function getReadings(topic: Topic, round: string): ChannelVideo[] {
  return VIDEOS.filter((v) => v.kind === "reading" && v.topic === topic && v.round === round).sort(
    (a, b) => (a.choice ?? 0) - (b.choice ?? 0),
  );
}

export function getReading(topic: Topic, round: string, choice: Choice): ChannelVideo | undefined {
  return getReadings(topic, round).find((v) => v.choice === choice);
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function embedUrl(id: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: "0",
    playsinline: "1",
    modestbranding: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

/** `hq` (480x360, always exists) or `max` (1280x720; every current video has one) */
export function thumbUrl(id: string, quality: "hq" | "max" = "max"): string {
  return `https://i.ytimg.com/vi/${id}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`;
}

/** "42 sec", "7 min", "37 min" */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  return `${Math.round(seconds / 60)} min`;
}

/** ISO 8601 duration for schema.org, e.g. PT10M39S */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}
