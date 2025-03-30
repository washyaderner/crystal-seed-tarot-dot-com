import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// Generate metadata for the not found page
export function generateMetadata(): Metadata {
  return {
    title: 'Post Not Found | Crystal Seed Tarot',
    description: 'The blog post you are looking for could not be found.',
  };
}

export default function BlogPost() {
  // Simply return a not found page since we don't have blog functionality yet
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="text-white hover:text-white/80 transition-colors mb-8 inline-block">
            ← Back to Blog
          </Link>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Post Not Found</h1>
            <p className="text-white/80 mb-4">The blog post you are looking for could not be found.</p>
            <p className="text-white/80">Blog functionality will be implemented soon.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

