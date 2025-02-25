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
    <header className="border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Talking Objects</Link>
        </h1>
        <nav className="flex gap-4 items-center">
          <Link 
            href="/dashboard" 
            className={`hover:underline ${pathname.startsWith('/dashboard') ? 'font-medium' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/explore" 
            className={`hover:underline ${pathname.startsWith('/explore') ? 'font-medium' : ''}`}
          >
            Explore
          </Link>
          <ProfileButton />
        </nav>
      </div>
    </header>
  );
} 