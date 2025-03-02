'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthForm() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard without requiring authentication
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 rounded-lg shadow-md p-8 border border-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Logging in automatically...
      </h2>
      
      <div className="text-center text-gray-300 mb-4">
        <p>You are being redirected to the dashboard.</p>
        <p>Authentication has been disabled for local testing.</p>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
        <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
} 