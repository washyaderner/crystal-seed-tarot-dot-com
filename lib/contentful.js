import { createClient } from 'contentful';

// Set up Contentful client with environment variables
// You'll need to add these to your .env.local file:
// CONTENTFUL_SPACE_ID=your_space_id
// CONTENTFUL_ACCESS_TOKEN=your_access_token
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  // Use preview tokens and API for draft content when in development
  host: process.env.NODE_ENV === 'development' 
    ? 'preview.contentful.com' 
    : 'cdn.contentful.com',
  accessToken: process.env.NODE_ENV === 'development'
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Get all blog posts
export async function getAllBlogPosts() {
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: '-fields.publishDate', // Sort by publish date descending
  });

  return response.items.map(post => ({
    slug: post.fields.slug,
    title: post.fields.title,
    excerpt: post.fields.excerpt || getExcerpt(post.fields.content),
    publishDate: post.fields.publishDate,
    featuredImage: post.fields.featuredImage?.fields?.file?.url 
      ? `https:${post.fields.featuredImage.fields.file.url}` 
      : null,
    content: post.fields.content,
    author: post.fields.author?.fields || null,
  }));
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug) {
  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (!response.items.length) {
    return null;
  }

  const post = response.items[0];
  
  return {
    slug: post.fields.slug,
    title: post.fields.title,
    excerpt: post.fields.excerpt || getExcerpt(post.fields.content),
    publishDate: post.fields.publishDate,
    featuredImage: post.fields.featuredImage?.fields?.file?.url 
      ? `https:${post.fields.featuredImage.fields.file.url}` 
      : null,
    content: post.fields.content,
    author: post.fields.author?.fields || null,
  };
}

// Get related blog posts (excluding the current post)
export async function getRelatedBlogPosts(currentSlug, limit = 3) {
  const allPosts = await getAllBlogPosts();
  return allPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit);
}

// Helper function to generate excerpt from content if not provided
function getExcerpt(content, maxLength = 150) {
  if (!content) return '';
  
  // Remove any markdown/HTML formatting for clean excerpt
  const plainText = content.replace(/[#*_~`>]/g, '');
  
  if (plainText.length <= maxLength) return plainText;
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = plainText.substring(0, maxLength).lastIndexOf(' ');
  return `${plainText.substring(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
} 