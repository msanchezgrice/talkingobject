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
    <Card className="max-w-md w-full mx-auto bg-card shadow-xl border-2">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-2 h-11 focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-2 h-11 focus:border-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      
        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
        
        <div className="pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="mb-2">Demo mode: Authentication is simulated using browser storage.</p>
          <Link href="/" className="text-primary hover:text-primary/80 hover:underline font-medium">
            Back to home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 