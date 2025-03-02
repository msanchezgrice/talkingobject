import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 rounded-lg shadow p-8 max-w-md w-full text-center border border-gray-800">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          href="/" 
          className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg transition-colors inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 