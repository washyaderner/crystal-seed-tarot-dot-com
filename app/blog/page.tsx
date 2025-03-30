import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllBlogPosts } from "@/lib/contentful"
import { BLOG_DEFAULTS } from "@/lib/contentful"
import { Metadata } from "next"
import { cleanTextForMeta } from "@/lib/utils"
import type { BlogPost } from "@/lib/utils"

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog | Crystal Seed Tarot",
  description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
  openGraph: {
    title: "Blog | Crystal Seed Tarot",
    description: "Explore tarot insights, self-growth advice, and spiritual guidance from Crystal Seed Tarot.",
    images: ['/images/Blog-Hero.jpg'],
  },
}

export default async function Blog({ 
  searchParams 
}: { 
  searchParams: { page?: string; category?: string; tag?: string } 
}) {
  // Get pagination parameters from query string
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const category = searchParams.category;
  const tag = searchParams.tag;
  
  // Fetch blog posts from Contentful with pagination
  const { posts: blogPosts, total, totalPages } = await getAllBlogPosts(page, BLOG_DEFAULTS.pagination.pageSize, category, tag);

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">Blog</h1>
          
          {/* Hero Image */}
          <div className="mb-12 relative rounded-lg overflow-hidden">
            <Image
              src="/images/Blog-Hero.jpg"
              alt="Crystal Seed Blog"
              width={1200}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] mix-blend-overlay"></div>
          </div>
          
          {/* Filter controls could go here */}
          
          {/* Blog posts grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post: BlogPost, index: number) => (
              <Link key={index} href={`/blog/${post.slug}`} className="block">
                <Card className={BLOG_DEFAULTS.cardStyle}>
                  <CardContent className="p-6">
                    {post.featuredImage && (
                      <Image
                        src={post.featuredImage || BLOG_DEFAULTS.fallbackImage}
                        alt={post.title}
                        width={800}
                        height={600}
                        className={BLOG_DEFAULTS.imageStyle}
                      />
                    )}
                    <h2 className="text-2xl font-serif text-white mb-4">{post.title}</h2>
                    <p className="text-white/80 mb-4">{cleanTextForMeta(post.excerpt || post.content, BLOG_DEFAULTS.excerptLength)}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-white/60">
                          {new Date(post.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {post.readingTime && (
                        <span className="text-white/60 text-sm">{post.readingTime}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/blog?page=${page - 1}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              
              <span className="px-4 py-2 bg-white/10 rounded-md text-white">
                Page {page} of {totalPages}
              </span>
              
              {page < totalPages && (
                <Link href={`/blog?page=${page + 1}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

