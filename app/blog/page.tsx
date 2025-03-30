import { Metadata } from "next"
import { BlogCard } from "@/components/blog/BlogCard"
import { getAllBlogPosts, mockBlogPosts } from "@/lib/contentful"
import { generateBlogImagePath } from "@/lib/utils"

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
              // Get title with fallback
              const title = post.fields.title || 'Untitled Post';
              
              // Generate image URL based on the blog title
              // If the Contentful image exists, use that, otherwise generate a local path
              const imageUrl = post.fields.featuredImage?.url || generateBlogImagePath(title);
              const imageTitle = post.fields.featuredImage?.title || title;
              
              // Generate excerpt with fallback
              const excerpt = post.fields.excerpt || 
                (post.fields.content ? post.fields.content.substring(0, 150) + '...' : 'No excerpt available');
              
              return (
                <BlogCard
                  key={post.sys.id}
                  title={title}
                  slug={post.fields.slug}
                  excerpt={excerpt}
                  imageUrl={imageUrl}
                  imageTitle={imageTitle}
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

