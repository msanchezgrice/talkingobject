'use client';

import { useRouter } from 'next/navigation';
import Link from "next/link";
import nextDynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import AgentForm to avoid SSR issues
const AgentForm = nextDynamic(() => import('@/components/dashboard/AgentForm'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function CreateAgentPage() {
  const router = useRouter();

  const handleSubmit = () => {
    // After successful submission, redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        <h2 className="text-2xl font-bold mt-4">Create New Agent</h2>
      </div>

      <AgentForm onSubmit={handleSubmit} />
    </div>
  );
} 