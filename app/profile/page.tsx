'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllAgents, PlaceholderAgent } from '@/lib/placeholder-agents';

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
  const [userAgents, setUserAgents] = useState<PlaceholderAgent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Try to get user data from localStorage
        const storedUser = localStorage.getItem('userData');
        let userData: User;

        if (storedUser) {
          userData = JSON.parse(storedUser);
        } else {
          // Create a default user for testing
          userData = {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'Test User',
            email: 'test@example.com',
            avatar_url: 'https://via.placeholder.com/150',
            created_at: new Date().toISOString(),
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Get user's agents
        const allAgents = getAllAgents();
        const userAgents = allAgents.filter(agent => agent.user_id === userData.id);

        // Update state
        setUser(userData);
        setUserAgents(userAgents);
        setEditForm({
          name: userData.name,
          email: userData.email
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const updatedUser = {
          ...user,
          name: editForm.name,
          email: editForm.email,
          last_updated: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        // Update state
        setUser(updatedUser);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: user.name, email: user.email });
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    {user.avatar_url ? (
                      <Image 
                        src={user.avatar_url} 
                        alt={user.name} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl text-gray-400 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                    <p className="text-gray-400 mb-6">{user.email}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-white mb-2">Account Info</h3>
                        <p className="text-gray-400">Member since: {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-white mb-2">Agents Created</h3>
                        <p className="text-gray-400">{userAgents.length} agent{userAgents.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">My Agents</h3>
                  <Link
                    href="/dashboard/create"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors text-sm"
                  >
                    Create New Agent
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAgents.length > 0 ? (
                    userAgents.map(agent => (
                      <div key={agent.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                            {agent.image_url ? (
                              <Image
                                src={agent.image_url}
                                alt={agent.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-2xl text-gray-400 font-bold">{agent.name[0]}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{agent.name}</h4>
                            <p className="text-sm text-gray-400 mb-3">{agent.category}</p>
                            <div className="flex gap-2">
                              <Link
                                href={`/agent/${agent.slug}`}
                                className="text-sm bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded-md transition-colors"
                              >
                                View
                              </Link>
                              <Link
                                href={`/agent/${agent.slug}/edit`}
                                className="text-sm bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded-md transition-colors"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-gray-700 p-6 rounded-lg text-center">
                      <p className="text-gray-400 mb-4">You haven&apos;t created any agents yet.</p>
                      <Link
                        href="/dashboard/create"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors"
                      >
                        Create Your First Agent
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">Unable to load profile information.</p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 