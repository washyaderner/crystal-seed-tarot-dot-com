'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BLOG_DEFAULTS } from '@/lib/contentful';

interface ClientImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
}

export default function ClientImage({
  src,
  alt,
  fallbackSrc = BLOG_DEFAULTS.fallbackImage,
  className = '',
  fill = false,
  priority = false,
  width,
  height
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.error(`Image failed to load: ${imgSrc}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Common props for all image variants
  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority
  };

  // Return either fill or sized image based on props
  return fill ? (
    <Image 
      {...imageProps}
      fill
    />
  ) : (
    <Image 
      {...imageProps}
      width={width || 800}
      height={height || 450}
    />
  );
} 