import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { getBlogPostBySlug, getRelatedBlogPosts, BLOG_DEFAULTS } from '@/lib/contentful';
import { formatDate, cleanTextForMeta, getCanonicalUrl, generateKeywords, getReadingTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { generateBlogPostSchema, generateBlogBreadcrumbSchema, generateFAQSchemaFromContent } from '@/lib/schema';
import Script from 'next/script';

// This page will statically generate at build time
// but will be revalidated every 60 seconds in production
export const revalidate = 60;

// Define types for blog posts
type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishDate?: string;
  featuredImage?: string | null;
  content: string;
  author?: {
    name?: string;
    avatar?: string;
  } | null;
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug) as BlogPost | null;
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Crystal Seed Tarot',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  // Get the base URL from parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crystalseedtarot.com';
  
  // Clean the description - remove markdown and limit length
  const cleanDescription = cleanTextForMeta(post.excerpt || post.content, 160);

  // Generate canonical URL
  const url = getCanonicalUrl(`blog/${post.slug}`, baseUrl);
  
  // Generate keywords from title and defaults
  const keywords = generateKeywords(post.title, ['tarot', 'crystal seed tarot', 'spiritual guidance', 'tarot reading']);
  
  // Calculate reading time
  const readingTime = getReadingTime(post.content);
  
  return {
    title: `${post.title} | Crystal Seed Tarot`,
    description: cleanDescription,
    keywords: keywords,
    authors: post.author?.name ? [{ name: post.author.name }] : [{ name: 'Crystal Seed Tarot' }],
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url,
      siteName: 'Crystal Seed Tarot',
      images: post.featuredImage 
        ? [{ url: post.featuredImage, width: 1200, height: 675, alt: post.title }]
        : previousImages,
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.publishDate, // Use same as publish date if no update date available
      authors: post.author?.name ? [post.author.name] : ['Crystal Seed Tarot'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      images: post.featuredImage ? [post.featuredImage] : [],
      creator: '@crystalseedtarot',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL(baseUrl),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug) as BlogPost | null;
  
  if (!post) {
    notFound();
  }

  // Calculate reading time
  const readingTime = getReadingTime(post.content);

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(params.slug, 3) as BlogPost[];
  
  // Generate JSON-LD structured data
  const blogPostSchema = generateBlogPostSchema(post);
  const breadcrumbSchema = generateBlogBreadcrumbSchema(post);
  
  // Generate FAQ schema if the content has appropriate structure
  const faqSchema = generateFAQSchemaFromContent(post.content);
  
  // We need to render each schema separately due to type issues
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-white">
      {/* Add JSON-LD structured data */}
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className={`inline-flex items-center ${BLOG_DEFAULTS.textColor} hover:brightness-125 transition-colors`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
        </div>
        
        <article className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden shadow-xl">
          {/* Featured image - always show image with fallback if none provided */}
          <div className="p-6 pb-4">
            <div className="relative h-80 w-full rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage || BLOG_DEFAULTS.fallbackImage}
                alt={post.title}
                fill
                className="object-cover transition-all duration-300 hover:brightness-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          </div>
          
          <div className="px-8 pt-6 pb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 text-white">{post.title}</h1>
            
            {post.publishDate && (
              <p className={BLOG_DEFAULTS.mutedTextColor + " mb-2"}>
                {formatDate(post.publishDate)}
                {post.author?.name && ` · By ${post.author.name}`}
              </p>
            )}
            
            <p className={BLOG_DEFAULTS.mutedTextColor + " mb-8"}>
              {readingTime} min read
            </p>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Define custom components for certain elements if needed
                  h1: ({node, ...props}) => <h1 className="text-3xl font-serif mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-serif mt-6 mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  a: ({node, ...props}) => <a className={`${BLOG_DEFAULTS.textColor} hover:brightness-125`} {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            
            {post.author && (
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="flex items-center">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name || 'Author'}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-serif">{post.author.name || 'Author'}</h3>
                    <p className="text-white/70">Crystal Seed Tarot</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif mb-8">You might also enjoy</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.slug} 
                  href={`/blog/${relatedPost.slug}`}
                  className={BLOG_DEFAULTS.cardStyle}
                >
                  {relatedPost.featuredImage && (
                    <div className={BLOG_DEFAULTS.imagePadding}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={relatedPost.featuredImage || BLOG_DEFAULTS.fallbackImage}
                          alt={relatedPost.title}
                          fill
                          className={BLOG_DEFAULTS.imageStyle}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-6 pt-2">
                    <h3 className={BLOG_DEFAULTS.titleStyle}>{relatedPost.title}</h3>
                    {relatedPost.publishDate && (
                      <p className={`${BLOG_DEFAULTS.mutedTextColor} mb-4 text-sm`}>
                        {formatDate(relatedPost.publishDate)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

