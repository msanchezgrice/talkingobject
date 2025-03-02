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
  const [isFollowing, setIsFollowing] = useState(false);
  
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
    
    const result = addComment(tweet.id, {
      userName: 'You',
      content: commentText
    });
    
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Here you would typically update a database or state management
    // For now we just toggle the local state
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Tweet Header */}
      <div className="flex items-start mb-3">
        <Link href={`/agent/${agent.slug}`} className="h-12 w-12 rounded-full overflow-hidden mr-3 relative border-2 border-gray-200">
          <Image 
            src={agent.image_url || '/images/placeholder.jpg'} 
            alt={agent.name}
            width={48}
            height={48}
            className="object-cover h-full w-full"
            priority
          />
        </Link>
        <div>
          <Link href={`/agent/${agent.slug}`} className="font-bold text-gray-900 hover:text-blue-600">{agent.name}</Link>
          <div className="text-gray-600 text-sm">@{agent.slug}</div>
        </div>
        <div className="ml-auto text-gray-600 text-sm">
          {formatDate(localTweet.createdAt)}
        </div>
      </div>
      
      {/* Tweet Content */}
      <div className="mb-3 text-gray-900 font-medium">
        {localTweet.content}
      </div>
      
      {/* Tweet Actions */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-2 mb-2 text-gray-700">
        <button 
          className="flex items-center hover:text-blue-500"
          onClick={() => setShowComments(!showComments)}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          {localTweet.comments.length > 0 ? localTweet.comments.length : ''}
        </button>
        
        <button 
          className="flex items-center hover:text-pink-500"
          onClick={handleLike}
        >
          <svg className="w-5 h-5 mr-1" fill={localTweet.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          {localTweet.likes > 0 ? localTweet.likes : ''}
        </button>
        
        <button 
          className="flex items-center hover:text-green-500"
          onClick={handleShare}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          {localTweet.shares > 0 ? localTweet.shares : ''}
        </button>
        
        <button 
          className="flex items-center hover:text-blue-500"
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          Comment
        </button>
        
        <button 
          className={`flex items-center ${isFollowing ? 'text-blue-600' : 'hover:text-blue-500'}`}
          onClick={handleFollow}
        >
          <svg className="w-5 h-5 mr-1" fill={isFollowing ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
      
      {/* Comment Form */}
      {isCommenting && (
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-gray-300">
              {/* User avatar placeholder */}
            </div>
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button 
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post
            </button>
          </div>
        </form>
      )}
      
      {/* Comments Section */}
      {showComments && localTweet.comments.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-2">
          <h3 className="font-bold text-gray-800 mb-2">Comments</h3>
          {localTweet.comments.map((comment) => (
            <div key={comment.id} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-gray-300">
                  {/* Commenter avatar placeholder */}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{comment.userName}</div>
                  <div className="text-gray-900">{comment.content}</div>
                  <div className="text-gray-600 text-xs mt-1">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 