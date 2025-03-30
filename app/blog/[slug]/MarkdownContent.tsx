'use client'

import Image from "next/image"
// @ts-ignore - Ignore missing type declarations for react-markdown
import ReactMarkdown from "react-markdown"
// @ts-ignore - Ignore missing type declarations for remark-gfm
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <div className="text-white/80">No content available</div>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers
        h1: ({ children }: any) => <h1 className="text-3xl font-serif text-white mt-8 mb-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl font-serif text-white mt-8 mb-4">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-serif text-white mt-6 mb-3">{children}</h3>,
        
        // Text elements
        p: ({ children }: any) => <p className="mb-4 text-white/80">{children}</p>,
        a: ({ href, children }: any) => (
          <a href={href} className="text-purple-300 hover:text-purple-100 underline" target="_blank" rel="noopener noreferrer">{children}</a>
        ),
        em: ({ children }: any) => <em className="italic">{children}</em>,
        strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
        
        // Lists
        ul: ({ children }: any) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }: any) => <li className="mb-2">{children}</li>,
        
        // Block elements
        blockquote: ({ children }: any) => (
          <blockquote className="border-l-4 border-purple-400 pl-4 italic my-4">{children}</blockquote>
        ),
        hr: () => <hr className="border-white/20 my-8" />,
        
        // Media
        img: ({ src, alt }: any) => (
          <div className="flex justify-center my-6">
            <Image 
              src={src || ""} 
              alt={alt || ""} 
              width={600} 
              height={400} 
              className="rounded-lg object-cover" 
            />
          </div>
        ),
        
        // Code
        code: ({ inline, className, children }: any) => {
          if (inline) {
            return <code className="bg-white/10 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
          }
          return (
            <pre className="bg-white/10 p-4 rounded-lg overflow-auto my-6 font-mono text-sm">
              <code className="text-white">{children}</code>
            </pre>
          )
        },
        
        // Tables
        table: ({ children }: any) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }: any) => <thead className="bg-white/10">{children}</thead>,
        tbody: ({ children }: any) => <tbody className="bg-white/5">{children}</tbody>,
        tr: ({ children }: any) => <tr className="border-b border-white/10">{children}</tr>,
        th: ({ children }: any) => <th className="p-2 text-left font-semibold text-white">{children}</th>,
        td: ({ children }: any) => <td className="p-2 text-white/80">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
} 