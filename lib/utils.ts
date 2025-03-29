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

