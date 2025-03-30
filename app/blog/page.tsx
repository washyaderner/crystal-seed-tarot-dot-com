import { Metadata } from "next"

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog | Crystal Seed Tarot",
  description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  openGraph: {
    title: "Blog | Crystal Seed Tarot",
    description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  },
}

export default function Blog() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">Blog</h1>
          
          {/* Blog content will be added later */}
          <div className="text-center text-white py-12">
            <p>Blog content coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

