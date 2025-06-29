import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-blue-400 transition-colors">Talking Objects</Link>
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <AuthForm />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Talking Objects. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 