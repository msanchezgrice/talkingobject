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
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-lg shadow p-8 text-center border">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view and manage your agents.
            </p>
            <Link 
              href="/sign-in" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Agents</h1>
            <p className="text-muted-foreground">
              Manage your AI agents and monitor their activity
            </p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/dashboard/map" 
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Link>
            <Link 
              href="/dashboard/create" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Create New Agent
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4" role="alert">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {agents.length === 0 ? (
          <div className="bg-card rounded-lg shadow p-8 mb-8 border text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your First Agent</h3>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t created any agents yet. Get started by creating your first AI agent that people can discover and interact with.
              </p>
              <Link 
                href="/dashboard/create"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-muted-foreground">
                {agents.length} agent{agents.length !== 1 ? 's' : ''} created
              </p>
              <button 
                onClick={refreshAgents}
                className="mt-2 text-primary hover:text-primary/80 font-medium"
              >
                Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 