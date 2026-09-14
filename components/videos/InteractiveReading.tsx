"use client";

import * as React from "react";
import Image from "next/image";
import {
  Check,
  DollarSign,
  ExternalLink,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardBack } from "./CardBack";
import { PathTree } from "./PathTree";
import { YouTubePlayer, type PlayerState } from "./YouTubePlayer";
import {
  CARD_BACK_RATIO,
  CARD_FACE_RADIUS,
  CARD_FACE_RATIO,
  REVEAL_CARDS,
  ROUNDS,
  TOPICS,
  SUBSCRIBE_URL,
  cardFaceUrl,
  formatDuration,
  getIntro,
  getReading,
  getReadings,
  isTopic,
  thumbUrl,
  topicsInRound,
  watchUrl,
  type ChannelVideo,
  type Choice,
  type Topic,
} from "@/lib/youtube-videos";

type Stage = "choose" | "intro" | "reading";

const CHOICES: Choice[] = [1, 2, 3];
const HEADER_OFFSET = 88;

const TOPIC_ICON: Record<Topic, React.ComponentType<{ className?: string }>> = {
  money: DollarSign,
  love: Heart,
  general: Sparkles,
};

/** md:grid-cols for one, two or three paths side by side */
const pathColumns = (count: number) =>
  count >= 3 ? "md:grid-cols-3" : count === 2 ? "md:grid-cols-2" : "mx-auto max-w-lg";

/** A small YouTube-red play badge for video thumbnails */
function YouTubePlayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex items-center justify-center rounded-[4px] bg-[#FF0000] text-white shadow shadow-black/40", className)}
      aria-hidden="true"
    >
      <Play className="h-2 w-2 fill-current" />
    </span>
  );
}

/** #money/2025-10, #money/2025-10/2 or #general/2026-09/1 */
function parseHash(hash: string): { topic: Topic; round: string; choice: Choice | null } | null {
  const [topic, round, choice] = hash.replace(/^#/, "").split("/");
  if (!isTopic(topic)) return null;
  if (!ROUNDS.some((r) => r.key === round)) return null;
  if (!topicsInRound(round).includes(topic)) return null;
  const n = choice ? Number(choice) : null;
  if (n !== null && !CHOICES.includes(n as Choice)) return null;
  return { topic, round, choice: n as Choice | null };
}

function buildHash(topic: Topic, round: string, choice: Choice | null): string {
  return `#${topic}/${round}${choice ? `/${choice}` : ""}`;
}

function scrollToWithOffset(el: HTMLElement | null) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

export function InteractiveReading() {
  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [roundKey, setRoundKey] = React.useState(ROUNDS[0].key);
  const [choice, setChoice] = React.useState<Choice | null>(null);
  const [introDone, setIntroDone] = React.useState(false);
  const [readingDone, setReadingDone] = React.useState(false);
  const [playToken, setPlayToken] = React.useState(0);
  const [playerMode, setPlayerMode] = React.useState<"api" | "iframe" | null>(null);
  const [hashSynced, setHashSynced] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  const stage: Stage = topic === null ? "choose" : choice === null ? "intro" : "reading";
  const round = ROUNDS.find((r) => r.key === roundKey) ?? ROUNDS[0];
  const intro = topic ? getIntro(topic, roundKey) : undefined;
  const readings = topic ? getReadings(topic, roundKey) : [];
  const current: ChannelVideo | undefined =
    topic && choice ? getReading(topic, roundKey, choice) : intro;
  // The paths this month offers (one, two or all three) and the ones not taken yet
  const roundTopics = topicsInRound(roundKey);
  const otherTopics: Topic[] = topic ? roundTopics.filter((t) => t !== topic) : [];

  // Restore a shared link like /videos#love/2025-10/2
  React.useEffect(() => {
    const parsed = parseHash(window.location.hash);
    if (parsed) {
      setTopic(parsed.topic);
      setRoundKey(parsed.round);
      setChoice(parsed.choice);
      if (parsed.choice) setIntroDone(true);
      window.setTimeout(() => scrollToWithOffset(stageRef.current), 50);
    }
    // Batched with the restores above, so the sync below sees the restored state
    setHashSynced(true);
  }, []);

  // The intro just ended: make sure the three cards are on screen
  React.useEffect(() => {
    if (!introDone || stage !== "intro") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardsRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [introDone, stage]);

  // Keep the URL in step so any state can be shared
  React.useEffect(() => {
    if (!hashSynced) return;
    const url = window.location.pathname + window.location.search;
    if (topic) {
      window.history.replaceState(null, "", url + buildHash(topic, roundKey, choice));
    } else if (parseHash(window.location.hash)) {
      window.history.replaceState(null, "", url);
    }
  }, [hashSynced, topic, roundKey, choice]);

  const start = (t: Topic) => {
    setTopic(t);
    setChoice(null);
    setIntroDone(false);
    setReadingDone(false);
    setPlayToken((n) => n + 1);
    window.setTimeout(() => scrollToWithOffset(stageRef.current), 30);
  };

  const pick = (c: Choice) => {
    setChoice(c);
    setReadingDone(false);
    setPlayToken((n) => n + 1);
    window.setTimeout(() => scrollToWithOffset(stageRef.current), 30);
  };

  const changeRound = (key: string) => {
    if (key === roundKey) return;
    setRoundKey(key);
    if (topic && !topicsInRound(key).includes(topic)) setTopic(null);
    setChoice(null);
    setIntroDone(false);
    setReadingDone(false);
    setPlayToken((n) => n + 1);
  };

  const replayIntro = () => {
    setChoice(null);
    setIntroDone(false);
    setReadingDone(false);
    setPlayToken((n) => n + 1);
  };

  const reset = () => {
    setTopic(null);
    setChoice(null);
    setIntroDone(false);
    setReadingDone(false);
    window.setTimeout(() => scrollToWithOffset(stageRef.current), 30);
  };

  const onPlayerState = React.useCallback(
    (state: PlayerState) => {
      if (state !== "ended") return;
      if (stage === "intro") setIntroDone(true);
      if (stage === "reading") setReadingDone(true);
    },
    [stage],
  );

  return (
    <div ref={stageRef} className="scroll-mt-24">
      {/* The adventure as a map: Start, Money or Love, three readings on each; your path lights up */}
      <PathTree topic={topic} choice={choice} topics={roundTopics} />

      {/* Round switcher */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Choose a month">
        {ROUNDS.map((r, i) => (
          <button
            key={r.key}
            type="button"
            onClick={() => changeRound(r.key)}
            aria-pressed={r.key === roundKey}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
              r.key === roundKey
                ? "border-white bg-white/15 text-white shadow-md shadow-black/30"
                : "border-white/30 bg-white/5 text-white/80 hover:border-white/60 hover:bg-white/10",
            )}
          >
            {r.label}
            {i === 0 && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-purple-200">newest</span>}
          </button>
        ))}
      </div>

      {stage === "choose" ? (
        /* Step 1: the paths this month offers */
        <div className={cn("grid gap-4 md:gap-6", pathColumns(roundTopics.length))}>
          {roundTopics.map((t) => {
            const Icon = TOPIC_ICON[t];
            const count = getReadings(t, roundKey).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => start(t)}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 text-left text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/60 hover:bg-white/15 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 md:p-8"
              >
                {/* Three little face-down cards, fanned */}
                <div className="pointer-events-none absolute -right-2 -top-3 h-28 w-32 opacity-80 transition-transform duration-500 group-hover:-translate-y-1 md:h-32 md:w-36" aria-hidden="true">
                  <CardBack small className="absolute left-2 top-6 w-12 -rotate-12 transition-transform duration-500 group-hover:-rotate-[18deg]" />
                  <CardBack small className="absolute left-10 top-3 w-12 transition-transform duration-500 group-hover:-translate-y-1" />
                  <CardBack small className="absolute left-[4.5rem] top-6 w-12 rotate-12 transition-transform duration-500 group-hover:rotate-[18deg]" />
                </div>
                <Icon className="mb-4 h-8 w-8 text-[#f8e4c8] transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-serif text-2xl md:text-3xl">{TOPICS[t].label}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/80 md:text-base">{TOPICS[t].tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-md border border-white px-4 py-1.5 text-sm font-medium transition-colors group-hover:bg-white/10">
                  <Play className="h-3.5 w-3.5" /> Start · {count} readings · {round.short}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        topic &&
        current && (
          <div>
            {/* Player header */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-purple-200 md:text-sm">
              <span>
                <span className="text-white">{TOPICS[topic].label}</span> · {round.label} ·{" "}
                {stage === "intro" ? "Intro" : `Reading ${choice}`} · {formatDuration(current.duration)}
              </span>
              <a
                href={watchUrl(current.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
              >
                Open on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Player */}
            <div className="player-glow relative rounded-xl border border-white/20 shadow-lg shadow-black/40">
              <YouTubePlayer
                videoId={current.id}
                title={current.title}
                playToken={playToken}
                onStateChange={onPlayerState}
                onModeChange={setPlayerMode}
              />
            </div>

            {/* Prompt line */}
            <p className="mt-4 text-center text-sm text-white/90 md:text-base" aria-live="polite">
              {stage === "intro" && !introDone && (
                <>
                  Holly is laying out your three readings. Quiet your mind and notice which one pulls at you.
                  {playerMode === "iframe" && " When you know, tap it below."}
                </>
              )}
              {stage === "intro" && introDone && (
                <span className="font-medium text-purple-100">Which one is calling you? Tap 1, 2, or 3.</span>
              )}
              {stage === "reading" && !readingDone && "You picked this reading for a reason. Take what resonates, leave what doesn't."}
              {stage === "reading" && readingDone && "That was your reading. Holly says the other two can add another angle."}
            </p>

            {/* The three cards */}
            <div
              ref={cardsRef}
              className="mx-auto mt-5 grid max-w-2xl scroll-mb-6 grid-cols-3 gap-3 sm:gap-5"
              role="group"
              aria-label="Pick a reading"
            >
              {readings.map((reading) => {
                const c = reading.choice as Choice;
                const selected = choice === c;
                const calling = stage === "intro" && introDone;
                const reveal = REVEAL_CARDS[topic][c];
                return (
                  <button
                    key={reading.id}
                    type="button"
                    onClick={() => pick(c)}
                    aria-pressed={selected}
                    aria-label={`${selected ? "Now playing: " : ""}Reading ${c}, ${formatDuration(reading.duration)}`}
                    className={cn(
                      "group relative rounded-xl text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
                      !selected && "hover:-translate-y-1.5",
                      choice !== null && !selected && "opacity-70 hover:opacity-100",
                    )}
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className={cn(
                        "relative w-full transition-transform duration-700 [transform-style:preserve-3d]",
                        selected && "[transform:rotateY(180deg)]",
                        calling && `card-calling card-calling-${c}`,
                      )}
                      style={{ aspectRatio: CARD_BACK_RATIO }}
                    >
                      {/* Back: the Tarotdoxa card back */}
                      <CardBack
                        number={c}
                        className="absolute inset-0 [backface-visibility:hidden] group-hover:shadow-black/70"
                      />
                      {/* Face: a card from the Tarotdoxa deck at its own 350x600 shape (a hair shorter
                          than the back, so it sits centered), with a Now playing mark along the bottom */}
                      <div
                        className="absolute inset-x-0 top-1/2 overflow-hidden bg-white shadow-lg shadow-black/50 [backface-visibility:hidden]"
                        style={{
                          aspectRatio: CARD_FACE_RATIO,
                          borderRadius: CARD_FACE_RADIUS,
                          transform: "translateY(-50%) rotateY(180deg)",
                        }}
                        aria-hidden="true"
                      >
                        <Image
                          src={cardFaceUrl(reveal.id)}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 33vw, 220px"
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-1 pb-2 pt-8 md:pb-3">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[#f8e4c8]/75 bg-[#14060c]/90 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-[#fdf7e4] shadow-md shadow-black/50 md:px-2.5 md:py-1 md:text-[10px] md:tracking-widest">
                            <Check className="h-2.5 w-2.5 md:h-3 md:w-3" /> Now playing
                          </span>
                          <span className="font-serif text-sm leading-none text-[#fdf7e4] [text-shadow:0_0_6px_rgba(255,150,100,0.65)] md:text-base">
                            {c}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="mt-2 block text-center text-xs text-white/80 md:text-sm">
                      Reading {c} <span className="text-white/50">· {formatDuration(reading.duration)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* After the reading: the other angles */}
            {stage === "reading" && readingDone && (
              <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-white/20 bg-white/10 p-4 text-center text-white backdrop-blur-md md:p-5">
                <p className="font-serif text-lg md:text-xl">Want another angle?</p>
                <p className="mt-1 text-sm text-white/80">
                  {otherTopics.length > 0
                    ? `Tap another card above, or see what the cards say about ${otherTopics.map((t) => TOPICS[t].label.toLowerCase()).join(" or ")}.`
                    : "Tap another card above for a second angle on this month."}
                </p>
                <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                  {otherTopics.map((t) => (
                    <Button key={t} variant="outline" size="sm" onClick={() => start(t)}>
                      {React.createElement(TOPIC_ICON[t], { className: "mr-2 h-4 w-4" })}
                      Try {TOPICS[t].label}
                    </Button>
                  ))}
                  <Button asChild variant="outline" size="sm">
                    <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="text-white">
                      <Youtube className="mr-2 h-4 w-4 text-[#FF0000]" /> Subscribe for next month
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {stage === "reading" && (
                <Button variant="outline" size="sm" onClick={replayIntro}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Replay the intro
                </Button>
              )}
              {otherTopics.map((t) => (
                <Button key={t} variant="outline" size="sm" onClick={() => start(t)}>
                  {React.createElement(TOPIC_ICON[t], { className: "mr-2 h-4 w-4" })}
                  Switch to {TOPICS[t].short}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={reset} className="text-white/70 hover:bg-white/10 hover:text-white">
                Start over
              </Button>
            </div>
          </div>
        )
      )}

      {/* Every reading so far, one tap away */}
      <div className="mt-12 md:mt-16">
        <h3 className="mb-1 text-center font-serif text-xl text-white md:text-2xl">Every reading so far</h3>
        <p className="mb-6 text-center text-sm text-white/70">
          Jump straight to any intro or reading. New sets arrive monthly.
        </p>
        <div className="space-y-6">
          {ROUNDS.map((r) => (
            <div key={r.key} className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-serif text-lg text-white">{r.label}</h4>
                {r.key === roundKey && topic && (
                  <span className="text-xs uppercase tracking-wider text-white/60">selected month</span>
                )}
              </div>
              <div className={cn("grid gap-4", pathColumns(topicsInRound(r.key).length))}>
                {topicsInRound(r.key).map((t) => {
                  const Icon = TOPIC_ICON[t];
                  const rIntro = getIntro(t, r.key);
                  const rReadings = getReadings(t, r.key);
                  return (
                    <div key={t}>
                      <div className="mb-2 flex items-center gap-2 text-sm text-white">
                        <Icon className="h-4 w-4 text-[#f8e4c8]" /> {TOPICS[t].label}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {rIntro && (
                          <button
                            type="button"
                            onClick={() => {
                              setRoundKey(r.key);
                              start(t);
                            }}
                            aria-current={topic === t && roundKey === r.key && choice === null ? "true" : undefined}
                            className={cn(
                              "group rounded-lg border p-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
                              topic === t && roundKey === r.key && choice === null
                                ? "border-white/70 bg-white/15"
                                : "border-white/15",
                            )}
                          >
                            <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                              <Image src={thumbUrl(rIntro.id, "hq")} alt="" fill sizes="120px" className="object-cover" />
                              <YouTubePlayBadge className="absolute bottom-1 right-1 h-3.5 w-5" />
                            </div>
                            <span className="mt-1 block truncate text-[11px] text-white/80 group-hover:text-white">
                              Intro · {formatDuration(rIntro.duration)}
                            </span>
                          </button>
                        )}
                        {rReadings.map((v) => {
                          const active = topic === t && roundKey === r.key && choice === v.choice;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setRoundKey(r.key);
                                setTopic(t);
                                setIntroDone(true);
                                pick(v.choice as Choice);
                              }}
                              aria-current={active ? "true" : undefined}
                              className={cn(
                                "group rounded-lg border p-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
                                active ? "border-white/70 bg-white/15" : "border-white/15",
                              )}
                            >
                              <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                                <Image src={thumbUrl(v.id, "hq")} alt="" fill sizes="120px" className="object-cover" />
                                <YouTubePlayBadge className="absolute bottom-1 right-1 h-3.5 w-5" />
                              </div>
                              <span className="mt-1 block truncate text-[11px] text-white/80 group-hover:text-white">
                                Reading {v.choice} · {formatDuration(v.duration)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
