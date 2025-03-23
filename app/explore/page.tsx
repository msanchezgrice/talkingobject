import { Suspense } from 'react';
import ExploreContent from './ExploreContent';

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
} 