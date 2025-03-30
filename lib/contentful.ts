import { createClient, ContentfulClientApi, EntrySkeletonType, EntryCollection } from 'contentful';
import type { BlogPost } from './utils';
import { Document } from '@contentful/rich-text-types';
import { getReadingTime } from './utils';

// Blog default styling and configuration
export const BLOG_DEFAULTS = {
  imageAspectRatio: '16/9',
  cardStyle: 'bg-white/10 backdrop-blur-md border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15',
  imageStyle: 'w-full h-48 object-cover rounded-lg mb-4 transition-all duration-300 hover:brightness-110',
  excerptLength: 150,
  fallbackImage: '/images/Blog-Hero.jpg',
  textColor: 'text-white',
  pagination: {
    pageSize: 9,
    defaultPage: 1
  }
};

// Define the expected shape of our Contentful entries
interface ContentfulBlogPostFields {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: {
    fields: {
      file: {
        url: string;
        details?: {
          image?: {
            width: number;
            height: number;
          }
        }
      }
      title?: string;
      description?: string;
    }
  };
  // Handle possible variations in field names
  publishedDate?: string;  // Alternative to publishDate
  publishDate?: string;
  date?: string;
  published?: string;
  author?: {
    fields: {
      name: string;
      picture?: {
        fields: {
          file: {
            url: string;
          }
        }
      }
    }
  };
  tags?: string[];
  keywords?: string[];  // Alternative to tags
  category?: string;
  section?: string;     // Alternative to category
  type?: string;        // Alternative to category
  seoDescription?: string;
  metaDescription?: string; // Alternative to seoDescription
  seoKeywords?: string[];
}

interface ContentfulBlogPostEntry extends EntrySkeletonType<ContentfulBlogPostFields> {}

// Custom author interface to fix type errors
interface Author {
  name: string;
  avatar?: string;
}

// Type guard to check if an object is a ContentfulBlogPostEntry
function isContentfulBlogPostEntry(entry: any): entry is ContentfulBlogPostEntry {
  return (
    entry &&
    typeof entry === 'object' &&
    entry.sys &&
    entry.fields &&
    typeof entry.fields === 'object'
  );
}

// Initialize client with proper typing
let client: ContentfulClientApi<any> | null = null;

// Provide informative error message for missing environment variables
if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error('ERROR: Contentful credentials are missing in environment variables.');
  console.error('Required variables: CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN');
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using mock data because Contentful credentials are missing.');
  } else {
    console.error('CRITICAL: Missing Contentful credentials in production environment!');
  }
} else {
  // Create client only if credentials are available
  try {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN,
      host: process.env.NODE_ENV === 'development' && process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        ? 'preview.contentful.com'
        : 'cdn.contentful.com',
    });
    console.log('Contentful client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Contentful client:', error);
  }
}

// Create slug from title
function createSlugFromTitle(title: string): string {
  if (!title) return 'untitled-post';
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Generate blog image path based on title
function getBlogImagePath(title: string): string {
  if (!title) return BLOG_DEFAULTS.fallbackImage;
  
  // Generate a reasonable fallback image path based on title
  const slug = createSlugFromTitle(title);
  return `/images/Blog-${slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('-')}.webp`;
}

// Map Contentful fields to our BlogPost interface with flexible field mapping
function mapContentfulToBlogPost(entry: any): BlogPost {
  // Handle both raw entry and processed entry formats
  const fields = isContentfulBlogPostEntry(entry) ? entry.fields : entry;
  const sys = entry.sys || {};
  
  // Extract content safely
  const content = fields.content || '';
  
  // Calculate reading time from content
  const readingTime = getReadingTime(content);
  
  // Handle possible field name variations for date
  const publishDate = 
    fields.publishDate || 
    fields.publishedDate || 
    fields.date || 
    fields.published || 
    sys.createdAt || 
    new Date().toISOString();
  
  // Handle possible field name variations for tags
  const tags = fields.tags || fields.keywords || [];
  
  // Handle possible field name variations for category
  const category = fields.category || fields.section || fields.type || 'General';

  // Handle possible field name variations for SEO description
  const seoDescription = fields.seoDescription || fields.metaDescription || '';
  
  // Handle featured image with fallbacks
  let featuredImage = BLOG_DEFAULTS.fallbackImage;
  
  // Try to get featured image from Contentful if available
  if (fields.featuredImage && fields.featuredImage.fields && fields.featuredImage.fields.file) {
    featuredImage = `https:${fields.featuredImage.fields.file.url}`;
  } else {
    // Generate a fallback image path based on the post title
    featuredImage = getBlogImagePath(fields.title);
  }
  
  // Handle author information with fallbacks
  let author: Author = { name: 'Holly Cole' };
  
  if (fields.author && fields.author.fields) {
    author = {
      name: fields.author.fields.name || 'Holly Cole',
    };
    
    // Add author avatar if available
    if (fields.author.fields.picture && fields.author.fields.picture.fields && fields.author.fields.picture.fields.file) {
      author.avatar = `https:${fields.author.fields.picture.fields.file.url}`;
    }
  }
  
  // Construct excerpt if not provided
  const excerpt = fields.excerpt || (content ? content.substring(0, BLOG_DEFAULTS.excerptLength) + '...' : '');
  
  // Return a properly formatted BlogPost object
  return {
    title: fields.title || 'Untitled',
    slug: fields.slug || createSlugFromTitle(fields.title),
    content,
    excerpt,
    featuredImage,
    publishDate,
    author,
    sys,
    readingTime,
    tags,
    category,
    seoDescription,
    seoKeywords: fields.seoKeywords || [],
  };
}

// Get all blog posts with pagination, category and tag filtering
export async function getAllBlogPosts(
  page = BLOG_DEFAULTS.pagination.defaultPage, 
  limit = BLOG_DEFAULTS.pagination.pageSize, 
  category?: string, 
  tag?: string
): Promise<{posts: BlogPost[], total: number, totalPages: number}> {
  try {
    // Check if client is available
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        console.error('ERROR: Contentful client not available in production. Check environment variables.');
        return { posts: [], total: 0, totalPages: 0 }; 
      }
      
      console.warn('Using mock blog data in development mode (Contentful client not available).');
      
      // Filter mock data if needed
      let filteredPosts = [...mockBlogPosts];
      
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      if (tag) {
        filteredPosts = filteredPosts.filter(post => post.tags?.includes(tag));
      }
      
      // Handle pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      
      return { 
        posts: paginatedPosts, 
        total, 
        totalPages 
      };
    }

    // Build query parameters
    const queryParams: {
      content_type: string;
      limit: number;
      skip: number;
      order?: any; // Using any for order to avoid TypeScript errors
      [key: string]: any;
    } = {
      content_type: 'blogPost',
      limit,
      skip: (page - 1) * limit,
    };

    // Default sort order
    queryParams.order = ['-sys.createdAt'];

    // Try different field names for sorting if available
    try {
      // First try to sort by publishDate if it exists
      await client.getEntries({
        content_type: 'blogPost',
        order: ['-fields.publishDate'] as any,
        limit: 1
      });
      queryParams.order = ['-fields.publishDate', '-sys.createdAt'];
    } catch (error) {
      try {
        // Then try publishedDate
        await client.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'] as any,
          limit: 1
        });
        queryParams.order = ['-fields.publishedDate', '-sys.createdAt'];
      } catch (error) {
        try {
          // Then try date
          await client.getEntries({
            content_type: 'blogPost',
            order: ['-fields.date'] as any,
            limit: 1
          });
          queryParams.order = ['-fields.date', '-sys.createdAt'];
        } catch (error) {
          // Fall back to sys.createdAt
          console.warn('Could not determine date field for sorting, using createdAt');
          queryParams.order = ['-sys.createdAt'];
        }
      }
    }

    // Add category filter if provided (try different field names)
    if (category) {
      // Try to determine the correct field name for category
      try {
        await client.getEntries({
          content_type: 'blogPost',
          'fields.category': category,
          limit: 1
        });
        queryParams['fields.category'] = category;
      } catch (error) {
        try {
          await client.getEntries({
            content_type: 'blogPost',
            'fields.section': category,
            limit: 1
          });
          queryParams['fields.section'] = category;
        } catch (error) {
          try {
            await client.getEntries({
              content_type: 'blogPost',
              'fields.type': category,
              limit: 1
            });
            queryParams['fields.type'] = category;
          } catch (error) {
            console.warn(`Category field not found for: ${category}`);
            // Skip category filtering if field doesn't exist
          }
        }
      }
    }

    // Add tag filter if provided (try different field names)
    if (tag) {
      try {
        await client.getEntries({
          content_type: 'blogPost',
          'fields.tags': tag,
          limit: 1
        });
        queryParams['fields.tags'] = tag;
      } catch (error) {
        try {
          await client.getEntries({
            content_type: 'blogPost',
            'fields.keywords': tag,
            limit: 1
          });
          queryParams['fields.keywords'] = tag;
        } catch (error) {
          console.warn(`Tags field not found for: ${tag}`);
          // Skip tag filtering if field doesn't exist
        }
      }
    }

    // Execute the query with our parameters
    const response = await client.getEntries(queryParams);
    
    // Map Contentful entries to our BlogPost format
    const posts = response.items.map((item: any) => {
      return mapContentfulToBlogPost(item);
    });

    return { 
      posts, 
      total: response.total, 
      totalPages: Math.ceil(response.total / limit)
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // In production, don't use mock data
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Contentful fetch failed in production environment!');
      return { posts: [], total: 0, totalPages: 0 };
    }
    
    // In development, fall back to mock data
    console.warn('Falling back to mock blog posts due to Contentful error (development only)');
    return { 
      posts: mockBlogPosts.slice(0, limit), 
      total: mockBlogPosts.length, 
      totalPages: Math.ceil(mockBlogPosts.length / limit) 
    };
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        console.error(`ERROR: Contentful client not available in production environment. Cannot fetch post "${slug}".`);
        return null;
      }
      
      console.warn(`Using mock blog data for slug "${slug}" in development mode.`);
      const post = mockBlogPosts.find(post => post.slug === slug);
      return post || null;
    }

    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2, // Include nested references up to 2 levels
    });

    if (response.items.length === 0) {
      console.warn(`Blog post with slug "${slug}" not found.`);
      return null;
    }

    // Map the Contentful entry to our BlogPost format
    const post = mapContentfulToBlogPost(response.items[0]);
    return post;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    
    if (process.env.NODE_ENV === 'production') {
      console.error(`CRITICAL: Contentful fetch failed for slug "${slug}" in production environment!`);
      return null;
    }
    
    console.warn(`Falling back to mock data for slug "${slug}" due to Contentful error (development only)`);
    const post = mockBlogPosts.find(post => post.slug === slug);
    return post || null;
  }
}

// Get related blog posts (excluding the current post)
export async function getRelatedBlogPosts(currentSlug: string, limit = 3, sameCategory = true): Promise<BlogPost[]> {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        console.error('ERROR: Contentful client not available in production environment. Cannot fetch related posts.');
        return [];
      }
      
      console.warn('Using mock blog data for related posts in development mode.');
      return mockBlogPosts
        .filter(post => post.slug !== currentSlug)
        .slice(0, limit);
    }

    // First get the current post to find its category
    const currentPost = await getBlogPostBySlug(currentSlug);
    
    if (!currentPost) {
      return [];
    }
    
    // Query parameters
    const queryParams: any = {
      content_type: 'blogPost',
      limit: limit + 1, // Fetch one extra in case we get the current post
      'fields.slug[ne]': currentSlug,
    };
    
    // If we want posts from the same category and we have a category
    if (sameCategory && currentPost.category) {
      // Try to determine the correct field name for category
      try {
        await client.getEntries({
          content_type: 'blogPost',
          'fields.category': currentPost.category,
          limit: 1
        });
        queryParams['fields.category'] = currentPost.category;
      } catch (error) {
        try {
          await client.getEntries({
            content_type: 'blogPost',
            'fields.section': currentPost.category,
            limit: 1
          });
          queryParams['fields.section'] = currentPost.category;
        } catch (error) {
          try {
            await client.getEntries({
              content_type: 'blogPost',
              'fields.type': currentPost.category,
              limit: 1
            });
            queryParams['fields.type'] = currentPost.category;
          } catch (error) {
            console.warn(`Category field not found for related posts: ${currentPost.category}`);
            // If we can't find the category field, just get posts without filtering
          }
        }
      }
    }
    
    const response = await client.getEntries(queryParams);
    
    // Map Contentful entries to our BlogPost format
    const relatedPosts = response.items
      .map((item: any) => mapContentfulToBlogPost(item))
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
      
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Contentful fetch failed for related posts in production environment!');
      return [];
    }
    
    console.warn('Falling back to mock data for related posts due to Contentful error (development only)');
    return mockBlogPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        return [];
      }
      
      // Extract unique categories from mock data
      const categories = mockBlogPosts.map(post => post.category || 'General');
      return Array.from(new Set(categories));
    }
    
    // Try different field names for categories
    let categoryField = 'category';
    let entries: EntryCollection<any> | null = null;
    
    // Try to find which field is used for categories
    try {
      entries = await client.getEntries({
        content_type: 'blogPost',
        select: ['fields.category'],
        limit: 1,
      });
      categoryField = 'category';
    } catch (error) {
      try {
        entries = await client.getEntries({
          content_type: 'blogPost',
          select: ['fields.section'],
          limit: 1,
        });
        categoryField = 'section';
      } catch (error) {
        try {
          entries = await client.getEntries({
            content_type: 'blogPost',
            select: ['fields.type'],
            limit: 1,
          });
          categoryField = 'type';
        } catch (error) {
          console.warn('Could not determine field name for categories');
          return [];
        }
      }
    }
    
    // Fetch all entries with just the category field
    entries = await client.getEntries({
      content_type: 'blogPost',
      select: [`fields.${categoryField}`],
      limit: 1000,
    });
    
    // Extract unique categories
    const categoriesWithDuplicates = entries.items
      .map((item: any) => {
        if (item.fields && item.fields[categoryField]) {
          return item.fields[categoryField];
        }
        return 'General';
      });
      
    return Array.from(new Set(categoriesWithDuplicates));
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // Fallback to mock data
    const categories = mockBlogPosts.map(post => post.category || 'General');
    return Array.from(new Set(categories));
  }
}

// Get all tags
export async function getAllTags(): Promise<string[]> {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        return [];
      }
      
      // Extract unique tags from mock data
      const allTags = mockBlogPosts.flatMap(post => post.tags || []);
      return Array.from(new Set(allTags));
    }
    
    // Try different field names for tags
    let tagField = 'tags';
    let entries: EntryCollection<any> | null = null;
    
    // Try to find which field is used for tags
    try {
      entries = await client.getEntries({
        content_type: 'blogPost',
        select: ['fields.tags'],
        limit: 1,
      });
      tagField = 'tags';
    } catch (error) {
      try {
        entries = await client.getEntries({
          content_type: 'blogPost',
          select: ['fields.keywords'],
          limit: 1,
        });
        tagField = 'keywords';
      } catch (error) {
        console.warn('Could not determine field name for tags');
        return [];
      }
    }
    
    // Fetch all entries with just the tags field
    entries = await client.getEntries({
      content_type: 'blogPost',
      select: [`fields.${tagField}`],
      limit: 1000,
    });
    
    // Extract and flatten all tags
    const allTags = entries.items.flatMap((item: any) => {
      if (item.fields && item.fields[tagField] && Array.isArray(item.fields[tagField])) {
        return item.fields[tagField];
      }
      return [];
    });
    
    return Array.from(new Set(allTags));
  } catch (error) {
    console.error('Error fetching tags:', error);
    
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // Fallback to mock data
    const allTags = mockBlogPosts.flatMap(post => post.tags || []);
    return Array.from(new Set(allTags));
  }
}

// Generate sitemap data for blog posts
export async function getBlogSitemapData(): Promise<{ url: string, lastModified: string }[]> {
  try {
    const { posts } = await getAllBlogPosts(1, 100); // Get up to 100 posts for sitemap
    
    return posts.map(post => ({
      url: `/blog/${post.slug}`,
      lastModified: post.sys?.updatedAt || post.publishDate || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error generating sitemap data:', error);
    return [];
  }
}

// Mock blog posts for development without Contentful
const mockBlogPosts: BlogPost[] = process.env.NODE_ENV === 'production' ? [] : [
  {
    title: "Better Practices for Your Practice",
    excerpt:
      "When we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the reality of how energy works.",
    publishDate: "2023-02-23",
    author: {
      name: "Holly Cole",
    },
    slug: "better-practices-for-your-practice",
    featuredImage: "/images/Blog-Better-Practices-For-Your-Practice.webp",
    content: "When we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the reality of how Energy works. Hopefully, with the right amount of practice, experience, and better guidance, we can find our way to better information and practices, but it takes time, discernment, and development to get there.\n\nOften, we may find that although we adopt certain practices when we first start doing Tarot, they may need some revision after we have gained more experience working with the cards. Once we have worked with the cards for a while, we may find that some things we were told or read when we were first learning may not have been good advice, or doesn't actually work for us, or make sense.\n\n1. Coming into ownership of your deck  \nGen. 1 misconception: You must be gifted your deck.  \nGen. 2 better practice: You can gift yourself a deck.\n\nIf I had waited to be gifted a deck, I never would have started doing Tarot and that was almost twenty years ago now. If you are called to do Tarot, then by all means, DO TAROT! I think the concept of being gifted a deck is an older tradition that doesn't necessarily apply to our current day and age anymore. I fully believe in taking destiny into your own hands and buying your own deck, and we wouldn't be here today if I hadn't. Also, now that I do Tarot, people buy me decks all the time.",
    readingTime: "3 min read",
    tags: ["tarot", "beginners", "practices"],
    category: "Tarot Tips",
    seoDescription: "Discover better practices for your tarot practice with these updated guidelines that challenge traditional misconceptions and help you develop a more authentic relationship with your cards.",
    seoKeywords: ["tarot practice", "tarot beginners", "tarot myths", "tarot deck ownership"]
  },
  {
    title: "When Being A Good Person Goes Bad",
    excerpt:
      "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective Recently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read…",
    publishDate: "2023-02-03",
    author: {
      name: "Holly Cole",
    },
    slug: "when-being-a-good-person-goes-bad",
    featuredImage: "/images/Blog-When-Being-A-Good-Person-Goes-Bad.jpg",
    content: "Life rules for the overly empathic, care-takers, over-helpers, and the overly-objective\n\nRecently I read for a woman who sat down for a 3 card reading. I was at a public event and had met her briefly when I read for her daughter a few hours earlier. I knew then that I really wanted to read for her, too. I get these feelings sometimes, when I know someone could receive a lot of value from a reading, even if I don't specifically know what the cards will say.",
    readingTime: "2 min read",
    tags: ["empathy", "self-care", "boundaries"],
    category: "Personal Growth",
    seoDescription: "Learn when being overly empathic or helpful can become detrimental to your well-being and how to establish healthy boundaries while still being a compassionate person.",
    seoKeywords: ["empathy burnout", "healthy boundaries", "self-care", "people pleasing"]
  },
  {
    title: "Accepting the Totality of Your Worth",
    excerpt:
      "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…",
    publishDate: "2021-11-11",
    author: {
      name: "Holly Cole",
    },
    slug: "accepting-the-totality-of-your-worth",
    featuredImage: "/images/Blog-Accepting-the-Totality-of-Your-Worth.webp",
    content: "One question that I get asked a lot in Tarot is \"How do I find my soulmate?\" While I can't tell you exactly where you'll meet your significant other or when, there are several things that I believe can help bring you to the point in your life where just the right circumstances are met…",
    readingTime: "5 min read",
    tags: ["relationships", "self-worth", "love"],
    category: "Relationships",
    seoDescription: "Discover how accepting your full self-worth is crucial to finding meaningful relationships and attracting a soulmate who values everything you bring to the table.",
    seoKeywords: ["self-worth", "finding soulmate", "relationship advice", "manifestation"]
  }
]; 