export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Talking Objects. All rights reserved.</p>
      </div>
    </footer>
  );
} 