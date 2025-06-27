import { NextResponse } from 'next/server';

export async function middleware() {
  const response = NextResponse.next();
  
  // Add Permissions Policy headers to allow microphone access
  response.headers.set(
    'Permissions-Policy',
    'microphone=(self), camera=(self), geolocation=(self)'
  );
  
  // Also add Feature Policy for broader browser support
  response.headers.set(
    'Feature-Policy',
    'microphone \'self\'; camera \'self\'; geolocation \'self\''
  );
  
  // Add Cross-Origin headers for audio processing
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  return response;
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes that don't need auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/public).*)',
  ],
}; 