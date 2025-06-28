'use client';

import Link from 'next/link';
import ProfileButton from '@/components/auth/ProfileButton';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Don't show the header on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-card border-b border-border py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-primary transition-colors text-foreground">Talking Objects</Link>
        </h1>
        <nav className="flex gap-6 items-center">
          <Link 
            href="/dashboard" 
            className={`hover:text-primary transition-colors ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/explore" 
            className={`hover:text-primary transition-colors ${pathname.startsWith('/explore') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Explore
          </Link>
          {/* Temporarily disabled feed tab
          <Link 
            href="/feed" 
            className={`hover:text-blue-400 transition-colors ${pathname.startsWith('/feed') ? 'text-blue-400' : ''}`}
          >
            Feed
          </Link>
          */}
          <ProfileButton />
        </nav>
      </div>
    </header>
  );
} 