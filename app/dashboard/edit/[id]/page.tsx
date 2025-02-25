import Link from "next/link";
import { notFound } from "next/navigation";
import AgentForm from "@/components/dashboard/AgentForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/supabase/types";

export default async function EditAgentPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return notFound(); // User not logged in
  }
  
  // Fetch the agent
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();
  
  if (error || !data) {
    return notFound(); // Agent not found or doesn't belong to user
  }
  
  const agent = data as Agent;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        <h2 className="text-2xl font-bold mt-4">Edit Agent: {agent.name}</h2>
      </div>

      <AgentForm agent={agent} />
    </div>
  );
} 