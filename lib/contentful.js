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

// Standard blog parameters for consistency
const BLOG_DEFAULTS = {
  imageAspectRatio: '16/9', // Consistent aspect ratio across all blog images
  imagePadding: 'p-6 pb-4',  // Updated padding to match home page
  cardStyle: 'bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 hover:bg-white/15 rounded-lg', // Explicit rounded-lg added
  imageStyle: 'rounded-lg overflow-hidden w-full object-cover transition-all duration-300 hover:brightness-110', // Match home image style with brightness hover
  titleStyle: 'text-xl font-serif mb-4 text-white', // Match the home page title styling
  excerptLength: 150, // Standard excerpt length
  fallbackImage: '/images/blog-placeholder.jpg', // Default fallback image
  textColor: 'text-white', // Standard text color for consistency
  mutedTextColor: 'text-white/70', // For dates and secondary text
};

// Export the blog defaults for use in blog pages
export { BLOG_DEFAULTS };

// Helper function to generate image filename from blog title
function generateImageFilenameFromTitle(title) {
  if (!title) return BLOG_DEFAULTS.fallbackImage;
  
  // Format: Blog-Title-With-Dashes.webp or .jpg
  // First convert to title case
  const titleCase = title.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  
  // Replace spaces with hyphens and remove special characters
  const formattedTitle = titleCase.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  // This follows the naming convention: Blog-Title-With-Dashes.webp
  // We'll try webp first, but code can fallback to jpg if needed
  return `/images/Blog-${formattedTitle}.webp`;
}

// Get all blog posts
export async function getAllBlogPosts() {
  try {
    if (!client) {
      return mockBlogPosts;
    }

    const response = await client.getEntries({
      content_type: 'blogPost',
      order: '-sys.createdAt',
    });

    // Process blog posts before returning - add defaults
    return response.items.map(item => {
      // Extract fields from Contentful format
      const post = {
        ...item.fields,
        sys: item.sys,
      };
      
      // First check if there's a Contentful featuredImage
      if (item.fields.featuredImage?.fields?.file?.url) {
        post.featuredImage = `https:${item.fields.featuredImage.fields.file.url}`;
      }
      
      // Process with standardized function
      return processBlogPost(post);
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return mockBlogPosts;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug) {
  try {
    if (!client) {
      const post = mockBlogPosts.find(post => post.slug === slug);
      return post || null;
    }

    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
    });

    if (response.items.length === 0) {
      return null;
    }

    const item = response.items[0];
    
    // Extract fields from Contentful format
    const post = {
      ...item.fields,
      sys: item.sys,
    };
    
    // First check if there's a Contentful featuredImage
    if (item.fields.featuredImage?.fields?.file?.url) {
      post.featuredImage = `https:${item.fields.featuredImage.fields.file.url}`;
    }
    
    // Process the blog post - add defaults
    return processBlogPost(post);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    const post = mockBlogPosts.find(post => post.slug === slug);
    return post || null;
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

// Process blog post to ensure it has all required fields and follows standards
function processBlogPost(post) {
  if (!post) return null;
  
  // Ensure all required fields exist
  const processedPost = {
    ...post,
    title: post.title || 'Untitled Post',
    slug: post.slug || generateSlugFromTitle(post.title || 'untitled-post'),
    excerpt: post.excerpt || truncateContent(post.content, BLOG_DEFAULTS.excerptLength),
    content: post.content || '',
  };
  
  // Set featured image - try to find a matching image based on title if none exists
  if (!processedPost.featuredImage) {
    processedPost.featuredImage = findFeaturedImageForPost(processedPost.title);
  }
  
  // Set publish date - use system createdAt if no explicit publishDate
  if (!processedPost.publishDate && processedPost.sys && processedPost.sys.createdAt) {
    processedPost.publishDate = processedPost.sys.createdAt;
  }
  
  return processedPost;
}

// Helper to find a featured image for a post based on its title
function findFeaturedImageForPost(title) {
  if (!title) return BLOG_DEFAULTS.fallbackImage;
  
  // First try the webp version
  const webpFilename = generateImageFilenameFromTitle(title);
  
  // We could add logic here to check if the file exists,
  // but for simplicity we'll just return the generated filename
  // and let Next.js handle fallbacks if the image doesn't exist
  return webpFilename;
}

// Helper to truncate content for excerpts
function truncateContent(content, maxLength = 150) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  
  // Try to find a sentence or paragraph break near the desired length
  const breakPoints = ['. ', '! ', '? ', '\n\n'];
  let bestBreakPoint = maxLength;
  
  // Look for natural breaks
  for (const breakChar of breakPoints) {
    const breakPos = content.lastIndexOf(breakChar, maxLength);
    if (breakPos > 0 && breakPos > bestBreakPoint - 30) {
      bestBreakPoint = breakPos + breakChar.length;
      break;
    }
  }
  
  return content.substring(0, bestBreakPoint) + '...';
}

// Helper to generate a slug from a title
function generateSlugFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
} 