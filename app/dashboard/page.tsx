import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Agent } from "@/lib/supabase/types";
import AgentCard from "@/components/dashboard/AgentCard";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch the user's agents
  let agents: Agent[] = [];
  let error = null;
  
  if (session) {
    const { data, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      agents = data as Agent[];
    }
    
    if (fetchError) {
      error = fetchError.message;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Agents</h2>
        <Link 
          href="/dashboard/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Create New Agent
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          Error loading agents: {error}
        </div>
      )}

      {agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-center text-gray-500 py-8">
            You haven&apos;t created any agents yet. Click the &quot;Create New Agent&quot; button to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
} 