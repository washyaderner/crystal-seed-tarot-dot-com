import { Metadata } from "next"
import { BlogCard } from "@/components/blog/BlogCard"
import { getAllBlogPosts, mockBlogPosts } from "@/lib/contentful"

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog | Crystal Seed Tarot",
  description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  openGraph: {
    title: "Blog | Crystal Seed Tarot",
    description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  },
}

// This page will statically generate at build time
export const revalidate = 60;

export default async function Blog() {
  // In development, use mock data if Contentful is not configured
  const posts = process.env.NODE_ENV === 'development' && !process.env.CONTENTFUL_SPACE_ID
    ? mockBlogPosts.items
    : (await getAllBlogPosts()).items;

  // Sort posts by date (publishDate or createdAt) descending
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.fields.publishDate || a.sys.createdAt);
    const dateB = new Date(b.fields.publishDate || b.sys.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">Blog</h1>
          
          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => {
              // Add fallbacks for missing fields
              const featuredImage = post.fields.featuredImage || {
                url: '/images/Blog-Default.webp',
                title: 'Default Blog Image',
              };
              
              return (
                <BlogCard
                  key={post.sys.id}
                  title={post.fields.title || 'Untitled Post'}
                  slug={post.fields.slug}
                  excerpt={post.fields.excerpt || 'No excerpt available'}
                  imageUrl={featuredImage.url}
                  imageTitle={featuredImage.title}
                  publishDate={post.fields.publishDate || post.sys.createdAt}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

