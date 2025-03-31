import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next();

  // Define CSP based on environment
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  
  const cspDirectives = [
    "default-src 'self'",
    // Allow scripts from Vercel and form submission
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.live https://*.vercel.app",
    "script-src-elem 'self' 'unsafe-inline' https://*.vercel.live https://*.vercel.app",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    // Allow connections to FormSubmit and Vercel services
    "connect-src 'self' https://formsubmit.co https://*.vercel.live https://*.vercel.app",
    // Allow Vercel live feedback iframe
    "frame-src 'self' https://*.vercel.live https://*.vercel.app",
    "worker-src 'self' blob:",
    // Allow form submission
    "form-action 'self' https://formsubmit.co"
  ].join('; ');

  // Add security headers
  response.headers.set('Content-Security-Policy', cspDirectives);

  // Add comment explaining CSP
  console.log(`Middleware applied CSP for ${isVercelPreview ? 'preview' : 'production'} environment`);

  return response;
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Skip all internal paths (_next, api/*)
    '/((?!_next|api/|favicon.ico).*)',
  ],
}; 