import { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts, mockBlogPosts } from "@/lib/contentful";
import { generateBlogImagePath } from "@/lib/utils";
import { ContentfulResponse } from "@/types/blog";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog | Crystal Seed Tarot",
  description:
    "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  openGraph: {
    title: "Blog | Crystal Seed Tarot",
    description:
      "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  },
};

// This page will statically generate at build time
// Increased revalidation time to reduce API calls
export const revalidate = 3600; // Revalidate once per hour

export default async function Blog() {
  // Get blog posts with fallbacks for different scenarios
  let posts: ContentfulResponse["items"] = [];
  try {
    // In development, use mock data if Contentful is not configured
    if (process.env.NODE_ENV === "development" && !process.env.CONTENTFUL_SPACE_ID) {
      posts = mockBlogPosts.items;
    } else {
      // In production, getAllBlogPosts will return an empty array if there's an error
      const response = await getAllBlogPosts();
      posts = response.items;
    }
  } catch (error) {
    // Additional safety net - if something unexpected happens, use an empty array
    console.error("Error rendering blog page:", error);
    posts = [];
  }

  // Only sort if we have posts
  const sortedPosts = posts.length > 0 
    ? [...posts].sort((a, b) => {
        const dateA = new Date(a.fields.publishDate || a.sys.createdAt);
        const dateB = new Date(b.fields.publishDate || b.sys.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">
            Blog
          </h1>

          {/* Show message if no posts are available */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white text-xl">
                Blog posts are coming soon! Check back later for updates.
              </p>
            </div>
          )}

          {/* Blog grid */}
          {sortedPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => {
                // Get title with fallback
                const title = post.fields.title || "Untitled Post";

                // Generate image URL based on the blog title
                // If the Contentful image exists, use that, otherwise generate a local path
                const imageUrl =
                  post.fields.featuredImage?.url || generateBlogImagePath(title);
                const imageTitle = post.fields.featuredImage?.title || title;

                // Generate excerpt with fallback
                const excerpt =
                  post.fields.excerpt ||
                  (post.fields.content
                    ? post.fields.content.substring(0, 150) + "..."
                    : "No excerpt available");

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
          )}
        </div>
      </section>
    </div>
  );
}
