'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="max-w-md w-full mx-auto bg-gray-900 shadow-md border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 text-white border-gray-700"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 text-white border-gray-700"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
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
      </CardContent>
    </Card>
  );
} 