'use client';

import Link from 'next/link';
import { ClerkProfileButton } from '@/components/auth/ClerkProfileButton';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Don't show the header on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
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
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Dashboard
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
            <ClerkProfileButton />
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
              href="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/feed" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Feed
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 