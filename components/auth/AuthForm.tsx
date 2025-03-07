'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Simulate basic authentication
const simulateAuth = (email: string, password: string): Promise<{success: boolean, error?: string}> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (!email.includes('@')) {
        resolve({ success: false, error: 'Please enter a valid email address' });
        return;
      }
      
      if (password.length < 6) {
        resolve({ success: false, error: 'Password must be at least 6 characters long' });
        return;
      }
      
      // Store the user info in localStorage to simulate a session
      const userData = {
        email,
        name: email.split('@')[0],
        isLoggedIn: true,
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      resolve({ success: true });
    }, 800);
  });
};

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await simulateAuth(email, password);
      
      if (result.success) {
        console.log('Authentication successful');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 rounded-lg shadow-md p-8 border border-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {isLogin ? 'Login to your account' : 'Create a new account'}
      </h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
        <p className="mb-2">Demo mode: Authentication is simulated using browser storage.</p>
        <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
} 