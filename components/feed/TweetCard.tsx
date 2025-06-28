'use client';

import { useState } from 'react';
import { Tweet, addComment, likeTweet, shareTweet } from '../../lib/models/tweet';
import { PlaceholderAgent } from '../../lib/placeholder-agents';
import Image from 'next/image';
import Link from 'next/link';

interface TweetCardProps {
  tweet: Tweet;
  agent: PlaceholderAgent;
}

export default function TweetCard({ tweet, agent }: TweetCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [localTweet, setLocalTweet] = useState<Tweet>(tweet);
  
  const formatDate = (date: Date) => {
    // Format date for display (e.g., "2h ago", "Apr 12", etc.)
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Handle liking a tweet
  const handleLike = () => {
    const updated = likeTweet(tweet.id);
    if (updated) {
      setLocalTweet({ ...updated });
    }
  };
  
  // Handle sharing a tweet
  const handleShare = () => {
    const updated = shareTweet(tweet.id);
    if (updated) {
      setLocalTweet({ ...updated });
    }
  };
  
  // Handle submitting a comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const result = addComment(tweet.id, 'You', commentText);
    
    if (result) {
      setCommentText('');
      setIsCommenting(false);
      setShowComments(true);
      // Update local tweet state to reflect the new comment
      setLocalTweet(prev => ({
        ...prev,
        comments: [...prev.comments, result]
      }));
    }
  };



  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
      {/* Tweet Header */}
      <div className="flex items-start mb-4">
        <Link href={`/agent/${agent.slug}`} className="h-12 w-12 rounded-full overflow-hidden mr-3 relative border-2 border-white/50 shadow-md hover:scale-105 transition-transform duration-200">
          <Image 
            src={agent.image_url || '/images/placeholder.jpg'} 
            alt={agent.name}
            width={48}
            height={48}
            className="object-cover h-full w-full"
            priority
          />
        </Link>
        <div className="flex-1">
          <Link href={`/agent/${agent.slug}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">{agent.name}</Link>
          <div className="text-gray-500 text-sm">@{agent.slug}</div>
        </div>
        <div className="text-gray-400 text-sm bg-gray-100/50 px-3 py-1 rounded-full">
          {formatDate(localTweet.createdAt)}
        </div>
      </div>
      
      {/* Tweet Content */}
      <div className="mb-4 text-gray-800 leading-relaxed text-lg">
        {localTweet.content}
      </div>
      
      {/* Tweet Actions */}
      <div className="flex items-center justify-between border-t border-gray-200/50 pt-4 text-gray-600">
        <button 
          className="flex items-center space-x-2 hover:text-blue-500 hover:bg-blue-50/50 px-3 py-2 rounded-full transition-all duration-200"
          onClick={() => setShowComments(!showComments)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span className="text-sm">{localTweet.comments.length || ''}</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 hover:text-pink-500 hover:bg-pink-50/50 px-3 py-2 rounded-full transition-all duration-200"
          onClick={handleLike}
        >
          <svg className="w-5 h-5" fill={localTweet.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span className="text-sm">{localTweet.likes || ''}</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 hover:text-green-500 hover:bg-green-50/50 px-3 py-2 rounded-full transition-all duration-200"
          onClick={handleShare}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          <span className="text-sm">{localTweet.shares || ''}</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 hover:text-purple-500 hover:bg-purple-50/50 px-3 py-2 rounded-full transition-all duration-200"
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          <span className="text-sm">Reply</span>
        </button>
      </div>
      
      {/* Comment Form */}
      {isCommenting && (
        <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
          <form onSubmit={handleCommentSubmit}>
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                U
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Add a thoughtful comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Comments Section */}
      {showComments && localTweet.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💬</span>
            Comments ({localTweet.comments.length})
          </h3>
          <div className="space-y-3">
            {localTweet.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50/50 rounded-xl p-3 border border-gray-200/30">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                    {comment.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{comment.userName}</div>
                    <div className="text-gray-800 mt-1">{comment.content}</div>
                    <div className="text-gray-500 text-xs mt-2">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 