import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g. "February 23, 2023")
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Generate a random ID
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Extract excerpt from blog content
 * @param content - Full blog content
 * @param maxLength - Maximum length of excerpt
 * @returns Formatted excerpt
 */
export function getExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Remove any markdown/HTML formatting for clean excerpt
  const plainText = content.replace(/[#*_~`>]/g, '');
  
  if (plainText.length <= maxLength) return plainText;
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = plainText.substring(0, maxLength).lastIndexOf(' ');
  return `${plainText.substring(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
}

/**
 * Calculate estimated reading time for content
 * @param content - Text content to calculate reading time for
 * @param wordsPerMinute - Reading speed (default: 200 words per minute)
 * @returns Reading time in minutes (rounded up to nearest minute)
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 1;
  
  // Remove markdown and count words
  const plainText = content.replace(/[#*_~`>]/g, '');
  const wordCount = plainText.split(/\s+/).length;
  
  // Calculate reading time and round up to nearest minute (minimum 1 minute)
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Clean text for use in meta tags by removing special characters and limiting length
 * @param text - Text to clean
 * @param maxLength - Maximum length (default: 160 for meta descriptions)
 * @returns Cleaned text safe for meta tags
 */
export function cleanTextForMeta(text: string, maxLength: number = 160): string {
  if (!text) return '';
  
  // Remove markdown syntax, HTML, and extra whitespace
  const cleanText = text
    .replace(/[#*_~`>[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanText.length <= maxLength) return cleanText;
  
  // Find the last sentence or clause break before maxLength
  const breakPoints = ['. ', '! ', '? ', '; '];
  let bestBreakPoint = maxLength;
  
  for (const breakChar of breakPoints) {
    const breakPos = cleanText.lastIndexOf(breakChar, maxLength);
    if (breakPos > 0 && breakPos > bestBreakPoint - 30) {
      bestBreakPoint = breakPos + 1;
      break;
    }
  }
  
  // If no good break point found, find last space
  if (bestBreakPoint === maxLength) {
    const lastSpace = cleanText.lastIndexOf(' ', maxLength);
    if (lastSpace > 0) {
      bestBreakPoint = lastSpace;
    }
  }
  
  return cleanText.substring(0, bestBreakPoint).trim();
}

/**
 * Generate a canonical URL for a page
 * @param path - Path segment (without leading slash)
 * @param baseUrl - Base URL of the site
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string, baseUrl?: string): string {
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://crystalseedtarot.com';
  
  // Ensure path doesn't start with a slash and base URL doesn't end with one
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const cleanBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  
  return `${cleanBase}/${cleanPath}`;
}

/**
 * Generate keywords from a title and additional tags
 * @param title - Page title to extract keywords from
 * @param additionalKeywords - Additional keywords to include
 * @returns Array of keywords
 */
export function generateKeywords(title: string, additionalKeywords: string[] = []): string[] {
  if (!title) return additionalKeywords;
  
  // Extract words from title, remove short words, and convert to lowercase
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !['with', 'from', 'that', 'this', 'these', 'those', 'then'].includes(word))
    .map(word => word.replace(/[^\w\s]/gi, ''));
  
  // Combine with additional keywords and remove duplicates
  return Array.from(new Set([...additionalKeywords, ...titleWords]));
}

/**
 * Format content for social sharing
 * @param text - Text to format for social sharing
 * @param maxLength - Maximum length (Twitter: ~280, Facebook: ~250)
 * @returns Formatted text for social sharing
 */
export function formatSocialText(text: string, maxLength: number = 250): string {
  const cleanText = cleanTextForMeta(text, maxLength);
  
  // Add hashtags for major keywords if space permits
  const baseKeywords = ['tarot', 'crystalseedtarot', 'spirituality'];
  const remainingLength = maxLength - cleanText.length;
  
  if (remainingLength > 30) {
    return `${cleanText} ${baseKeywords.map(k => `#${k}`).join(' ')}`;
  }
  
  return cleanText;
}

/**
 * Generate standardized blog image path using the Blog-{{blogName}} convention
 * @param title - Blog post title 
 * @returns The standardized image path
 */
export function getBlogImagePath(title: string): string {
  if (!title) return '/images/Blog-Northern-Lights-Banner.jpg';
  
  // Format the title in title case with hyphens
  const titleCase = title.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  const formattedTitle = titleCase.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  // Standardized format: Blog-{{blogName}}.webp
  return `/images/Blog-${formattedTitle}.webp`;
}

/**
 * Create URL-friendly slug from title
 * @param title - Title to convert to slug
 * @returns URL-friendly slug
 */
export function createSlugFromTitle(title: string): string {
  if (!title) return 'untitled-post';
  
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}

