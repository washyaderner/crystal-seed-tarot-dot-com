import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/contentful"
import { BLOG_DEFAULTS } from "@/lib/contentful"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cleanTextForMeta } from "@/lib/utils"
import type { BlogPost } from "@/lib/utils"
import MarkdownContent from "./MarkdownContent"
import Script from "next/script"

// Generate metadata dynamically for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Crystal Seed Tarot',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  // Use SEO description if available, otherwise create from content
  const description = post.seoDescription || cleanTextForMeta(post.excerpt || post.content);
  
  return {
    title: `${post.title} | Crystal Seed Tarot`,
    description,
    keywords: post.seoKeywords || [post.category || 'tarot', 'crystal seed tarot'],
    openGraph: {
      title: `${post.title} | Crystal Seed Tarot`,
      description,
      images: [post.featuredImage || BLOG_DEFAULTS.fallbackImage],
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author?.name || 'Holly Cole'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.featuredImage || BLOG_DEFAULTS.fallbackImage],
    },
    alternates: {
      canonical: `https://crystalseedtarot.com/blog/${params.slug}`,
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug) as BlogPost | null;
  
  if (!post) {
    notFound();
  }

  // Get related posts with the same category if possible
  const relatedPosts = await getRelatedBlogPosts(params.slug, 3, true) as BlogPost[];

  // Format the date for display
  const publishedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Structured data for SEO
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage || BLOG_DEFAULTS.fallbackImage,
    datePublished: post.publishDate,
    dateModified: post.sys?.updatedAt || post.publishDate,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Holly Cole',
      url: 'https://crystalseedtarot.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crystal Seed Tarot',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crystalseedtarot.com/logo.png',
      },
    },
    description: post.seoDescription || cleanTextForMeta(post.excerpt || post.content),
    keywords: post.seoKeywords?.join(', ') || `tarot, ${post.category}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://crystalseedtarot.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="text-white hover:text-white/80 transition-colors mb-8 inline-block">
            ← Back to Blog
          </Link>
          <article className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{post.title}</h1>
            
            {/* Post metadata */}
            <div className="flex flex-wrap justify-between items-center mb-6 text-white/60">
              <div>
                <time dateTime={post.publishDate}>{publishedDate}</time>
                <span className="mx-2">•</span>
                <span>{post.author?.name || 'Holly Cole'}</span>
              </div>
              {post.readingTime && (
                <div className="text-white/60">{post.readingTime}</div>
              )}
            </div>
            
            {/* Tags/categories */}
            {((post.tags && post.tags.length > 0) || post.category) && (
              <div className="mb-6">
                {post.category && (
                  <Link href={`/blog?category=${post.category}`} className="mr-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white transition-colors">
                    {post.category}
                  </Link>
                )}
                {post.tags?.map((tag, idx) => (
                  <Link key={idx} href={`/blog?tag=${tag}`} className="mr-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Featured image */}
            {post.featuredImage && (
              <div className="flex justify-center mb-8">
                <Image
                  src={post.featuredImage || BLOG_DEFAULTS.fallbackImage}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            )}
            
            {/* Post content */}
            <div className="text-white/80 prose prose-invert max-w-none">
              <MarkdownContent content={post.content} />
            </div>
            
            {/* Structured data script for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />
          </article>
          
          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-serif text-white mb-8 text-center">Related Posts</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost: BlogPost, index: number) => (
                  <Link key={index} href={`/blog/${relatedPost.slug}`} className="block">
                    <Card className={BLOG_DEFAULTS.cardStyle}>
                      <CardContent className="p-6">
                        {relatedPost.featuredImage && (
                          <Image
                            src={relatedPost.featuredImage || BLOG_DEFAULTS.fallbackImage}
                            alt={relatedPost.title}
                            width={400}
                            height={300}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="text-xl font-serif text-white mb-2">{relatedPost.title}</h3>
                        <div className="flex justify-between items-center">
                          <p className="text-white/60 text-sm">{new Date(relatedPost.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                          {relatedPost.readingTime && (
                            <span className="text-white/60 text-sm">{relatedPost.readingTime}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

