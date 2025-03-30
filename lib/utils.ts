import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cleans markdown text for use in excerpts and meta descriptions
 * Removes markdown symbols and truncates to a specified length
 */
export function cleanTextForMeta(text: string, maxLength: number = 160): string {
  // Remove markdown symbols
  const cleanText = text
    .replace(/#{1,6}\s/g, '') // Remove headings
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // Remove code blocks
    .replace(/~~([^~]+)~~/g, '$1') // Remove strikethrough
    .replace(/>\s(.*)/g, '$1') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Truncate to max length
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last space before maxLength
  const lastSpace = cleanText.lastIndexOf(' ', maxLength);
  return cleanText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}
