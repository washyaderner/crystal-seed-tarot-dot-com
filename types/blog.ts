import { EntrySkeletonType } from "contentful";

// Blog post interface for Contentful content
export interface BlogPost extends EntrySkeletonType {
  fields: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: {
      url: string;
      title: string;
      description?: string;
    };
    publishDate?: string;
    author?: string;
    tags?: string[];
  };
  contentTypeId: "blogPost";
}

// Blog card props for the preview component
export interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  imageTitle: string;
  publishDate: string;
}

// Contentful response type
export interface ContentfulResponse {
  items: Array<{
    fields: BlogPost["fields"];
    sys: {
      id: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}
