import { PlaceholderAgent } from '../placeholder-agents';
import { addTweet, generateTweetForAgent } from '../models/tweet';

// Service to handle scheduling and generating tweets

// Cache to track when the last tweet was posted for each agent
const lastTweetTime: Record<string, Date> = {};

// Check if a tweet should be generated for an agent based on the time passed
export function shouldGenerateTweet(agent: PlaceholderAgent): boolean {
  const now = new Date();
  const lastTime = lastTweetTime[agent.id];
  
  // If no tweet has been generated for this agent, or it's been more than a day
  if (!lastTime) return true;
  
  const timeDiff = now.getTime() - lastTime.getTime();
  const hoursPassed = timeDiff / (1000 * 60 * 60);
  
  // For development/demo purposes, generate a new tweet after 3 hours
  // In production, this would be set to 24 hours
  return hoursPassed >= 3;
}

// Generate a new tweet for an agent if needed
export function generateTweetIfNeeded(agent: PlaceholderAgent): void {
  if (shouldGenerateTweet(agent)) {
    const content = generateTweetForAgent(agent);
    addTweet({ agentId: agent.id, content });
    lastTweetTime[agent.id] = new Date();
  }
}

// Generate tweets for all agents if needed
export function generateTweetsForAllAgents(agents: PlaceholderAgent[]): void {
  agents.forEach(agent => {
    generateTweetIfNeeded(agent);
  });
}

// Simulate tweet schedule for demo purposes
// In a real app, this would be handled by a cron job or similar
export function simulateTweetSchedule(agents: PlaceholderAgent[]): void {
  // Set random last tweet times to stagger initial tweets
  agents.forEach(agent => {
    const hoursAgo = Math.floor(Math.random() * 6); // 0-6 hours ago
    const lastTime = new Date();
    lastTime.setHours(lastTime.getHours() - hoursAgo);
    lastTweetTime[agent.id] = lastTime;
  });
} 