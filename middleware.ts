import { NextResponse } from 'next/server';

export async function middleware() {
  // Return next response without any auth checks
  return NextResponse.next();
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