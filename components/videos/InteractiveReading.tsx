"use client";

import * as React from "react";
import Image from "next/image";
import {
  Check,
  Coins,
  ExternalLink,
  Heart,
  Play,
  RotateCcw,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardBack } from "./CardBack";
import { YouTubePlayer, type PlayerState } from "./YouTubePlayer";
import {
  ROUNDS,
  TOPICS,
  SUBSCRIBE_URL,
  formatDuration,
  getIntro,
  getReading,
  getReadings,
  thumbUrl,
  watchUrl,
  type ChannelVideo,
  type Choice,
  type Topic,
} from "@/lib/youtube-videos";

type Stage = "choose" | "intro" | "reading";

const CHOICES: Choice[] = [1, 2, 3];
const HEADER_OFFSET = 88;

const TOPIC_ICON: Record<Topic, React.ComponentType<{ className?: string }>> = {
  money: Coins,
  love: Heart,
};

/** #money/2025-10 or #money/2025-10/2 */
function parseHash(hash: string): { topic: Topic; round: string; choice: Choice | null } | null {
  const [topic, round, choice] = hash.replace(/^#/, "").split("/");
  if (topic !== "money" && topic !== "love") return null;
  if (!ROUNDS.some((r) => r.key === round)) return null;
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
  const otherTopic: Topic | null = topic === "money" ? "love" : topic === "love" ? "money" : null;

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

  const steps: { label: string; done: boolean; active: boolean }[] = [
    { label: "Choose a path", done: stage !== "choose", active: stage === "choose" },
    { label: "Watch the intro", done: introDone || stage === "reading", active: stage === "intro" && !introDone },
    { label: "Pick a reading", done: stage === "reading", active: stage === "intro" && introDone },
    { label: "Your reading", done: readingDone, active: stage === "reading" },
  ];

  return (
    <div ref={stageRef} className="scroll-mt-24">
      {/* Progress */}
      <ol className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs md:mb-8 md:text-sm" aria-label="Progress">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] transition-colors md:h-7 md:w-7 md:text-xs",
                step.done
                  ? "border-purple-300 bg-purple-500 text-white"
                  : step.active
                    ? "border-purple-200 bg-purple-500/30 text-white ring-2 ring-purple-300/60"
                    : "border-white/30 text-white/60",
              )}
              aria-hidden="true"
            >
              {step.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn(step.active || step.done ? "text-white" : "text-white/60")}>
              {step.label}
              {step.active && <span className="sr-only"> (current step)</span>}
            </span>
            {i < steps.length - 1 && <span className="mx-1 hidden text-white/30 sm:inline" aria-hidden="true">·</span>}
          </li>
        ))}
      </ol>

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
                ? "border-purple-300 bg-purple-500/60 text-white shadow-md shadow-purple-500/30"
                : "border-white/30 bg-white/5 text-white/80 hover:border-purple-300/60 hover:bg-white/10",
            )}
          >
            {r.label}
            {i === 0 && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-purple-200">newest</span>}
          </button>
        ))}
      </div>

      {stage === "choose" ? (
        /* Step 1: two paths */
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {(Object.keys(TOPICS) as Topic[]).map((t) => {
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
                  <CardBack small className="absolute left-2 top-6 h-20 w-14 -rotate-12 transition-transform duration-500 group-hover:-rotate-[18deg]" />
                  <CardBack small className="absolute left-10 top-3 h-20 w-14 transition-transform duration-500 group-hover:-translate-y-1" />
                  <CardBack small className="absolute left-[4.5rem] top-6 h-20 w-14 rotate-12 transition-transform duration-500 group-hover:rotate-[18deg]" />
                </div>
                <Icon className="mb-4 h-8 w-8 text-purple-200 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-serif text-2xl md:text-3xl">{TOPICS[t].label}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/80 md:text-base">{TOPICS[t].tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-500/30 px-4 py-1.5 text-sm font-medium transition-colors group-hover:bg-purple-500/50">
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
            <div className="player-glow relative rounded-xl border border-purple-300/40 shadow-lg shadow-purple-500/30">
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
                      style={{ aspectRatio: "5 / 7" }}
                    >
                      {/* Back */}
                      <CardBack
                        number={c}
                        className="absolute inset-0 [backface-visibility:hidden] group-hover:shadow-purple-500/60"
                      />
                      {/* Face: the video's own thumbnail behind a Now playing mark */}
                      <div
                        className="absolute inset-0 overflow-hidden rounded-xl border border-purple-200/60 bg-black shadow-lg shadow-purple-500/40 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                        aria-hidden="true"
                      >
                        <Image
                          src={thumbUrl(reading.id, "hq")}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 33vw, 220px"
                          className="object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-purple-900/70 to-purple-950/50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500 shadow-md shadow-purple-900/60">
                            <Check className="h-5 w-5" />
                          </span>
                          <span className="font-serif text-3xl leading-none md:text-4xl">{c}</span>
                          <span className="text-[10px] uppercase tracking-widest text-purple-100">Now playing</span>
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
            {stage === "reading" && readingDone && otherTopic && (
              <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-purple-300/40 bg-purple-500/15 p-4 text-center text-white backdrop-blur-md md:p-5">
                <p className="font-serif text-lg md:text-xl">Want another angle?</p>
                <p className="mt-1 text-sm text-white/80">
                  Tap another card above, or see what the cards say about {TOPICS[otherTopic].label.toLowerCase()}.
                </p>
                <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="outline" size="sm" onClick={() => start(otherTopic)}>
                    {React.createElement(TOPIC_ICON[otherTopic], { className: "mr-2 h-4 w-4" })}
                    Try {TOPICS[otherTopic].label}
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="text-white">
                      <Youtube className="mr-2 h-4 w-4" /> Subscribe for next month
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
              {otherTopic && (
                <Button variant="outline" size="sm" onClick={() => start(otherTopic)}>
                  {React.createElement(TOPIC_ICON[otherTopic], { className: "mr-2 h-4 w-4" })}
                  Switch to {TOPICS[otherTopic].short}
                </Button>
              )}
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
                  <span className="text-xs uppercase tracking-wider text-purple-200">selected month</span>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(TOPICS) as Topic[]).map((t) => {
                  const Icon = TOPIC_ICON[t];
                  const rIntro = getIntro(t, r.key);
                  const rReadings = getReadings(t, r.key);
                  return (
                    <div key={t}>
                      <div className="mb-2 flex items-center gap-2 text-sm text-white">
                        <Icon className="h-4 w-4 text-purple-200" /> {TOPICS[t].label}
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
                              "group rounded-lg border p-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
                              topic === t && roundKey === r.key && choice === null
                                ? "border-purple-300 bg-purple-500/20"
                                : "border-white/15",
                            )}
                          >
                            <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                              <Image src={thumbUrl(rIntro.id, "hq")} alt="" fill sizes="120px" className="object-cover" />
                              <Play className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white drop-shadow" />
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
                                "group rounded-lg border p-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
                                active ? "border-purple-300 bg-purple-500/20" : "border-white/15",
                              )}
                            >
                              <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                                <Image src={thumbUrl(v.id, "hq")} alt="" fill sizes="120px" className="object-cover" />
                                <Play className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white drop-shadow" />
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
