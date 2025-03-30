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
}

// This page will statically generate at build time
export const revalidate = 60;

export default async function BlogPost({ params }: BlogPostPageProps) {
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
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          {/* Back to Blog link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Featured image with 16:9 aspect ratio */}
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={imageTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Blog content */}
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {title}
            </h1>
            <time className="text-gray-400 mb-8 block">
              {new Date(publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            {/* Markdown content */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Customize markdown components for better styling
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-serif text-white mt-8 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-serif text-white mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-300 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mb-2">{children}</li>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-300 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
