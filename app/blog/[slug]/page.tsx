import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/contentful';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// This page will statically generate at build time
// but will be revalidated every 60 seconds in production
export const revalidate = 60;

// Define types for blog posts
type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishDate?: string;
  featuredImage?: string | null;
  content: string;
  author?: {
    name?: string;
    avatar?: string;
  } | null;
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug) as BlogPost | null;
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Crystal Seed Tarot',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  return {
    title: `${post.title} | Crystal Seed Tarot`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug) as BlogPost | null;
  
  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(params.slug, 3) as BlogPost[];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white/90">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
        </div>
        
        <article className="bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          {post.featuredImage && (
            <div className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden max-w-2xl mx-auto">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </div>
          )}
          
          <div className="px-8 pt-8 pb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{post.title}</h1>
            
            {post.publishDate && (
              <p className="text-purple-300 mb-8">
                {formatDate(post.publishDate)}
                {post.author?.name && ` · By ${post.author.name}`}
              </p>
            )}
            
            <div className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Define custom components for certain elements if needed
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            
            {post.author && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name || 'Author'}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{post.author.name || 'Author'}</h3>
                    <p className="text-white/70">Crystal Seed Tarot</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You might also enjoy</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.slug} 
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
                >
                  {relatedPost.featuredImage && (
                    <div className="aspect-square p-3">
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{relatedPost.title}</h3>
                    {relatedPost.publishDate && (
                      <p className="text-sm text-purple-300 mb-2">
                        {formatDate(relatedPost.publishDate)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

