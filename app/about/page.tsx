import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">About Crystal Seed Tarot</h1>

          <div className="md:flex items-start space-y-8 md:space-y-0 md:space-x-8">
            <div className="md:w-1/3">
              <Image src="/placeholder.svg" alt="Tarot Reader" width={400} height={400} className="rounded-lg" />
            </div>
            <div className="md:w-2/3">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
                <p className="text-white/80 mb-4">
                  I have been a professional Tarot card reader for sixteen years and I love what I do! I provide Tarot
                  services for private readings as well as public and private events, and teach Tarot classes and give
                  private Tarot lessons. I am grateful for all of the amazing experiences I've had through Tarot, and
                  the many insanely cool places I've gotten to give readings at! I have done Tarot at every event you
                  could imagine, from work parties, to birthday parties, bachelorette parties, graduation parties,
                  weddings, baby showers, and even a celebration of life event. I have gotten to do Tarot for events at
                  Widen + Kennedy, SDF Collective, Portland State University, and University of Oregon School of Law
                  Student Bar Association to name a few.
                </p>

                <p className="text-white/80 mb-4">
                  As I opened myself up to the world of metaphysics and healing, I began to understand that I could
                  study a wide range of things that would all compliment each other or that could be used together. To
                  this end, I use crystals and Reiki in every Tarot reading as they help strengthen my connection to the
                  energy of the person I'm reading for, and also help to create and foster this magical, energetic space
                  between the two of us.
                </p>

                <p className="text-white/80 mb-4">
                  In addition to studying Tarot and practicing Reiki, I have also studied Witchcraft, Shamanism,
                  mediumship, palmistry, numerology, quantum physics, the Mayan Calendar, spirit communication, sound
                  healing, manifestation, and hand-writing analysis. These things may all sound random and unrelated,
                  but scratch the surface of any one of these and you'll find that at their cores, this is all about
                  energy work and consciousness (which is another form of energy).
                </p>

                <p className="text-white/80">
                  Aside from the things I study and specialize in, I am an intuitive healer, an empath, a
                  natural/eclectic witch, a writer, and a musician. I also have a background in the legal field and
                  criminal law in particular, which gives me a unique understanding of people and their unhealed trauma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

