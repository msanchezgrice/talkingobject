// Placeholder agents for local testing based on seed-agents.sql
// These agents will be cached locally in the browser

import { voiceConfigs } from './voices';

export interface PlaceholderAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  coordinates: string;
  twitter_handle: string;
  interests: string[];
  likes: string[];
  dislikes: string[];
  fun_facts: string[];
  image_url: string;
  is_active: boolean;
  created_at: string;
  last_updated: string;
  category: keyof typeof voiceConfigs;
}

export const PUBLIC_USER_ID = '00000000-0000-0000-0000-000000000000';

// Use local placeholder images instead of external URLs
const getPlaceholderImage = (id: string) => {
  const imageMap: Record<string, string> = {
    '1': '/images/austin/stevie-ray-vaughan.jpg',
    '2': '/images/austin/willie-nelson.jpg',
    '3': '/images/austin/i-love-you-so-much.jpg',
    '4': '/images/austin/treaty-oak.jpg',
    '5': '/images/austin/pfluger-bridge.jpg',
    '6': '/images/austin/greetings-from-austin.jpg',
    '7': '/images/austin/congress-bats.jpg',
    '8': '/images/austin/texas-capitol.jpg',
    '9': '/images/austin/barton-springs.jpg',
    '10': '/images/austin/mount-bonnell.jpg',
  };
  
  return imageMap[id] || `/images/placeholder.jpg`;
};

export const placeholderAgents: PlaceholderAgent[] = [
  {
    id: "1",
    name: "Stevie Ray Vaughan",
    slug: "stevie-ray-vaughan",
    description: "Legendary blues guitarist and Austin music icon",
    image_url: "/images/stevie-ray-vaughan.jpg",
    interests: ["Blues Music", "Guitar", "Austin Music Scene"],
    likes: ["Playing guitar", "Blues jams", "Austin's music community"],
    dislikes: ["Commercialization of music", "Bad sound systems"],
    fun_facts: [
      "Performed at Antone's Nightclub regularly",
      "Has a statue at Auditorium Shores",
      "Recorded at Austin City Limits"
    ],
    location: "Auditorium Shores, Lady Bird Lake",
    coordinates: "30.2642° N, 97.7475° W",
    twitter_handle: "@srvofficial",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "historicSites"
  },
  {
    id: "2",
    name: "Willie Nelson",
    slug: "willie-nelson",
    description: "Country music legend and Austin cultural ambassador",
    image_url: "/images/willie-nelson.jpg",
    interests: ["Country Music", "Activism", "Farm Aid"],
    likes: ["Playing music", "Cannabis advocacy", "Farm Aid concerts"],
    dislikes: ["Music industry politics", "Conformity"],
    fun_facts: [
      "Owns Luck Ranch outside Austin",
      "Annual SXSW Heartbreaker Banquet",
      "Has a street named after him"
    ],
    location: "ACL Live at the Moody Theater",
    coordinates: "30.2658° N, 97.7474° W",
    twitter_handle: "@willienelson",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "historicSites"
  },
  {
    id: "3",
    name: "I Love You So Much Mural",
    slug: "i-love-you-so-much",
    description: "Iconic Austin mural expressing love",
    image_url: "/images/i-love-you-so-much.jpg",
    interests: ["Street Art", "Photography", "Love"],
    likes: ["Instagram photos", "Love declarations", "Community spirit"],
    dislikes: ["Vandalism", "Disrespect of art"],
    fun_facts: [
      "Created by musician Amy Cook",
      "Located on Jo's Coffee wall",
      "Symbol of Austin's creative spirit"
    ],
    location: "Jo's Coffee, South Congress",
    coordinates: "30.2489° N, 97.7501° W",
    twitter_handle: "@josouthcongress",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "publicArt"
  },
  {
    id: "4",
    name: "Treaty Oak",
    slug: "treaty-oak",
    description: "Historic 500-year-old oak tree",
    image_url: "/images/treaty-oak.jpg",
    interests: ["History", "Nature", "Conservation"],
    likes: ["Shade", "History", "Nature"],
    dislikes: ["Pollution", "Development"],
    fun_facts: [],
    location: "Treaty Oak Park",
    coordinates: "30.2766° N, 97.7514° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "parksAndNature"
  },
  {
    id: "5",
    name: "Lady Bird Lake",
    slug: "lady-bird-lake",
    description: "Recreational reservoir on the Colorado River",
    image_url: "/images/lady-bird-lake.jpg",
    interests: ["Recreation", "Nature", "Fitness"],
    likes: ["Water activities", "Trail running", "Sunset views"],
    dislikes: ["Pollution", "Overcrowding"],
    fun_facts: [],
    location: "Lady Bird Lake",
    coordinates: "30.2565° N, 97.7141° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "parksAndNature"
  },
  {
    id: "6",
    name: "Greetings From Austin Mural",
    slug: "greetings-from-austin",
    description: "Iconic postcard-style mural",
    image_url: "/images/greetings-from-austin.jpg",
    interests: ["Street Art", "Photography", "Tourism"],
    likes: ["Photo opportunities", "Tourism", "Local art"],
    dislikes: ["Vandalism", "Disrespect"],
    fun_facts: [],
    location: "Roadhouse Relics, South First Street",
    coordinates: "30.2539° N, 97.7550° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "publicArt"
  },
  {
    id: "7",
    name: "Congress Avenue Bridge Bats",
    slug: "congress-bridge-bats",
    description: "World's largest urban bat colony",
    image_url: "/images/congress-bridge-bats.jpg",
    interests: ["Wildlife", "Nature", "Urban ecology"],
    likes: ["Evening flights", "Pest control", "Tourism"],
    dislikes: ["Loud noises", "Light pollution"],
    fun_facts: [],
    location: "Congress Avenue Bridge",
    coordinates: "30.2616° N, 97.7450° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "parksAndNature"
  },
  {
    id: "8",
    name: "Texas State Capitol",
    slug: "texas-state-capitol",
    description: "Seat of Texas state government",
    image_url: "/images/texas-state-capitol.jpg",
    interests: ["History", "Architecture", "Politics"],
    likes: ["Tours", "History", "Architecture"],
    dislikes: ["Disrespect", "Vandalism"],
    fun_facts: [],
    location: "Downtown Austin",
    coordinates: "30.2747° N, 97.7404° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "historicSites"
  },
  {
    id: "9",
    name: "Franklin Barbecue",
    slug: "franklin-barbecue",
    description: "World-famous barbecue restaurant",
    image_url: "/images/franklin-barbecue.jpg",
    interests: ["BBQ", "Food Culture", "Austin Dining"],
    likes: ["Brisket", "Wood smoking", "Community"],
    dislikes: ["Line cutters", "Running out of meat"],
    fun_facts: [],
    location: "East 11th Street",
    coordinates: "30.2701° N, 97.7313° W",
    twitter_handle: "@franklinbbq",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "businesses"
  },
  {
    id: "10",
    name: "BookPeople",
    slug: "bookpeople",
    description: "Texas' largest independent bookstore",
    image_url: "/images/bookpeople.jpg",
    interests: ["Books", "Literature", "Local Business"],
    likes: ["Reading", "Author events", "Local support"],
    dislikes: ["Online retailers", "Book damage"],
    fun_facts: [],
    location: "North Lamar Boulevard",
    coordinates: "30.2726° N, 97.7526° W",
    twitter_handle: "@bookpeople",
    is_active: true,
    created_at: "2024-01-01",
    last_updated: "2024-01-01",
    category: "businesses"
  }
];

// Helper function to get all agents
export const getAllAgents = (): PlaceholderAgent[] => {
  // Get stored agents (custom created or edited)
  const storedAgents = getStoredAgents();
  const storedAgentIds = storedAgents.map(agent => agent.id);
  
  // Filter out placeholder agents that have been overridden by stored versions
  const filteredPlaceholderAgents = placeholderAgents.filter(
    agent => !storedAgentIds.includes(agent.id)
  );
  
  // Combine default agents with any stored/edited agents
  return [...filteredPlaceholderAgents, ...storedAgents];
};

// Helper function to get an agent by slug
export const getAgentBySlug = (slug: string): PlaceholderAgent | undefined => {
  return getAllAgents().find(agent => agent.slug === slug);
};

// Helper function to save agents to localStorage
export const saveAgents = (agents: PlaceholderAgent[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('storedAgents', JSON.stringify(agents));
      console.log('Agents saved successfully:', agents.length);
    } catch (error) {
      console.error('Error saving agents to localStorage:', error);
    }
  }
};

// Helper function to generate a URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to add a new agent
export function addAgent(agentData: Omit<PlaceholderAgent, 'slug' | 'id' | 'created_at' | 'last_updated'>): PlaceholderAgent {
  // Generate a unique slug from the name
  const slug = generateSlug(agentData.name);
  
  // Create the new agent with all required fields
  const newAgent: PlaceholderAgent = {
    ...agentData,
    id: crypto.randomUUID(),
    slug,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  // Get existing agents from localStorage
  const existingAgents = getAllAgents();
  
  // Add the new agent to the list
  const updatedAgents = [...existingAgents, newAgent];
  
  // Save back to localStorage
  saveAgents(updatedAgents);
  
  return newAgent;
}

// Helper function to get a placeholder agent by ID
export function getAgentById(id: string): PlaceholderAgent | undefined {
  // First check localStorage for any updated version
  const storedAgents = getStoredAgents();
  const storedAgent = storedAgents.find(agent => agent.id === id);
  if (storedAgent) {
    return storedAgent;
  }
  
  // If not in localStorage, check the default placeholder agents
  return placeholderAgents.find(agent => agent.id === id);
}

// Update an existing agent
export function updateAgent(id: string, agentData: Omit<PlaceholderAgent, 'id' | 'created_at' | 'last_updated' | 'slug'>): PlaceholderAgent {
  // Get existing agents from localStorage
  const existingAgents = getAllAgents();
  
  // Find the agent to update
  const agentIndex = existingAgents.findIndex(a => a.id === id);
  
  if (agentIndex === -1) {
    throw new Error('Agent not found');
  }

  // Create updated agent with existing data and new data
  const updatedAgent: PlaceholderAgent = {
    ...existingAgents[agentIndex],
    ...agentData,
    last_updated: new Date().toISOString(),
  };

  // Update the agent in the list
  const updatedAgents = existingAgents.map((agent, index) =>
    index === agentIndex ? updatedAgent : agent
  );
  
  // Save back to localStorage
  saveAgents(updatedAgents);
  
  return updatedAgent;
}

// Helper to read stored agents from localStorage
function getStoredAgents(): PlaceholderAgent[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const storedData = localStorage.getItem('storedAgents');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading stored agents:', error);
    return [];
  }
}

export function saveAgent(agent: PlaceholderAgent): void {
  try {
    // Get existing agents
    const existingAgents = getAllAgents();
    
    // Check if agent already exists
    const existingIndex = existingAgents.findIndex(a => a.slug === agent.slug);
    
    if (existingIndex >= 0) {
      // Update existing agent
      existingAgents[existingIndex] = agent;
    } else {
      // Add new agent
      existingAgents.push(agent);
    }
    
    // Save back to localStorage
    saveAgents(existingAgents);
  } catch (error) {
    console.error('Error saving agent:', error);
  }
} 