import { createClient, EntryCollection, Entry } from "contentful";
import { ContentfulResponse, BlogPost } from "@/types/blog";

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
  environment: "master", // Always use "master" environment to avoid environment confusion
});

// Map of blog slugs to custom publish dates
// This can be used to override dates from Contentful
const CUSTOM_PUBLISH_DATES: Record<string, string> = {
  "better-practices-for-your-practice": "2025-02-23T12:00:00.000Z",
  "when-being-a-good-person-goes-bad": "2023-02-03T12:00:00.000Z",
  "accepting-the-totality-of-your-worth": "2021-11-11T12:00:00.000Z",
  "the-irrational-fear-of-starting-over": "2021-06-15T12:00:00.000Z",
};

// Function to get publish date (custom if available, otherwise from Contentful)
export function getPublishDate(slug: string, contentfulDate?: string): string {
  // If we have a custom date for this slug, use it
  if (CUSTOM_PUBLISH_DATES[slug]) {
    return CUSTOM_PUBLISH_DATES[slug];
  }
  
  // Otherwise use the date from Contentful or fallback to current date
  return contentfulDate || new Date().toISOString();
}

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<ContentfulResponse> {
  try {
    // Skip API call if credentials are missing (return empty array)
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.warn("Contentful credentials missing. Using empty blog posts array.");
      return { items: [] };
    }

    const response = await client.getEntries<BlogPost>({
      content_type: "blogPost",
      // Don't sort by publishDate since it might not exist
    });

    // Transform the response to match our ContentfulResponse type
    // and add fallbacks for missing fields
    return {
      items: response.items.map((item) => ({
        fields: {
          ...(item.fields as BlogPost["fields"]),
          // Use custom publish date if available, otherwise use the one from Contentful or sys.createdAt
          publishDate: getPublishDate(item.fields.slug, item.fields.publishDate || item.sys.createdAt),
        },
        sys: {
          id: item.sys.id,
          createdAt: item.sys.createdAt,
          updatedAt: item.sys.updatedAt,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Return empty array instead of throwing error to prevent build failures
    return { items: [] };
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    // Skip API call if credentials are missing (return null)
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.warn("Contentful credentials missing. Unable to fetch blog post.");
      return null;
    }

    // Use type assertion to bypass TypeScript limitation with Contentful query parameters
    const query = {
      content_type: "blogPost",
      'fields.slug': slug
    };

    const response = await client.getEntries<BlogPost>(query as any);

    if (response.items.length === 0) {
      return null;
    }

    const item = response.items[0];

    // Add fallback for publishDate and use custom date if available
    return {
      ...item,
      fields: {
        ...item.fields,
        publishDate: getPublishDate(slug, item.fields.publishDate || item.sys.createdAt),
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    // Return null instead of throwing error to prevent build failures
    return null;
  }
}

// Development fallback data
export const mockBlogPosts: ContentfulResponse = {
  items: [
    {
      fields: {
        title: "Better Practices For Your Practice",
        slug: "better-practices-for-your-practice",
        content:
          "# Better Practices For Your Practice\n\nThis is a sample blog post with proper formatting. Each paragraph should have appropriate spacing.\n\n## Introduction\n\nWhen we first begin studying and practicing Tarot, there can be an overwhelming amount of information we come across, and not all of it is good. We can be steered in many misguided directions unfortunately, or may be given advice about how to work with Tarot which may more be rooted in superstition than the reality of how energy works.\n\nHopefully, with the right amount of practice, experience, and better guidance, we can find our way to better information and practices, but it takes time, discernment, and development to get there.\n\n## Misconceptions\n\nWith that said, here are some common misconceptions I would like to clear up about Tarot which I provide in the hopes that it may help you have an updated foundation for your own practice should you need. If nothing else, it's important to know that you can adapt and change your practice over the years as needed.",
        excerpt:
          "Learn how to improve your tarot practice with these essential tips.",
        featuredImage: undefined, // Changed from null to undefined to match type
        publishDate: "2025-02-23T12:00:00.000Z", // Updated to February 23, 2025
      },
      sys: {
        id: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      fields: {
        title: "Understanding Tarot Card Meanings",
        slug: "understanding-tarot-card-meanings",
        content:
          "# Understanding Tarot Card Meanings\n\nTarot cards have rich symbolism that can guide your readings...",
        excerpt:
          "Dive deep into the symbolism and meanings behind the major arcana cards.",
        featuredImage: undefined, // Changed from null to undefined to match type
        publishDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      sys: {
        id: "2",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    },
    {
      fields: {
        title: "Connecting with Your Intuition",
        slug: "connecting-with-your-intuition",
        content:
          "# Connecting with Your Intuition\n\nYour intuition is your most powerful tool in tarot reading...",
        excerpt:
          "Learn techniques to deepen your connection with your intuitive abilities.",
        featuredImage: undefined, // Changed from null to undefined to match type 
        publishDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      sys: {
        id: "3",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    },
  ],
};
