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
  // Provide more explicit error for missing credentials
  console.error('ERROR: Contentful credentials are missing. Add CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN to your .env.local file.');
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: Missing Contentful credentials in production environment!');
  }
}

// Get all blog posts
export async function getAllBlogPosts() {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        console.error('ERROR: Contentful client not available in production environment. Check environment variables.');
        return []; // Return empty array in production to avoid showing mock data
      }
      console.warn('Using mock blog data in development mode.');
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
    
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Contentful fetch failed in production environment!');
      return []; // Return empty array in production instead of mock data
    }
    
    console.warn('Falling back to mock blog posts due to Contentful error (development only)');
    return mockBlogPosts;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug) {
  try {
    if (!client) {
      if (process.env.NODE_ENV === 'production') {
        console.error(`ERROR: Contentful client not available in production environment. Cannot fetch post "${slug}".`);
        return null; // Return null in production to show 404 page
      }
      console.warn(`Using mock blog data for slug "${slug}" in development mode.`);
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
    
    if (process.env.NODE_ENV === 'production') {
      console.error(`CRITICAL: Contentful fetch failed for slug "${slug}" in production environment!`);
      return null; // Return null in production to show 404 page
    }
    
    console.warn(`Falling back to mock data for slug "${slug}" due to Contentful error (development only)`);
    const post = mockBlogPosts.find(post => post.slug === slug);
    return post || null;
  }
}

// Get related blog posts (excluding the current post)
export async function getRelatedBlogPosts(currentSlug, limit = 3) {
  if (!client) {
    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR: Contentful client not available in production environment. Cannot fetch related posts.');
      return []; // Return empty array in production
    }
    console.warn('Using mock blog data for related posts in development mode.');
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
    
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Contentful fetch failed for related posts in production environment!');
      return []; // Return empty array in production instead of mock data
    }
    
    console.warn('Falling back to mock data for related posts due to Contentful error (development only)');
    return mockBlogPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }
}

// Mock blog posts for development without Contentful
const mockBlogPosts = process.env.NODE_ENV === 'production' ? [] : [
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