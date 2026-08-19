import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardOfTheDay } from "@/components/tarotdoxa/CardOfTheDay";

export const metadata: Metadata = {
  title: "Tarotdoxa - Our New Tarot App",
  description:
    "Tarotdoxa is the new Tarot app from Holly Cole of Crystal Seed Tarot - full, authentic, original readings every time. Coming to iPhone and Android Fall 2026.",
  alternates: { canonical: "/tarotdoxa" },
  openGraph: {
    images: [
      {
        url: "https://tarotdoxa.com/wordmark-wide.jpg",
        alt: "Tarotdoxa",
      },
    ],
    title: "Tarotdoxa - Our New Tarot App | Crystal Seed Tarot",
    description:
      "Tarotdoxa is the new Tarot app from Holly Cole of Crystal Seed Tarot - full, authentic, original readings every time. Coming to iPhone and Android Fall 2026.",
    url: "/tarotdoxa",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Tarotdoxa",
  url: "https://tarotdoxa.com",
  operatingSystem: "iOS, Android",
  applicationCategory: "LifestyleApplication",
  description:
    "A Tarot app that gives full, authentic, original, one-of-a-kind readings every time, trained on the practice of professional Tarot reader Holly Cole.",
  author: { "@type": "Person", name: "Holly Cole" },
};

const screenshots = [
  { src: "https://tarotdoxa.com/app-home.jpg", alt: "Tarotdoxa app home screen" },
  { src: "https://tarotdoxa.com/app-celtic.jpg", alt: "A Celtic Cross reading in Tarotdoxa" },
  { src: "https://tarotdoxa.com/app-library.jpg", alt: "The Tarotdoxa library" },
  { src: "https://tarotdoxa.com/app-you.jpg", alt: "The You section of Tarotdoxa" },
];

export default function Tarotdoxa() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* Hero */}
      <section className="py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <a
            href="https://tarotdoxa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-all duration-300 hover:scale-[1.02]"
          >
            <Image
              src="https://tarotdoxa.com/wordmark-wide.jpg"
              alt="Tarotdoxa"
              width={1600}
              height={640}
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="mx-auto rounded-lg shadow-lg shadow-purple-500/20"
            />
          </a>
          <h1 className="mt-6 text-2xl md:text-3xl font-serif text-white [text-wrap:balance]">
            <span className="sr-only">Tarotdoxa - </span>
            NEW TAROT APP coming to iPhone and Android Fall&nbsp;2026! 🔮⭐🔮
          </h1>
        </div>
      </section>

      {/* Holly's announcement, in her own words */}
      <section className="py-12 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-5 md:p-8 rounded-lg text-white text-sm md:text-base space-y-4">
            <p>
              <strong>OKAY!</strong> This is something I've been very, very
              excited to get to share with you! For the last four months, my
              husband and I have been developing our very own TAROT APP! We've
              trained an autonomous AI agent how to do Tarot{" "}
              <em>the way that I do Tarot,</em> which is still completely crazy
              to me. When I say that this Tarot app is like no other, I mean it
              really is unlike anything out there currently. While other apps
              may use AI to some extent to give readings, the readings typically
              work by using scripts and repeating the same information
              throughout multiple readings. Our app gives you full, authentic,
              original, one-of-a-kind readings every time. Every reading is
              personalized and unique to you and your energy. There's also an
              astrology side of the app, numerology, a Tarot journal that saves
              every single reading you've ever had, the ability to take notes on
              your readings, and SO MUCH MORE! In fact, next year we'll be
              developing the Tarotdoxa school side of the app so that you can
              also study Tarot through the app itself!
            </p>
            <p>
              I'm telling you, there really is nobody doing what we're doing and
              no Tarot apps that can give you full in-depth readings like
              Tarotdoxa. I can't wait for you all to get to see it out in the
              world! We'll be shipping it off to the app stores at the end of
              the month, so stay tuned to see when it's officially available!
            </p>
            <p>
              In the meantime, please check out our website which gives more
              information on how our app works, and like and follow us on social
              media. We'll be posting a lot of content coming up over the next
              few months to promote the app and will be blasting the world with
              discount codes and behind-the-scenes looks at how we created it.
            </p>
            <p className="text-purple-200">💜🔮💜 Holly</p>
          </article>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <a
                href="https://tarotdoxa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                Visit tarotdoxa.com →
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://www.facebook.com/share/1EcyUHnqEE/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                Follow on Facebook
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://www.instagram.com/tarotdoxa/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                Follow on Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Card of the Day */}
      <section className="py-12 md:py-20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
            Card of the Day
          </h2>
          <p className="text-white/80 mb-8 md:mb-10 text-sm md:text-base [text-wrap:balance]">
            A daily card from the Tarotdoxa deck, with Holly's take on&nbsp;it.
          </p>
          <CardOfTheDay />
        </div>
      </section>

      {/* A peek inside the app */}
      <section className="py-12 md:py-20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 md:mb-12 text-center">
            A Peek Inside the App
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {screenshots.map((shot) => (
              <div
                key={shot.src}
                className="relative overflow-hidden rounded-2xl border border-white/20 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-500/40"
                style={{ aspectRatio: "9/19.5" }}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 260px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Button asChild variant="outline" size="lg">
              <a
                href="https://tarotdoxa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                See how it works at tarotdoxa.com →
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
