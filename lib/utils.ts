import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define BlogPost interface for type safety
export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishDate: string;
  featuredImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  sys?: {
    createdAt?: string;
    updatedAt?: string;
    id?: string;
  };
  readingTime?: string;
  tags?: string[];
  category?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// Clean text for metadata by removing markdown and truncating
export function cleanTextForMeta(text: string, maxLength = 160): string {
  if (!text) return "";
  // Strip markdown and truncate intelligently
  const cleanText = text.replace(/[#*_~`>[\]]/g, '').replace(/\s+/g, ' ').trim();
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
}

// Format date for display
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate reading time for a text
export function getReadingTime(text: string): string {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

