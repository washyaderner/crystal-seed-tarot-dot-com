'use client';

import { useEffect, useState } from 'react';

export default function DebugImage({ src, fallback }: { src: string | null | undefined, fallback: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [imagePath, setImagePath] = useState<string>('');
  
  useEffect(() => {
    // Check if image exists by creating a hidden image element
    const img = new Image();
    const imageSrc = src || fallback;
    
    img.onload = () => {
      setStatus('success');
      setImagePath(imageSrc);
    };
    
    img.onerror = () => {
      console.error('Image failed to load:', imageSrc);
      setStatus('error');
      setImagePath(fallback);
    };
    
    img.src = imageSrc;
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);
  
  return (
    <div className="mb-2 px-2 text-xs bg-black/20 rounded">
      <div>Image Debug:</div>
      <div>Original Path: {src || 'No source provided'}</div>
      <div>Status: {status}</div>
      <div>Using: {imagePath}</div>
    </div>
  );
} 