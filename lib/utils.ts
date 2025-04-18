import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cleans markdown text for use in excerpts and meta descriptions
 * Removes markdown symbols and truncates to a specified length
 */
export function cleanTextForMeta(
  text: string,
  maxLength: number = 160,
): string {
  // Remove markdown symbols
  const cleanText = text
    .replace(/#{1,6}\s/g, "") // Remove headings
    .replace(/\*\*/g, "") // Remove bold
    .replace(/\*/g, "") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with just the text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // Remove code blocks
    .replace(/~~([^~]+)~~/g, "$1") // Remove strikethrough
    .replace(/>\s(.*)/g, "$1") // Remove blockquotes
    .replace(/\n+/g, " ") // Replace multiple newlines with space
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  // Truncate to max length
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last space before maxLength
  const lastSpace = cleanText.lastIndexOf(" ", maxLength);
  return cleanText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
}

/**
 * Converts a blog title to a standardized image filename
 * Example: "My Blog Post" -> "Blog-My-Blog-Post.webp"
 */
export function getBlogImagePath(
  title: string,
  extension: string = "webp",
): string {
  // Convert title to kebab case (lowercase with hyphens)
  const baseFileName = title
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with hyphens

  // Create filename with "Blog-" prefix and proper case (capitalize words)
  const properCaseFileName = baseFileName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  return `/images/Blog-${properCaseFileName}.${extension}`;
}

/**
 * Generate a blog image path with fallbacks
 * Tries multiple file extensions and falls back to placeholder if none exist
 */
export function generateBlogImagePath(title: string): string {
  // If no title is provided, return the placeholder
  if (!title) {
    return "/images/blog-placeholder.jpg";
  }

  // Convert title to slug format for lookup
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  // Special case mapping based on slugs for more reliable matching
  const specialCaseImages: Record<string, string> = {
    "be-nice-to-yourself-dmnit": "/images/Blog-Be-Nice-to-Yourself-D-mnit.webp",
    "be-nice-to-yourself-d-mnit": "/images/Blog-Be-Nice-to-Yourself-D-mnit.webp",
    "accepting-the-totality-of-your-worth": "/images/Blog-Accepting-the-Totality-of-Your-Worth.webp",
    "the-irrational-fear-of-starting-over": "/images/Blog-The-Irrational-Fear-of-Starting-Over.webp",
  };

  // Check if we have a special case for this slug
  if (specialCaseImages[slug]) {
    console.log(`Using special case image path for slug "${slug}": ${specialCaseImages[slug]}`);
    return specialCaseImages[slug];
  }

  // For When Being A Good Person Goes Bad, use .jpg extension explicitly
  if (slug === "when-being-a-good-person-goes-bad") {
    console.log(`Using .jpg extension for slug "${slug}"`);
    return `/images/Blog-When-Being-A-Good-Person-Goes-Bad.jpg`;
  }

  // For other blogs, use .webp as the default extension
  console.log(`Using standard path generation for blog: "${title}", slug: "${slug}"`);
  
  // Create filename with "Blog-" prefix and proper case (capitalize words)
  const properCaseFileName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  return `/images/Blog-${properCaseFileName}.webp`;
}
