import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Talking Objects</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Create Interactive AI Agents for the Real World
          </h2>
          <p className="text-xl mb-10">
            Design AI agents with unique personalities that interact with people through QR codes in the physical world.
            Connect your agents to live data sources like weather, news, and more.
          </p>

          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create Your Agent
            </Link>
            <Link 
              href="/explore" 
              className="border border-gray-300 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Agents
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Personalized Agents</h3>
            <p>Create custom AI agents with unique personalities, appearances, and knowledge bases.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Location Awareness</h3>
            <p>Anchor your agents to real-world locations to provide contextual information and experiences.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">QR Code Integration</h3>
            <p>Generate QR codes that anyone can scan to instantly chat with your agents in the real world.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Talking Objects. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
