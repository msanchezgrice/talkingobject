'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { AgentCard } from "@/components/dashboard/AgentCard";
import { getClerkUserAgents, ClerkDatabaseAgent } from "@/lib/database/clerk-agents";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [agents, setAgents] = useState<ClerkDatabaseAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUserAgents = async () => {
      if (!isLoaded) return; // Wait for Clerk to load
      
      try {
        if (!isSignedIn || !user) {
          setError('Please sign in to view your agents');
          setIsLoading(false);
          return;
        }

        // Get user's agents using Clerk user ID
        const userAgents = await getClerkUserAgents(user.id);
        setAgents(userAgents);
        
      } catch (err) {
        console.error('Error loading user agents:', err);
        setError('Failed to load your agents');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAgents();
  }, [isLoaded, isSignedIn, user]);

  const refreshAgents = async () => {
    if (user) {
      try {
        const userAgents = await getClerkUserAgents(user.id);
        setAgents(userAgents);
      } catch (err) {
        console.error('Error refreshing agents:', err);
        setError('Failed to refresh agents');
      }
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-purple-600 animate-spin animate-reverse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-white/20 max-w-md mx-auto mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view and manage your agents.
            </p>
            <Link 
              href="/sign-in" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Your Agents</h1>
            <p className="text-gray-600 text-lg">
              Manage your AI agents and monitor their activity
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/dashboard/map" 
              className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 text-gray-800 font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:bg-white/80 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Link>
            <Link 
              href="/dashboard/create" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              Create New Agent
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/70 backdrop-blur-sm border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-6 shadow-lg" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {agents.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Create Your First Agent</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You haven&apos;t created any agents yet. Get started by creating your first AI agent that people can discover and interact with.
              </p>
              <Link 
                href="/dashboard/create"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Agent
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onUpdate={refreshAgents} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-md inline-block">
                <p className="text-gray-600 mb-2">
                  {agents.length} agent{agents.length !== 1 ? 's' : ''} created
                </p>
                <button 
                  onClick={refreshAgents}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center mx-auto"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 