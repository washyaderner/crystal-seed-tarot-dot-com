import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const blogPosts = [
  {
    title: "Better Practices for Your Practice",
    excerpt:
      "When we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the…",
    date: "February 23, 2025",
    author: "crystalseedhealing",
    slug: "better-practices-for-your-practice",
    image: "/images/Blog-Better-Practices-For-Your-Practice.webp",
  },
  {
    title: "When Being A Good Person Goes Bad",
    excerpt:
      "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective Recently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read…",
    date: "February 3, 2023",
    author: "crystalseedhealing",
    slug: "when-being-a-good-person-goes-bad",
    image: "/images/Blog-When-Being-A-Good-Person-Goes-Bad.jpg",
  },
  {
    title: "Accepting the Totality of Your Worth",
    excerpt:
      "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…",
    date: "November 11, 2021",
    author: "crystalseedhealing",
    slug: "accepting-the-totality-of-your-worth",
    image: "/images/Blog-Accepting-the-Totality-of-Your-Worth.webp",
  },
  {
    title: "The Irrational Fear of Starting Over",
    excerpt:
      "I get it. You're here. You've invested yourself, and your time, your precious energy into this thing. Insert person/relationship/endeavor here. You've spent countless hours, or days, or even years caring for this thing, this person, this relationship. The emotional side of you says the right thing to do is to stick it out. You're already…",
    date: "June 15, 2021",
    author: "crystalseedhealing",
    slug: "the-irrational-fear-of-starting-over",
    image: "/images/Blog-The-Irrational-Fear-of-Starting-Over.webp",
  },
  {
    title: "Ghost Week!",
    excerpt:
      "Join me for the first ever VIRTUAL Oregon Ghost Conference! It's March which means it's time for my favorite event of the year: The Oregon Ghost Conference! The OGC is the biggest annual paranormal event in the state, going on since 2011. Although the event had to be cancelled last year due to Covid, this…",
    date: "March 8, 2021",
    author: "crystalseedhealing",
    slug: "ghost-week",
    image: "/images/Blog-Ghost-Week-2021.webp",
  },
  {
    title: "Be Nice to Yourself, D@mnit!",
    excerpt: "Healing work, at it's most basic level, starts with being nice to yourself.",
    date: "February 21, 2021",
    author: "crystalseedhealing",
    slug: "be-nice-to-yourself-damnit",
    image: "/images/Blog-Be-Nice-to-Yourself-D@mnit!.webp",
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">Blog</h1>
          <div className="mb-12">
            <Image
              src="/images/Blog-Hero.jpg"
              alt="Crystal Seed Blog"
              width={1200}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15">
                <CardContent className="p-6">
                  {post.image && (
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={600}
                      className="w-full h-48 object-cover rounded-lg mb-4 transition-all duration-300 hover:brightness-110"
                    />
                  )}
                  <h2 className="text-2xl font-serif text-white mb-4">{post.title}</h2>
                  <p className="text-white/80 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">{post.date}</span>
                    <Link href={`/blog/${post.slug}`} className="text-white hover:text-purple-300 transition-colors">
                      Read more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

