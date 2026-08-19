"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TAROT_CARDS, type TarotCard } from "@/lib/tarotdoxa-cards";

// Every visitor sees the same card on a given Pacific-time day
function cardForToday(): TarotCard {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    hash = (hash * 31 + day.charCodeAt(i)) >>> 0;
  }
  return TAROT_CARDS[hash % TAROT_CARDS.length];
}

export function CardOfTheDay() {
  const [card, setCard] = React.useState<TarotCard | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  // Pick the card on the client so server-rendered HTML never disagrees
  // with the visitor's clock
  React.useEffect(() => {
    setCard(cardForToday());
  }, []);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => card && setRevealed(true)}
        disabled={!card || revealed}
        aria-label={revealed ? card?.name ?? "Today's card" : "Reveal today's card"}
        className="group relative w-52 md:w-60 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-full transition-transform duration-700 [transform-style:preserve-3d]"
          style={{
            aspectRatio: "350/600",
            transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Card back */}
          <div className="absolute inset-0 overflow-hidden rounded-xl border border-purple-300/40 shadow-lg shadow-purple-500/30 transition-shadow group-hover:shadow-purple-400/50 [backface-visibility:hidden]">
            <Image
              src="https://tarotdoxa.com/cardback.jpg"
              alt="Tarotdoxa card back"
              fill
              className="object-cover"
              sizes="240px"
            />
          </div>
          {/* Card face (pre-rendered behind the back so the flip is instant) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl border border-purple-300/40 shadow-lg shadow-purple-500/30 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            {card && (
              <Image
                src={`https://tarotdoxa.com/cards/${card.id}.jpg`}
                alt={card.name}
                fill
                className="object-cover"
                sizes="240px"
              />
            )}
          </div>
        </div>
      </button>

      {!revealed && (
        <p className="mt-4 animate-pulse text-sm text-purple-200 md:text-base">
          Tap the card to reveal today's pull
        </p>
      )}

      {revealed && card && (
        <div className="mt-6 max-w-xl text-center">
          <h3 className="mb-2 font-serif text-2xl text-white md:text-3xl">
            {card.name}
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {card.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-purple-300/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-100 md:text-sm"
              >
                {k}
              </span>
            ))}
          </div>
          <p className="mb-6 text-sm italic text-white/90 md:text-base">
            {card.blurb}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://tarotdoxa.com/pull/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                Pull your own card on Tarotdoxa
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://tarotdoxa.com/deck/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                Explore all 78 cards
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
