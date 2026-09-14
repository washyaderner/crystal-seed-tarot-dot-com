import type { ReactNode } from "react";
import Image from "next/image";
import { DollarSign, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOPICS, type Choice, type Topic } from "@/lib/youtube-videos";

/**
 * The choose-your-own-adventure map: Start, then the paths this round offers (Money, Love,
 * General: one, two or all three), then three readings on each branch. Each tier keeps one
 * chip color, dark to lit like the hero cards (.brand-chip, -2, -3). The path taken lights
 * up solid; the paths still open stay dotted.
 *
 * Geometry is fixed in px down the page and in % across it, so the SVG connectors
 * (viewBox 0 0 100 HEIGHT, stretched across the width) meet the HTML nodes at any width.
 */

const HEIGHT = 288;
const CHOICES: Choice[] = [1, 2, 3];

const TOPIC_ICON: Record<Topic, ReactNode> = {
  money: <DollarSign className="h-[18px] w-[18px]" />,
  love: <Heart className="h-[18px] w-[18px]" />,
  general: <Sparkles className="h-[18px] w-[18px]" />,
};

// Chip size and top edge per tier (px). Labels sit 6px under each chip.
const TIER = {
  start: { size: 34, top: 3 },
  topic: { size: 40, top: 112 },
  reading: { size: 32, top: 230 },
} as const;

const startX = 50;

// Where connectors leave a parent (under its label) and reach a child (just above its chip)
const START_OUT = 64;
const TOPIC_IN = TIER.topic.top - 6;
const TOPIC_OUT = 180;
const READING_IN = TIER.reading.top - 6;

type NodeState = "current" | "open" | "sibling" | "faded" | "traveled";

function curve(x0: number, y0: number, x1: number, y1: number) {
  const ym = (y0 + y1) / 2;
  return `M ${x0} ${y0} C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${y1}`;
}

function Connector({ d, lit }: { d: string; lit: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      className="transition-all duration-500"
      style={
        lit
          ? { stroke: "#f8e4c8", strokeWidth: 2.5, filter: "drop-shadow(0 0 4px rgba(251, 169, 91, 0.75))" }
          : { stroke: "rgba(248, 228, 200, 0.45)", strokeWidth: 2.5, strokeDasharray: "0.01 7" }
      }
    />
  );
}

function Node({
  x,
  tier,
  chipClass,
  state,
  label,
  labelClass,
  children,
}: {
  x: number;
  tier: keyof typeof TIER;
  chipClass: string;
  state: NodeState;
  label: string;
  labelClass?: string;
  children?: ReactNode;
}) {
  const { size, top } = TIER[tier];
  return (
    <div
      className={cn(
        "absolute flex -translate-x-1/2 flex-col items-center transition-opacity duration-500",
        state === "faded" && "opacity-40",
        state === "sibling" && "opacity-70",
      )}
      style={{ left: `${x}%`, top }}
    >
      <span
        className={cn(
          "brand-chip transition-transform duration-500",
          chipClass,
          state === "current" && "scale-110 outline outline-2 outline-offset-2 outline-[#fdf5d9]/80",
        )}
        style={{ width: size, height: size }}
      >
        {children}
      </span>
      <span
        className={cn(
          "mt-1.5 whitespace-nowrap text-[10px] leading-none sm:text-[11px] md:text-xs",
          state === "current" ? "font-medium text-white" : "text-white/80",
          labelClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function PathTree({ topic, choice, topics }: { topic: Topic | null; choice: Choice | null; topics: Topic[] }) {
  const n = Math.max(1, topics.length);
  // Paths share the width evenly; each path's three readings sit under it
  const topicX = (t: Topic) => (100 * (topics.indexOf(t) + 0.5)) / n;
  const readingX = (t: Topic, c: Choice) => (100 * (topics.indexOf(t) * 3 + (c - 1) + 0.5)) / (3 * n);

  const topicState = (t: Topic): NodeState =>
    topic === null ? "open" : t !== topic ? "faded" : choice === null ? "current" : "traveled";
  const readingState = (t: Topic, c: Choice): NodeState =>
    topic === null ? "open" : t !== topic ? "faded" : choice === null ? "open" : c === choice ? "current" : "sibling";

  const pathNames = topics.map((t) => TOPICS[t].short);
  const pathList = pathNames.length > 1 ? `${pathNames.slice(0, -1).join(", ")} or ${pathNames[pathNames.length - 1]}` : pathNames[0] ?? "a path";
  const where =
    topic === null
      ? "You are at the start."
      : choice === null
        ? `You picked ${TOPICS[topic].short}.`
        : `You picked ${TOPICS[topic].short}, reading ${choice}.`;

  return (
    <div
      className="relative mx-auto mb-6 w-full md:mb-8"
      style={{ height: HEIGHT }}
      role="img"
      aria-label={`Choose your own adventure: start, then ${pathList}, then three readings on each path. ${where}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 100 ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {topics.map((t) => (
          <g key={t}>
            <Connector d={curve(startX, START_OUT, topicX(t), TOPIC_IN)} lit={topic === t} />
            {CHOICES.map((c) => (
              <Connector
                key={c}
                d={curve(topicX(t), TOPIC_OUT, readingX(t, c), READING_IN)}
                lit={topic === t && choice === c}
              />
            ))}
          </g>
        ))}
      </svg>

      <Node x={startX} tier="start" chipClass="" state={topic === null ? "current" : "traveled"} label="Start">
        <Image src="/images/brand/crystal-seed-mark-cutout.png" alt="" width={14} height={21} sizes="14px" />
      </Node>

      {topics.map((t) => (
        <Node key={t} x={topicX(t)} tier="topic" chipClass="brand-chip-2" state={topicState(t)} label={TOPICS[t].short}>
          {TOPIC_ICON[t]}
        </Node>
      ))}

      {topics.flatMap((t) =>
        CHOICES.map((c) => (
          <Node
            key={`${t}-${c}`}
            x={readingX(t, c)}
            tier="reading"
            chipClass="brand-chip-3 text-sm"
            state={readingState(t, c)}
            label={`${TOPICS[t].short} ${c}`}
            // nine readings across a phone: the chip already shows the number, the label waits for a wider screen
            labelClass={n >= 3 ? "hidden sm:block" : undefined}
          >
            {c}
          </Node>
        )),
      )}
    </div>
  );
}
