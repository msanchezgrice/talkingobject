import Link from "next/link";
import AgentForm from "@/components/dashboard/AgentForm";

export default function CreateAgentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        <h2 className="text-2xl font-bold mt-4">Create New Agent</h2>
      </div>

      <AgentForm />
    </div>
  );
} 