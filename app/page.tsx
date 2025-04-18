import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const blogPosts = [
    {
      title: "NEW!! Tarot Classes ONLINE!!!",
      excerpt:
        "It's finally here! My very first online Tarot course presented through Kumara Academy!!! I have been wanting to get the opportunity to do online courses for years, so this is a long time coming and I am very excited! This online beginner's Tarot course will be 4 weeks long with classes occurring every Sunday in…",
      date: "January 9, 2025",
      author: "Holly Cole",
      slug: "new-tarot-classes-online",
    },
    {
      title: "When Being A Good Person Goes Bad",
      excerpt:
        "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective Recently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read…",
      date: "February 3, 2023",
      author: "Holly Cole",
      slug: "when-being-a-good-person-goes-bad",
    },
    {
      title: "Accepting the Totality of Your Worth",
      excerpt:
        "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…",
      date: "November 11, 2021",
      author: "Holly Cole",
      slug: "accepting-the-totality-of-your-worth",
    },
  ];

  // Add testimonials array
  const testimonials = [
    {
      quote:
        "Crystal Seed Tarot provided me with clarity and guidance during a difficult time. The readings were insightful and transformative.",
      name: "Sarah M.",
    },
    {
      quote:
        "Holly has an incredible gift. Her reading helped me navigate a challenging career transition with confidence and purpose.",
      name: "Michael R.",
    },
    {
      quote:
        "I was skeptical at first, but my reading was surprisingly accurate and helpful. Holly creates a comfortable space for self-reflection and growth.",
      name: "Jennifer K.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow flex items-center justify-center text-white px-4 py-16">
        <div className="text-center bg-black/20 backdrop-blur-md p-8 rounded-lg max-w-3xl transform transition-all duration-2000 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 hover:bg-black/30">
          <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-white mb-3 drop-shadow-lg">
            Crystal Seed
            <br />
            Tarot & Healing
          </h1>

          <p className="text-xl md:text-2xl text-white mb-6 drop-shadow-lg">
            Helping connect you to yourself since 2008
          </p>

          <div className="mb-6">
            <Image
              src="/images/Home-Shuffle.png"
              alt="Crystal Seed Tarot"
              width={600}
              height={600}
              className="mx-auto rounded-lg shadow-lg transition-all duration-2000 hover:brightness-110"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-medium text-white mb-2 drop-shadow-lg">
              Tarot Services:
            </h3>
            <p className="text-lg md:text-xl text-white drop-shadow-lg">
              private bookings, party readings,
              <br />
              private lessons, classes, events, & more
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-4">
            <Link href="/contact" className="text-lg px-8 py-3 text-white">
              Check Availability
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-white">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Image
                    src="/images/Services-Tarot-Readings-10-Card-Spread.webp"
                    alt="Private Tarot Reading"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-48 object-cover transition-all duration-300 hover:brightness-110"
                  />
                </div>
                <h3 className="text-xl font-serif mb-4 text-white">
                  Private Readings
                </h3>
                <p className="text-white mb-4">
                  Gain insights into your life's journey and receive guidance
                  for better outcomes. Available in-person or virtually.
                </p>
                <p className="text-white font-semibold">$80/hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Image
                    src="/images/Home-Private-Events.webp"
                    alt="Tarot at Private Events"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-48 object-cover transition-all duration-300 hover:brightness-110"
                  />
                </div>
                <h3 className="text-xl font-serif mb-4 text-white">
                  Private Events
                </h3>
                <p className="text-white mb-4">
                  Tarot services for various events, customized to fit your
                  theme and group size. Available online or in-person.
                </p>
                <p className="text-white font-semibold">$110/hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Image
                    src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
                    alt="Tarot Lessons"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-48 object-cover transition-all duration-300 hover:brightness-110"
                  />
                </div>
                <h3 className="text-xl font-serif mb-4 text-white">
                  Tarot Lessons
                </h3>
                <p className="text-white mb-4">
                  Learn the art of Tarot with comprehensive lessons covering
                  various aspects of this ancient oracle. In-person or virtual
                  options available.
                </p>
                <p className="text-white font-semibold">$50/hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="default">
              <Link href="/services" className="text-white">
                View full service details →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-white text-center">
            Updates
          </h2>

          {/* Featured Update/Service */}
          <article className="bg-white/10 backdrop-blur-md p-6 rounded-lg transform transition duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15 mb-16">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
                  alt="Tarot Classes"
                  width={300}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover transition-all duration-300 hover:brightness-110"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-serif mb-4 text-white">
                  NEW!! Tarot Classes ONLINE!!!
                </h3>
                <p className="text-white mb-4">
                  I have put together Beginner's, Intermediate and Advanced
                  Tarot courses which will be in a consistent rotation a few
                  times a year. Each course is 4 weeks long—2 hour sessions once
                  per week. I look forward to seeing you in class!
                </p>
                <div className="text-center md:text-left mt-6">
                  <Button asChild variant="outline">
                    <Link href="/services#tarot-classes" className="text-white">
                      Learn more
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Most Recent Blog Post */}
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-white text-center">
            Latest Blog Post
          </h2>
          <article className="bg-white/10 backdrop-blur-md p-6 rounded-lg transform transition duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
            <h3 className="text-2xl font-serif mb-4 text-white">
              {blogPosts[1].title}
            </h3>
            <p className="text-white mb-4">{blogPosts[1].excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-white">
                {blogPosts[1].date} | by {blogPosts[1].author}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/blog/${blogPosts[1].slug}`}
                  className="text-white"
                >
                  Read more
                </Link>
              </Button>
            </div>
          </article>

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/blog" className="text-white">
                View all blog posts →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-white">
            What Our Clients Say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Link key={index} href="/reviews" className="block">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15 h-full flex flex-col">
                  <blockquote className="text-lg text-white italic mb-4 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <cite className="text-white font-semibold not-italic">
                    — {testimonial.name}
                  </cite>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/reviews" className="text-white">
                Read more reviews
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
