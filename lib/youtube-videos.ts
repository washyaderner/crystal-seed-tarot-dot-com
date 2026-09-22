/**
 * Holly's YouTube channel, as data.
 *
 * The videos themselves live in ./youtube-videos.json (ids, titles, durations
 * and upload dates are YouTube's own, pulled with yt-dlp; the blurbs are ours,
 * written for the cards on /videos). execution/videos-watch.py reads the channel
 * every night, classifies anything new and appends it there, so keep the data
 * in the JSON and the shapes, helpers and copy in this file.
 *
 * The interactive readings come in monthly rounds. Each round has, per topic,
 * one short intro where Holly lays out three readings, and the three readings
 * themselves. On YouTube the choice is made through the cards at the end of the
 * intro; on /videos the same choice is made with the three cards under the
 * player. A round may carry any of the three topics (Money & Career, Love &
 * Relationships, a General reading with no topic at all); the page shows only
 * the topics a round has. To add a round: add its entry to ROUNDS (newest
 * first) and its videos below with the matching `round` key (one intro plus
 * three readings per topic). By hand: edit the JSON. By the watchdog: it does
 * the same edit, then builds, commits, pushes and checks the live page.
 */

import channel from "./youtube-videos.json";

export type Topic = "money" | "love" | "general";
/** The order the paths are shown in, everywhere: Money on the left, General in the center, Love on the right */
export const TOPIC_ORDER: Topic[] = ["money", "general", "love"];
export type Choice = 1 | 2 | 3;
export interface Round {
  /** YYYY-MM, the month of the set; also the round key in hash links */
  key: string;
  /** "September 2026" */
  label: string;
  /** "Sept 2026" */
  short: string;
}
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
 * Number chips light up from dark to the lit crystal along a sequence (app/globals.css):
 * the first item keeps the dark look, the last is fully lit, a middle item sits between.
 */
export function chipGlowClass(position: number, count: number): string {
  if (count <= 1 || position <= 1) return "";
  if (position >= count) return "brand-chip-3";
  return "brand-chip-2";
}

/**
 * The deck card a picked reading flips over to. Decorative and fixed: Pentacles
 * for money and career, the Lovers and Cups for love, three bright majors for a
 * general reading. Not the cards Holly pulls in the video. Ids and names match
 * lib/tarotdoxa-cards.ts (kept out of the client bundle on purpose; nine cards
 * do not need the whole deck).
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
  general: {
    1: { id: "ar17", name: "The Star" },
    2: { id: "ar19", name: "The Sun" },
    3: { id: "ar10", name: "Wheel of Fortune" },
  },
};

export const CHANNEL_NAME = "Crystal Seed Tarot";
export const CHANNEL_HANDLE = "@CrystalSeedTarot";
export const CHANNEL_URL = "https://www.youtube.com/@CrystalSeedTarot";
export const SUBSCRIBE_URL = "https://www.youtube.com/@CrystalSeedTarot?sub_confirmation=1";

/** Newest first, straight from the JSON */
export const ROUNDS: Round[] = channel.rounds;

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
  general: {
    label: "General Reading",
    short: "General",
    tagline: "No topic. Whatever the cards want you to know right now.",
    question: "What do the cards want you to know right now?",
  },
};

/**
 * Every video on the channel, newest first, straight from the JSON. The cast is
 * the only place the JSON's plain strings become the union types above; the
 * watchdog validates every row (kinds, topics, choices, round keys, unique ids)
 * before it commits, and the smoke test reads the same file.
 */
export const VIDEOS: ChannelVideo[] = channel.videos as ChannelVideo[];

/**
 * The JSON is plain data, so the cast above cannot catch a bad row. This runs once
 * when the module loads (at build time, on Vercel too) and throws with the row named,
 * so a malformed entry fails the build instead of rendering a broken card.
 */
(function checkChannelData() {
  const kinds: VideoKind[] = ["welcome", "intro", "reading", "lesson", "season", "care"];
  const seen = new Set<string>();
  for (const v of VIDEOS) {
    const where = `youtube-videos.json ${v.id || "(no id)"}: `;
    if (!/^[A-Za-z0-9_-]{11}$/.test(v.id)) throw new Error(where + "id is not a YouTube id");
    if (seen.has(v.id)) throw new Error(where + "duplicate id");
    seen.add(v.id);
    if (!v.title) throw new Error(where + "missing title");
    if (!kinds.includes(v.kind)) throw new Error(where + `unknown kind ${String(v.kind)}`);
    if (!Number.isInteger(v.duration) || v.duration <= 0) throw new Error(where + "duration must be whole seconds");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.published)) throw new Error(where + "published must be YYYY-MM-DD");
    if (typeof v.blurb !== "string" || !v.blurb) throw new Error(where + "missing blurb");
    const interactive = v.kind === "intro" || v.kind === "reading";
    if (interactive) {
      if (!isTopic(v.topic)) throw new Error(where + `topic ${String(v.topic)} is not one of ${TOPIC_ORDER.join(", ")}`);
      if (!ROUNDS.some((r) => r.key === v.round)) throw new Error(where + `round ${String(v.round)} is not in rounds`);
    }
    if (v.kind === "reading" && ![1, 2, 3].includes(v.choice as number)) throw new Error(where + "reading needs choice 1, 2 or 3");
  }
  for (const r of ROUNDS) {
    if (!/^\d{4}-\d{2}$/.test(r.key) || !r.label || !r.short) throw new Error(`youtube-videos.json round ${r.key}: needs key YYYY-MM, label and short`);
  }
})();

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

/** The topics a round actually has (an intro or readings with that round key), in TOPIC_ORDER */
export function topicsInRound(round: string): Topic[] {
  return TOPIC_ORDER.filter((t) =>
    VIDEOS.some((v) => (v.kind === "intro" || v.kind === "reading") && v.topic === t && v.round === round),
  );
}

export function isTopic(value: string | undefined): value is Topic {
  return value !== undefined && (TOPIC_ORDER as string[]).includes(value);
}

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
