import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white py-16">
      <main className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">
            Create Interactive AI Agents for the Real World
          </h2>
          <p className="text-xl mb-12 text-gray-300">
            Design AI agents with unique personalities that interact with people through QR codes in the physical world.
            Connect your agents to live data sources like weather, news, and more.
          </p>

          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Create Your Agent
            </Link>
            <Link 
              href="/explore" 
              className="border border-gray-600 hover:border-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Agents
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Personalized Agents</h3>
            <p className="text-gray-300">Create custom AI agents with unique personalities, appearances, and knowledge bases.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Location Awareness</h3>
            <p className="text-gray-300">Anchor your agents to real-world locations to provide contextual information and experiences.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-blue-400">QR Code Integration</h3>
            <p className="text-gray-300">Generate QR codes that anyone can scan to instantly chat with your agents in the real world.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
