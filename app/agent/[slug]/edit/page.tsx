'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AgentForm from "@/components/dashboard/AgentForm";
import { getAgentBySlug, PlaceholderAgent } from '@/lib/placeholder-agents';

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<PlaceholderAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch the agent when the component mounts
    if (params.slug) {
      try {
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const foundAgent = getAgentBySlug(slug);
        
        if (foundAgent) {
          setAgent(foundAgent);
        } else {
          setError('Agent not found');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (err) {
        setError('Error loading agent');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [params.slug, router]);

  const handleSubmit = () => {
    // After successful submission, redirect to the dashboard
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-900 text-white p-4 rounded-md">
          <p>{error}</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        <h2 className="text-2xl font-bold mt-4 text-white">Edit Agent: {agent?.name}</h2>
      </div>

      {agent && <AgentForm agent={agent} onSubmit={handleSubmit} />}
    </div>
  );
} 