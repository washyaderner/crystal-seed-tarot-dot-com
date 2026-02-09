import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateBlogImagePath } from "@/lib/utils";
import { format } from "date-fns";
import { getMostRecentBlogPost } from "@/lib/contentful";
import { ContentfulResponse } from "@/types/blog";

// Revalidate homepage every hour
export const revalidate = 3600;

export default async function Home() {
  // Try to get the most recent blog post
  let mostRecentPost: ContentfulResponse["items"][0] | null = null;
  try {
    mostRecentPost = await getMostRecentBlogPost();
  } catch (error) {
    console.error("Error fetching most recent blog post for homepage:", error);
  }

  // Fallback blog data if API fetch fails
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
      {/* Hero Section - Simplified for Mobile */}
      <section className="flex-grow flex items-center justify-center text-white px-4 py-8 md:py-16">
        <div className="text-center bg-black/20 backdrop-blur-md md:frosted-card p-4 md:p-8 rounded-lg max-w-3xl transform transition-all duration-2000 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 hover:bg-black/30">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide text-white mb-2 md:mb-3 drop-shadow-lg">
            Crystal Seed
            <br />
            Tarot & Healing
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white mb-4 md:mb-6 drop-shadow-lg">
            Helping connect you to yourself since 2008
          </p>

          <div className="mb-4 md:mb-6">
            <Image
              src="/images/Home-Shuffle.webp"
              alt="Crystal Seed Tarot"
              width={400}
              height={400}
              sizes="(max-width: 768px) 80vw, 400px"
              className="mx-auto rounded-lg shadow-lg transition-all duration-2000 hover:brightness-110"
              quality={60}
              priority
            />
          </div>

          <div className="mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-white mb-1 md:mb-2 drop-shadow-lg">
              Tarot Services:
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-white drop-shadow-lg">
              private bookings, party readings,
              <br className="hidden md:block" />
              private lessons, classes, events, & more
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-2 md:mt-4">
            <Link href="/contact" className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 text-white">
              Check Availability
            </Link>
          </Button>
        </div>
      </section>

      {/* Thumbtack Badge Section - Between Hero and Services */}
      <section className="py-8 md:py-12 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <Image
              src="/images/2025 Thumbtack Top Pro Badge.webp"
              alt="2025 Thumbtack Top Pro"
              width={200}
              height={200}
              className="transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              sizes="200px"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Services Section - 2x2 Grid */}
      <section className="py-12 md:py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-center mb-8 md:mb-16 text-white">
            Services Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <Image
                    src="/images/Services-Tarot-Readings-10-Card-Spread.webp"
                    alt="Private Tarot Reading"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-40 md:h-48 object-cover transition-all duration-300 hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-4 text-white">
                  Private Readings
                </h3>
                <p className="text-white text-sm md:text-base mb-3 md:mb-4">
                  Gain insights into your life's journey and receive guidance
                  for better outcomes. Available in-person or virtually.
                </p>
                <p className="text-white font-semibold">$100/hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <Image
                    src="/images/Home-Private-Events.webp"
                    alt="Tarot at Private Events"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-40 md:h-48 object-cover transition-all duration-300 hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-4 text-white">
                  Private Events/Party Readings
                </h3>
                <p className="text-white text-sm md:text-base mb-3 md:mb-4">
                  Tarot services for various events, customized to fit your
                  theme and group size. Available online or in-person.
                </p>
                <p className="text-white font-semibold">$120/hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <Image
                    src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
                    alt="Private Tarot Lessons"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-40 md:h-48 object-cover transition-all duration-300 hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-4 text-white">
                  Private Tarot Lessons
                </h3>
                <p className="text-white text-sm md:text-base mb-3 md:mb-4">
                  One-on-one instruction covering the art of Tarot with
                  comprehensive written materials. In-person or virtual options
                  available.
                </p>
                <p className="text-white font-semibold">$60/hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
              <CardContent className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <Image
                    src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
                    alt="Private Group Tarot Lessons"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-40 md:h-48 object-cover transition-all duration-300 hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-4 text-white">
                  Private Group Tarot Lessons
                </h3>
                <p className="text-white text-sm md:text-base mb-3 md:mb-4">
                  Bring your friends for a shared learning experience exploring
                  Tarot together. In-person or virtual options available.
                </p>
                <p className="text-white font-semibold">$100/hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Button asChild variant="outline" size="default">
              <Link href="/services" className="text-white">
                View full service details →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Post Section */}
      <section className="py-12 md:py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Most Recent Blog Post */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-8 md:mb-12 text-white text-center">
            Latest Blog Post
          </h2>
          <article className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-6 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
            {/* Blog image on top for better prominence */}
            <div className="mb-6">
              <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={
                    mostRecentPost?.fields.featuredImage?.url ||
                    generateBlogImagePath(
                      mostRecentPost?.fields.title || blogPosts[1].title
                    )
                  }
                  alt={
                    mostRecentPost?.fields.featuredImage?.title ||
                    mostRecentPost?.fields.title ||
                    blogPosts[1].title
                  }
                  fill
                  className="object-cover transition-all duration-300 hover:brightness-110"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>

            {/* Blog content */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif mb-3 md:mb-4 text-white">
                {mostRecentPost?.fields.title || blogPosts[1].title}
              </h3>
              <p className="text-white text-sm md:text-base mb-4">
                {mostRecentPost?.fields.excerpt || blogPosts[1].excerpt}
              </p>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="text-white text-sm md:text-base">
                  {mostRecentPost
                    ? format(
                        new Date(
                          mostRecentPost.fields.publishDate ||
                            mostRecentPost.sys.createdAt
                        ),
                        "MMMM d, yyyy"
                      )
                    : blogPosts[1].date}{" "}
                  | by {mostRecentPost?.fields.author || blogPosts[1].author}
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/blog/${
                      mostRecentPost?.fields.slug || blogPosts[1].slug
                    }`}
                    className="text-white"
                  >
                    Read more
                  </Link>
                </Button>
              </div>
            </div>
          </article>

          <div className="mt-6 md:mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/blog" className="text-white">
                View all blog posts →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mobile Grid Fix */}
      <section className="py-12 md:py-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-center mb-8 md:mb-12 text-white">
            What Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Link
                href="/reviews"
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-6 rounded-lg flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15 group"
              >
                <div className="flex-1">
                  <p className="text-white/90 mb-4 text-sm md:text-base lg:text-lg italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <p className="text-white font-medium text-right text-sm md:text-base">
                  - {testimonial.name}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/reviews" className="text-white">
                Read more reviews →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
