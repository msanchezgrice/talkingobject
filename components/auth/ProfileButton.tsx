'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface DatabaseProfile {
  id: string;
  auth_user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

interface UserWithProfile {
  user: User;
  profile: DatabaseProfile | null;
}

export default function ProfileButton() {
  const [userData, setUserData] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const fetchProfile = async (): Promise<DatabaseProfile | null> => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        return null;
      } else {
        console.error('Failed to fetch profile:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUserData(null);
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          // Get user profile
          const profile = await fetchProfile();
          
          if (mounted) {
            setUserData({
              user: session.user,
              profile
            });
          }
        } else {
          if (mounted) {
            setUserData(null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUserData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile();
          setUserData({
            user: session.user,
            profile
          });
        } else if (event === 'SIGNED_OUT') {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUserData(null);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>;
  }

  if (!userData) {
    return (
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const displayName = userData.profile?.full_name 
    || userData.profile?.username 
    || userData.user.email?.split('@')[0] 
    || 'User';

  const initials = userData.profile?.full_name
    ? userData.profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : displayName.charAt(0).toUpperCase();

  return (
    <div className="relative profile-menu">
      <button 
        onClick={toggleMenu}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
      >
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
          {initials}
        </div>
        <span className="hidden sm:inline text-foreground">{displayName}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-border">
            <div className="text-sm font-medium text-foreground">
              {displayName}
            </div>
            <div className="text-xs text-muted-foreground">
              {userData.user.email}
            </div>
          </div>
          
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Your Profile
          </Link>
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          
          <div className="border-t border-border mt-1 pt-1">
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 