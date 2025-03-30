'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogCardProps } from '@/types/blog';
import { format } from 'date-fns';
import { cleanTextForMeta } from '@/lib/utils';

export function BlogCard({ title, slug, excerpt, imageUrl, imageTitle, publishDate }: BlogCardProps) {
  const cleanExcerpt = cleanTextForMeta(excerpt, 120);
  
  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="bg-black/20 backdrop-blur-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
        {/* Image container with 1:1 aspect ratio */}
        <div className="relative w-full aspect-square">
          <Image
            src={imageUrl}
            alt={imageTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Content container with consistent padding */}
        <div className="p-6">
          <h2 className="text-xl font-serif text-white mb-2 group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {cleanExcerpt}
          </p>
          <time className="text-gray-400 text-sm">
            {format(new Date(publishDate), 'MMMM d, yyyy')}
          </time>
        </div>
      </article>
    </Link>
  );
} 