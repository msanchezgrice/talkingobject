'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the user type for local testing
type User = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For local testing, we'll use a mock user
    const mockUser: User = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://via.placeholder.com/150',
      created_at: new Date().toISOString(),
    };

    // Simulate loading
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          <div className="bg-gray-900 rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800">
                {user.avatar_url ? (
                  <Image 
                    src={user.avatar_url} 
                    alt={user.name} 
                    layout="fill" 
                    objectFit="cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl text-gray-400">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-400 mb-4">{user.email}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Account Info</h3>
                    <p className="text-gray-400">Member since: {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md mr-4">
                    Edit Profile
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-10 border-t border-gray-800 pt-6">
              <h3 className="text-xl font-semibold mb-4">My Agents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* No agents yet message */}
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-gray-400">You haven&apos;t created any agents yet.</p>
                  <Link href="/dashboard/create" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                    Create your first agent
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Unable to load profile information.</p>
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 