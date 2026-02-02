import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -left-10 bottom-20 rotate-[-10deg]">
            <Image
              src="/images/Services-Tarot-Readings-10-Card-Spread.webp"
              alt=""
              width={300}
              height={300}
              className="opacity-30"
            />
          </div>
          <div className="absolute right-10 top-20 rotate-[15deg]">
            <Image
              src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
              alt=""
              width={280}
              height={280}
              className="opacity-30"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">
            About Crystal Seed Tarot
          </h1>

          <div className="max-w-3xl mx-auto">
            {/* Thumbtack Top Pro Badge */}
            <div className="flex justify-center mb-6">
              <Image
                src="/images/2025 Thumbtack Top Pro Badge.png"
                alt="2025 Thumbtack Top Pro"
                width={120}
                height={120}
                className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            </div>

            {/* Single card with all content */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-inner border border-white/5 transition-all duration-300 hover:bg-white/15">
              {/* First image */}
              <div className="mb-8">
                <Image
                  src="/images/About-Holly-Kyle-Reading.jpeg"
                  alt="Holly Nicole performing a tarot reading"
                  width={1200}
                  height={900}
                  className="rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] w-full h-auto"
                  priority
                />
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-white/90 mb-8 leading-relaxed">
                  I have been a professional Tarot card reader for sixteen years
                  and I love what I do! I provide Tarot services for private
                  readings as well as public and private events, and teach Tarot
                  classes and give private Tarot lessons. I am grateful for all
                  of the amazing experiences I've had through Tarot, and the
                  many insanely cool places I've gotten to give readings at! I
                  have done Tarot at every event you could imagine, from work
                  parties, to birthday parties, bachelorette parties, graduation
                  parties, weddings, baby showers, and even a celebration of
                  life event. I have gotten to do Tarot for events at Widen +
                  Kennedy, SDF Collective, Portland State University, and
                  University of Oregon School of Law Student Bar Association to
                  name a few.
                </p>

                <p className="text-white/90 mb-8 leading-relaxed">
                  As I opened myself up to the world of metaphysics and healing,
                  I began to understand that I could study a wide range of
                  things that would all compliment each other or that could be
                  used together. To this end, I use crystals and Reiki in every
                  Tarot reading as they help strengthen my connection to the
                  energy of the person I'm reading for, and also help to create
                  and foster this magical, energetic space between the two of
                  us.
                </p>

                <p className="text-white/90 mb-8 leading-relaxed">
                  In addition to studying Tarot and practicing Reiki, I have
                  also studied Witchcraft, Shamanism, mediumship, palmistry,
                  numerology, quantum physics, the Mayan Calendar, spirit
                  communication, sound healing, manifestation, and hand-writing
                  analysis. These things may all sound random and unrelated, but
                  scratch the surface of any one of these and you'll find that
                  at their cores, this is all about energy work and
                  consciousness (which is another form of energy).
                </p>

                <p className="text-white/90 leading-relaxed">
                  Aside from the things I study and specialize in, I am an
                  intuitive healer, an empath, a natural/eclectic witch, a
                  writer, and a musician. I also have a background in the legal
                  field and criminal law in particular, which gives me a unique
                  understanding of people and their unhealed trauma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
