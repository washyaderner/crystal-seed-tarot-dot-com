import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getBlogPostBySlug, mockBlogPosts } from "@/lib/contentful";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types/blog";
import { generateBlogImagePath, cleanTextForMeta } from "@/lib/utils";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post =
      process.env.NODE_ENV === "development" && !process.env.CONTENTFUL_SPACE_ID
        ? mockBlogPosts.items.find((item) => item.fields.slug === params.slug)
        : await getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Blog Post Not Found | Crystal Seed Tarot",
        description: "The requested blog post could not be found.",
      };
    }

    // Access fields correctly and add fallbacks
    const fields = post.fields;
    const title = fields.title || "Untitled Post";
    const content = fields.content || "";
    const excerpt =
      fields.excerpt ||
      (content ? cleanTextForMeta(content) : "No excerpt available");

    // Generate image URL based on the blog title
    const imageUrl = fields.featuredImage?.url || generateBlogImagePath(title);
    const imageTitle = fields.featuredImage?.title || title;

    return {
      title: `${title} | Crystal Seed Tarot Blog`,
      description: excerpt,
      openGraph: {
        title: `${title} | Crystal Seed Tarot Blog`,
        description: excerpt,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: imageTitle,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating blog post metadata:", error);
    return {
      title: "Blog | Crystal Seed Tarot",
      description: "Explore tarot insights and spiritual guidance from Crystal Seed Tarot.",
    };
  }
}

// This page will statically generate at build time
// Increased revalidation time to reduce API calls
export const revalidate = 3600; // Revalidate once per hour

export default async function BlogPost({ params }: BlogPostPageProps) {
  try {
    const post =
      process.env.NODE_ENV === "development" && !process.env.CONTENTFUL_SPACE_ID
        ? mockBlogPosts.items.find((item) => item.fields.slug === params.slug)
        : await getBlogPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    const { fields } = post;

    // Add fallbacks for any potentially missing fields
    const title = fields.title || "Untitled Post";
    const content = fields.content || "# No content available";
    const publishDate = fields.publishDate || post.sys.createdAt;

    // Generate image URL based on the blog title
    const imageUrl = fields.featuredImage?.url || generateBlogImagePath(title);
    const imageTitle = fields.featuredImage?.title || title;

    return (
      <article className="min-h-screen">
        <div className="bg-black/20 backdrop-blur-lg py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back to Blog link */}
              <Link
                href="/blog"
                className="text-white hover:text-opacity-80 mb-4 inline-block transition duration-200"
              >
                ← Back to Blog
              </Link>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mt-4 mb-6">
                {title}
              </h1>

              {/* Publish date */}
              <p className="text-gray-300 mb-8">
                {new Date(publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* Featured image */}
              <div className="mb-8 rounded-md overflow-hidden aspect-video relative">
                <Image
                  src={imageUrl}
                  alt={imageTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Blog content */}
              <div className="prose prose-lg max-w-none text-white prose-headings:text-white prose-a:text-blue-300 hover:prose-a:text-blue-200 prose-strong:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    // If there's an unexpected error, log it and fall back to 404
    console.error("Error rendering blog post:", error);
    notFound();
  }
}
