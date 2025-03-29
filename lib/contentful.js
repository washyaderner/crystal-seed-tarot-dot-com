import { createClient } from 'contentful';

// Set up Contentful client with environment variables
// You'll need to add these to your .env.local file:
// CONTENTFUL_SPACE_ID=your_space_id
// CONTENTFUL_ACCESS_TOKEN=your_access_token
let client;

// Create client only if credentials are available
if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.NODE_ENV === 'development'
      ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN
      : process.env.CONTENTFUL_ACCESS_TOKEN,
    host: process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
      ? 'preview.contentful.com'
      : 'cdn.contentful.com',
  });
} else {
  // Provide mock data for development without Contentful credentials
  console.warn('Contentful credentials missing. Using mock data.');
}

// Get all blog posts
export async function getAllBlogPosts() {
  // If no client, return mock data
  if (!client) {
    return mockBlogPosts;
  }

  try {
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
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return mockBlogPosts;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug) {
  // If no client, return mock data
  if (!client) {
    return mockBlogPosts.find(post => post.slug === slug) || null;
  }

  try {
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
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return mockBlogPosts.find(post => post.slug === slug) || null;
  }
}

// Get related blog posts (excluding the current post)
export async function getRelatedBlogPosts(currentSlug, limit = 3) {
  // If no client, return mock data
  if (!client) {
    return mockBlogPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }

  try {
    const allPosts = await getAllBlogPosts();
    return allPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return mockBlogPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }
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

// Mock blog posts for development without Contentful
const mockBlogPosts = [
  {
    title: "Better Practices for Your Practice",
    excerpt:
      "When we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the reality of how energy works.",
    publishDate: "2023-02-23",
    author: {
      name: "Holly Cole",
      avatar: null
    },
    slug: "better-practices-for-your-practice",
    featuredImage: "/images/Blog-Better-Practices-For-Your-Practice.webp",
    content: "When we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the reality of how Energy works. Hopefully, with the right amount of practice, experience, and better guidance, we can find our way to better information and practices, but it takes time, discernment, and development to get there.\n\nOften, we may find that although we adopt certain practices when we first start doing Tarot, they may need some revision after we have gained more experience working with the cards. Once we have worked with the cards for a while, we may find that some things we were told or read when we were first learning may not have been good advice, or doesn't actually work for us, or make sense.\n\n1. Coming into ownership of your deck  \nGen. 1 misconception: You must be gifted your deck.  \nGen. 2 better practice: You can gift yourself a deck.\n\nIf I had waited to be gifted a deck, I never would have started doing Tarot and that was almost twenty years ago now. If you are called to do Tarot, then by all means, DO TAROT! I think the concept of being gifted a deck is an older tradition that doesn't necessarily apply to our current day and age anymore. I fully believe in taking destiny into your own hands and buying your own deck, and we wouldn't be here today if I hadn't. Also, now that I do Tarot, people buy me decks all the time."
  },
  {
    title: "When Being A Good Person Goes Bad",
    excerpt:
      "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective Recently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read…",
    publishDate: "2023-02-03",
    author: {
      name: "Holly Cole",
      avatar: null
    },
    slug: "when-being-a-good-person-goes-bad",
    featuredImage: "/images/Blog-When-Being-A-Good-Person-Goes-Bad.jpg",
    content: "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective\n\nRecently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read for her, too. I get these feelings sometimes, when I know someone could receive a lot of value from a reading, even if I don't specifically know what the cards will say."
  },
  {
    title: "Accepting the Totality of Your Worth",
    excerpt:
      "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…",
    publishDate: "2021-11-11",
    author: {
      name: "Holly Cole",
      avatar: null
    },
    slug: "accepting-the-totality-of-your-worth",
    featuredImage: "/images/Blog-Accepting-the-Totality-of-Your-Worth.webp",
    content: "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…"
  }
]; 