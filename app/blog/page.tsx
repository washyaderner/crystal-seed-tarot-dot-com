import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, BLOG_DEFAULTS } from '@/lib/contentful';
import { formatDate, getCanonicalUrl, cleanTextForMeta, generateKeywords } from '@/lib/utils';
import { Metadata } from 'next';
import { generateWebsiteSchema, generateBlogBreadcrumbSchema } from '@/lib/schema';
import Script from 'next/script';

// This page will statically generate at build time
// but will be revalidated every 60 seconds in production
export const revalidate = 60;

// Define metadata for the blog listing page
export const metadata: Metadata = {
  title: 'Blog | Crystal Seed Tarot',
  description: cleanTextForMeta('Explore tarot readings, spiritual guidance, and personal growth insights from Crystal Seed Tarot. Discover practices to deepen your connection with tarot.'),
  keywords: generateKeywords('Crystal Seed Tarot Blog', ['tarot blog', 'crystal seed tarot', 'tarot readings', 'spiritual guidance', 'tarot practices', 'tarot tips']),
  openGraph: {
    title: 'Crystal Seed Tarot Blog',
    description: cleanTextForMeta('Explore tarot readings, spiritual guidance, and personal growth insights from Crystal Seed Tarot.'),
    url: getCanonicalUrl('blog'),
    siteName: 'Crystal Seed Tarot',
    images: [
      {
        url: '/images/Blog-Northern-Lights-Banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Crystal Seed Tarot Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crystal Seed Tarot Blog',
    description: cleanTextForMeta('Explore tarot readings, spiritual guidance, and personal growth insights from Crystal Seed Tarot.'),
    images: ['/images/Blog-Northern-Lights-Banner.jpg'],
    creator: '@crystalseedtarot',
  },
  alternates: {
    canonical: getCanonicalUrl('blog'),
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
};

// Define a type for blog posts
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

export default async function BlogPage() {
  // Fetch blog posts from Contentful
  const blogPosts = await getAllBlogPosts() as BlogPost[];
  
  // Generate schemas
  const websiteSchema = generateWebsiteSchema();
  const breadcrumbSchema = generateBlogBreadcrumbSchema();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white/90">
      {/* Add JSON-LD structured data */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="max-w-6xl mx-auto">
        <div>
          <h1 className="text-5xl font-bold mb-10 text-center text-white">Crystal Seed Tarot Blog</h1>
          
          <div className="mb-12 relative rounded-lg overflow-hidden">
            <Image
              src="/images/Blog-Northern-Lights-Banner.jpg"
              alt="Crystal Seed Blog - Northern Lights Banner"
              width={1200}
              height={400}
              className="w-full h-64 object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] mix-blend-overlay"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className={`${BLOG_DEFAULTS.cardStyle} transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 flex flex-col`}
              >
                <div className={BLOG_DEFAULTS.imagePadding}>
                  <div className={`relative w-full ${BLOG_DEFAULTS.imageStyle}`} style={{ aspectRatio: BLOG_DEFAULTS.imageAspectRatio }}>
                    <Image
                      src={post.featuredImage || BLOG_DEFAULTS.fallbackImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-4 pt-2 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  {post.publishDate ? (
                    <p className="text-sm text-purple-300 mb-3">
                      {formatDate(post.publishDate)}
                    </p>
                  ) : null}
                  <p className="text-white/75 mb-4 flex-1">{post.excerpt}</p>
                  <div className="mt-auto">
                    <span className="text-purple-400 inline-flex items-center">
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

