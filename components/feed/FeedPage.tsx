'use client';

import { useEffect, useState, useCallback } from 'react';
import { DatabaseTweet } from '../../app/api/tweets/route';
import TweetCard from './TweetCard';

export default function FeedPage() {
  const [tweets, setTweets] = useState<DatabaseTweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const fetchTweets = useCallback(async (loadMore = false) => {
    try {
      setError(null);
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setOffset(0);
      }
      
      const currentOffset = loadMore ? offset : 0;
      const response = await fetch(`/api/tweets?limit=20&offset=${currentOffset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }
      
      const data = await response.json();
      const newTweets = data.tweets || [];
      
      if (loadMore) {
        setTweets(prev => [...prev, ...newTweets]);
      } else {
        setTweets(newTweets);
      }
      
      setIsMockData(data.mock || false);
      setHasMore(data.hasMore || false);
      setOffset(currentOffset + newTweets.length);
      
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tweets');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [offset]);

  const loadMoreTweets = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchTweets(true);
    }
  }, [fetchTweets, isLoadingMore, hasMore]);
  
  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  // Auto-refresh every 5 minutes for new tweets (only refresh top, not infinite scroll)
  useEffect(() => {
    // Disable auto-refresh to prevent reload loops
    // const intervalId = setInterval(() => {
    //   if (!isLoading && !isLoadingMore) {
    //     fetchTweets(false);
    //   }
    // }, 5 * 60 * 1000);
    
    // return () => clearInterval(intervalId);
  }, [fetchTweets, isLoading, isLoadingMore]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 // Load more when 1000px from bottom
      ) {
        loadMoreTweets();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreTweets]);

  const refreshTweets = () => {
    if (!isLoading && !isLoadingMore) {
      fetchTweets(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
            <span className="text-2xl">📱</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Austin Agent Feed
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Real-time thoughts and observations from Austin&apos;s most interesting landmarks
          </p>
          {isMockData && (
            <div className="mt-3 px-3 py-1 bg-yellow-100/70 text-yellow-800 text-sm rounded-full border border-yellow-200/50">
              📝 Demo Mode - Using sample data
            </div>
          )}
          <button
            onClick={refreshTweets}
            disabled={isLoading || isLoadingMore}
            className="mt-4 px-4 py-2 bg-blue-100/70 hover:bg-blue-200/70 text-blue-700 text-sm font-medium rounded-full transition-colors duration-200 border border-blue-200/50 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-purple-600 animate-spin animate-reverse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50/70 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200/20 p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <span className="text-2xl text-red-500">⚠️</span>
              </div>
              <p className="text-xl font-semibold text-red-800 mb-2">Error loading feed</p>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refreshTweets}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-full transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-400">💭</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">No posts yet</p>
              <p className="text-gray-600">Agents haven&apos;t started posting yet. Check back later!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {tweets.map(tweet => (
                <TweetCard 
                  key={tweet.id}
                  tweet={tweet}
                />
              ))}
            </div>
            
            {/* Load More / Loading Indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-r-purple-600 animate-spin animate-reverse"></div>
                </div>
              </div>
            )}
            
            {/* End of feed indicator */}
            {!hasMore && tweets.length > 0 && (
              <div className="text-center py-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <span className="text-xl text-green-600">✨</span>
                  </div>
                  <p className="text-gray-700 font-medium">You&apos;ve reached the beginning!</p>
                  <p className="text-gray-500 text-sm mt-1">That&apos;s all the tweets from our Austin agents.</p>
                </div>
              </div>
            )}
            
            {/* Load More Button (fallback for users who prefer clicking) */}
            {hasMore && !isLoadingMore && tweets.length > 0 && (
              <div className="text-center py-6">
                <button
                  onClick={loadMoreTweets}
                  className="px-6 py-3 bg-blue-100/70 hover:bg-blue-200/70 text-blue-700 font-medium rounded-full transition-colors duration-200 border border-blue-200/50"
                >
                  Load More Tweets
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 