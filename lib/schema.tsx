/**
 * Schema.org JSON-LD generators for SEO
 */

import { BLOG_DEFAULTS } from './contentful';
import { getReadingTime } from './utils';

/**
 * Generate BlogPosting schema for individual blog posts
 */
export function generateBlogPostSchema(post: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  publishDate?: string;
  featuredImage?: string | null;
  author?: {
    name?: string;
    avatar?: string;
  } | null;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crystalseedtarot.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const authorName = post.author?.name || 'Crystal Seed Tarot';
  const readingTime = getReadingTime(post.content);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage || `${baseUrl}/images/blog-placeholder.jpg`,
    url: postUrl,
    datePublished: post.publishDate || new Date().toISOString(),
    dateModified: post.publishDate || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crystal Seed Tarot',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    keywords: post.title.split(' ').join(',').toLowerCase(),
  };
}

/**
 * Generate BreadcrumbList schema for blog posts
 */
export function generateBlogBreadcrumbSchema(post?: {
  title?: string;
  slug?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crystalseedtarot.com';
  
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${baseUrl}/blog`,
    },
  ];
  
  // Add the blog post as a third level if specified
  if (post?.title && post?.slug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `${baseUrl}/blog/${post.slug}`,
    });
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
}

/**
 * Generate FAQPage schema from blog content with headers and paragraphs
 * This extracts H2/H3 headers and following paragraphs as Q&A pairs
 */
export function generateFAQSchemaFromContent(content: string) {
  // This is a simplified version - for complex markdown you'd need a proper parser
  // Using basic regex that doesn't require the 's' flag
  const faqMatches = content.match(/#{2,3}\s*(.*?)\s*\n([\s\S]*?)(?=\n#{2,3}|\n*$)/g);
  
  if (!faqMatches || faqMatches.length === 0) {
    return null;
  }
  
  const faqItems = faqMatches.map((match) => {
    const question = match.match(/#{2,3}\s*(.*?)\s*\n/)?.[1] || '';
    const answerText = match.replace(/#{2,3}\s*(.*?)\s*\n/, '').trim();
    
    return {
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerText,
      },
    };
  });
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems,
  };
}

/**
 * Generate WebSite schema for the site
 */
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crystalseedtarot.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Crystal Seed Tarot',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
} 