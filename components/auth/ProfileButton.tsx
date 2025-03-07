'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Simple user type for our simulated auth
interface SimulatedUser {
  email: string;
  name: string;
  isLoggedIn: boolean;
  lastLogin: string;
}

export default function ProfileButton() {
  const [user, setUser] = useState<SimulatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via our simulated auth
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('userData');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>;
  }

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:inline">{user.name}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1 z-10">
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Your Profile
          </Link>
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 