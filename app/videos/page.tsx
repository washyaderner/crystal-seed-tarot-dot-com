import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { DollarSign, Heart, MousePointerClick, PlayCircle, Youtube, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardBack } from "@/components/videos/CardBack";
import { InteractiveReading } from "@/components/videos/InteractiveReading";
import { ChannelGrid } from "@/components/videos/ChannelGrid";
import {
  CHANNEL_GROUPS,
  CHANNEL_HANDLE,
  CHANNEL_URL,
  SUBSCRIBE_URL,
  VIDEOS,
  embedUrl,
  isoDuration,
  thumbUrl,
  watchUrl,
} from "@/lib/youtube-videos";

const description =
  "Choose-your-own-adventure tarot readings from Holly Cole. Pick Money & Career or Love & Relationships, watch the short intro, and let one of three readings call to you. Plus free tarot lessons, season readings, and card care.";

export const metadata: Metadata = {
  title: "Interactive Tarot Readings & Videos",
  description,
  alternates: { canonical: "/videos" },
  openGraph: {
    images: [
      {
        url: thumbUrl("1E_-ACF3sME"),
        alt: "Crystal Seed Tarot on YouTube",
      },
    ],
    title: "Interactive Tarot Readings & Videos | Crystal Seed Tarot",
    description,
    url: "/videos",
  },
};

const videoListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Crystal Seed Tarot videos",
  description,
  itemListElement: VIDEOS.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "VideoObject",
      name: v.title,
      description: v.blurb,
      thumbnailUrl: [thumbUrl(v.id), thumbUrl(v.id, "hq")],
      uploadDate: v.published,
      duration: isoDuration(v.duration),
      embedUrl: embedUrl(v.id, false),
      url: watchUrl(v.id),
      publisher: { "@id": "https://crystalseedtarot.com/#business" },
    },
  })),
};

// Icons only, no step numbers: the dollar and heart show the two paths to pick from.
const steps: { icons: LucideIcon[]; title: string; body: string }[] = [
  {
    icons: [DollarSign, Heart],
    title: "Pick your path",
    body: "Money & Career or Love & Relationships. Holly posts a fresh set of both every month.",
  },
  {
    icons: [PlayCircle],
    title: "Watch the short intro",
    body: "Holly lays out three readings. Take a breath, quiet your mind, and notice which one pulls at you. One of them will.",
  },
  {
    icons: [MousePointerClick],
    title: "Choose your reading",
    body: "Tap the card that called to you and your reading starts right away. On YouTube, the same three choices appear as cards at the end of the intro.",
  },
];

export default function Videos() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="text-center md:text-left">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-purple-200 md:text-sm">
                Crystal Seed Tarot on YouTube
              </p>
              <h1 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl [text-wrap:balance]">
                Interactive Tarot Readings
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/90 md:mx-0 md:text-lg">
                Choose-your-own-adventure readings from Holly. Pick a path, watch the short
                intro, and let one of three readings call to you. New sets every month, free.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Button asChild variant="outline" size="lg">
                  <a href="#start" className="text-white">Start a reading</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="text-white">
                    <Youtube className="mr-2 h-5 w-5 text-[#FF0000]" /> Subscribe on YouTube
                  </a>
                </Button>
              </div>
            </div>

            {/* Three cards, waiting */}
            <div className="relative mx-auto h-48 w-64 md:h-60 md:w-full" aria-hidden="true">
              <CardBack
                number={1}
                priority
                className="float-card absolute left-0 top-6 w-24 md:w-28"
                style={{ "--tilt": "-14deg" } as CSSProperties}
              />
              <CardBack
                number={2}
                priority
                className="float-card float-card-2 absolute left-[5rem] top-0 w-24 md:left-[4.625rem] md:w-28"
              />
              <CardBack
                number={3}
                priority
                className="float-card float-card-3 absolute right-0 top-6 w-24 md:w-28"
                style={{ "--tilt": "14deg" } as CSSProperties}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The adventure */}
      {/* overflow-x-clip: the player's breathing glow (.player-glow::before, inset -18px, scale 1.03)
          reached 5 to 6px past the screen edge on phones and let the page scroll sideways */}
      <section id="start" className="scroll-mt-20 overflow-x-clip py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="mb-2 text-center font-serif text-2xl text-white md:text-3xl lg:text-4xl">
            Choose your reading
          </h2>
          <p className="mb-8 text-center text-sm text-white/80 md:mb-10 md:text-base">
            Whenever this reading finds you, it may apply to you at this moment.
          </p>
          <InteractiveReading />
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="mb-8 text-center font-serif text-2xl text-white md:mb-10 md:text-3xl lg:text-4xl">
            How it works
          </h2>
          <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
            {steps.map((step) => {
              return (
                <li
                  key={step.title}
                  className="rounded-xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md md:frosted-card md:p-6"
                >
                  <div className="mb-3 flex h-8 items-center gap-3">
                    {step.icons.map((Icon, k) => (
                      <Icon key={k} className="h-6 w-6 text-[#f8e4c8]" />
                    ))}
                  </div>
                  <h3 className="font-serif text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/85">{step.body}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md md:mt-8 md:p-6">
            <h3 className="font-serif text-lg md:text-xl">A note on the first rounds</h3>
            <p className="mt-2 text-sm text-white/85 md:text-base">
              The September and October 2025 intros keep it short: Holly names readings 1, 2,
              and 3, and the cards to click appear at the end of the video. Newer intros will
              walk you through the choice on screen. Here you never have to hunt for them.
              Your three cards are always right under the video, and any reading is one tap
              away in the list above.
            </p>
            <p className="mt-3 text-xs text-white/60">
              Readings are for entertainment purposes. Take what resonates, leave what doesn&apos;t.
            </p>
          </div>
        </div>
      </section>

      {/* The rest of the channel */}
      <section className="py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="mb-2 text-center font-serif text-2xl text-white md:text-3xl lg:text-4xl">
            More from the channel
          </h2>
          <p className="mb-8 text-center text-sm text-white/80 md:mb-10 md:text-base">
            Lessons, season readings, and how Holly cares for her cards. Tap any video to play it here.
          </p>
          <ChannelGrid groups={CHANNEL_GROUPS} />
        </div>
      </section>

      {/* Closing */}
      <section className="py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Heart className="mx-auto mb-4 h-8 w-8 text-[#f8e4c8]" />
          <h2 className="font-serif text-2xl text-white md:text-3xl">
            Want a reading that is only about you?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
            The videos are for everyone. A private reading is for you alone, in person in the
            Portland area or remote from anywhere.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline" size="lg">
              <Link href="/contact" className="text-white">
                Book a private reading
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tarotdoxa" className="text-white">
                Try the Tarotdoxa app
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-xs text-white/60">
            Every video here lives on{" "}
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {CHANNEL_HANDLE}
            </a>
            . Like and subscribe if a reading lands for you.
          </p>
        </div>
      </section>
    </div>
  );
}
