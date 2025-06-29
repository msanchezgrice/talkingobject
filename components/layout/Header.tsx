'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ClerkProfileButton } from '@/components/auth/ClerkProfileButton';
import dynamic from 'next/dynamic';

function HeaderInner() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-md border-b border-gray-800/50 relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              🗣️ Talking Objects
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {isLoaded && isSignedIn ? (
                // Signed in navigation - just Dashboard
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                // Signed out navigation - Explore and Feed
                <>
                  <Link 
                    href="/explore" 
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    Explore
                  </Link>
                  <Link 
                    href="/feed" 
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    Feed
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoaded && !isSignedIn ? (
              // Signed out - Show Sign Up and Sign In
              <div className="flex items-center space-x-3">
                <Link 
                  href="/sign-up"
                  className="text-gray-300 hover:text-white transition-colors font-medium hidden sm:inline"
                >
                  Sign Up
                </Link>
                <ClerkProfileButton />
              </div>
            ) : (
              // Signed in - Show profile button
              <ClerkProfileButton />
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex space-x-6">
            {isLoaded && isSignedIn ? (
              // Signed in mobile navigation
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Dashboard
              </Link>
            ) : (
              // Signed out mobile navigation
              <>
                <Link 
                  href="/explore" 
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Explore
                </Link>
                <Link 
                  href="/feed" 
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Feed
                </Link>
                <Link 
                  href="/sign-up"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

// Dynamic import to avoid SSR issues with Clerk
const DynamicHeader = dynamic(() => Promise.resolve(HeaderInner), {
  ssr: false,
  loading: () => (
    <header className="bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-md border-b border-gray-800/50 relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              🗣️ Talking Objects
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/explore" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Explore
              </Link>
              <Link 
                href="/feed" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Feed
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Link 
                href="/sign-up"
                className="text-gray-300 hover:text-white transition-colors font-medium hidden sm:inline"
              >
                Sign Up
              </Link>
              <Link href="/sign-in" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-md transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex space-x-6">
            <Link 
              href="/explore" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Explore
            </Link>
            <Link 
              href="/feed" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Feed
            </Link>
            <Link 
              href="/sign-up"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  ),
});

export default function Header() {
  return <DynamicHeader />;
} 