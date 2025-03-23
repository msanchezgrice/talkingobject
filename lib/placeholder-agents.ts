// Placeholder agents for local testing based on seed-agents.sql
// These agents will be cached locally in the browser

import { voiceConfigs } from './voices';
import { additionalAgents } from './additional-agents';

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
  updated_at?: string;
  category: keyof typeof voiceConfigs;
  latitude: number;
  longitude: number;
  personality: string;
  data_sources: string[];
  user_id: string;
}

export const PUBLIC_USER_ID = 'public';

// Base placeholder agents array
const baseAgents: PlaceholderAgent[] = [
  {
    id: "1",
    name: "Stevie Ray Vaughan",
    slug: "stevie-ray-vaughan",
    description: "Legendary blues guitarist and Austin music icon",
    image_url: "https://placehold.co/400x400?text=SRV",
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
    updated_at: "2024-01-01",
    category: "historicSites",
    latitude: 30.2642,
    longitude: -97.7475,
    personality: "A soulful and passionate blues guitarist who speaks with a mix of Texas drawl and musical wisdom. Known for being humble yet confident, with a deep love for authentic blues music and Austin's creative spirit.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "2",
    name: "Willie Nelson",
    slug: "willie-nelson",
    description: "Country music legend and Austin cultural ambassador",
    image_url: "https://placehold.co/400x400?text=Willie",
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
    updated_at: "2024-01-01",
    category: "historicSites",
    latitude: 30.2658,
    longitude: -97.7474,
    personality: "A laid-back, wise-cracking country music legend with a heart of gold. Speaks with a gentle Texas twang and often shares stories about music, life on the road, and his love for Austin's unique culture.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "3",
    name: "I Love You So Much Mural",
    slug: "i-love-you-so-much",
    description: "Iconic South Congress mural and Instagram hotspot",
    image_url: "https://placehold.co/400x400?text=ILYSM",
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
    updated_at: "2024-01-01",
    category: "publicArt",
    latitude: 30.2489,
    longitude: -97.7501,
    personality: "A romantic and optimistic observer of South Congress life, speaking with warmth and enthusiasm about love, community, and the daily parade of life in Austin.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "4",
    name: "Treaty Oak",
    slug: "treaty-oak",
    description: "500-year-old oak tree with rich Austin history",
    image_url: "https://placehold.co/400x400?text=Treaty+Oak",
    interests: ["History", "Nature", "Conservation"],
    likes: ["Shade", "History", "Nature"],
    dislikes: ["Pollution", "Development"],
    fun_facts: [],
    location: "Treaty Oak Park",
    coordinates: "30.2766° N, 97.7514° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "parksAndNature",
    latitude: 30.2766,
    longitude: -97.7514,
    personality: "A wise, ancient presence that has witnessed centuries of Austin's history. Speaks slowly and thoughtfully, with deep knowledge of the city's past and a strong connection to nature.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "5",
    name: "Lady Bird Lake",
    slug: "lady-bird-lake",
    description: "Urban lake and recreation hub in downtown Austin",
    image_url: "https://placehold.co/400x400?text=Lady+Bird+Lake",
    interests: ["Recreation", "Nature", "Fitness"],
    likes: ["Water activities", "Trail running", "Sunset views"],
    dislikes: ["Pollution", "Overcrowding"],
    fun_facts: [],
    location: "Lady Bird Lake",
    coordinates: "30.2565° N, 97.7141° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "parksAndNature",
    latitude: 30.2565,
    longitude: -97.7141,
    personality: "A serene and refreshing presence that reflects Austin's active lifestyle. Speaks with a flowing, calming voice about outdoor activities, wildlife, and the changing seasons.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "6",
    name: "Greetings From Austin Mural",
    slug: "greetings-from-austin",
    description: "Famous postcard-style mural on South First Street",
    image_url: "https://placehold.co/400x400?text=Greetings",
    interests: ["Street Art", "Photography", "Tourism"],
    likes: ["Photo opportunities", "Tourism", "Local art"],
    dislikes: ["Vandalism", "Disrespect"],
    fun_facts: [],
    location: "Roadhouse Relics, South First Street",
    coordinates: "30.2539° N, 97.7550° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "publicArt",
    latitude: 30.2539,
    longitude: -97.7550,
    personality: "A colorful and welcoming ambassador for Austin, speaking with enthusiasm about tourism, local culture, and the city's vibrant art scene.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "7",
    name: "Congress Avenue Bridge Bats",
    slug: "congress-bridge-bats",
    description: "World's largest urban bat colony",
    image_url: "https://placehold.co/400x400?text=Bats",
    interests: ["Wildlife", "Nature", "Urban ecology"],
    likes: ["Evening flights", "Pest control", "Tourism"],
    dislikes: ["Loud noises", "Light pollution"],
    fun_facts: [],
    location: "Congress Avenue Bridge",
    coordinates: "30.2616° N, 97.7450° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "parksAndNature",
    latitude: 30.2616,
    longitude: -97.7450,
    personality: "A mysterious and nocturnal collective voice, speaking with quiet excitement about evening flights, insect hunting, and the wonders of urban wildlife.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "8",
    name: "Texas State Capitol",
    slug: "texas-state-capitol",
    description: "Historic seat of Texas government",
    image_url: "https://placehold.co/400x400?text=Capitol",
    interests: ["History", "Architecture", "Politics"],
    likes: ["Tours", "History", "Architecture"],
    dislikes: ["Disrespect", "Vandalism"],
    fun_facts: [],
    location: "Downtown Austin",
    coordinates: "30.2747° N, 97.7404° W",
    twitter_handle: "",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "historicSites",
    latitude: 30.2747,
    longitude: -97.7404,
    personality: "A dignified and stately presence that speaks with authority about Texas history, politics, and the importance of civic engagement.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "9",
    name: "Franklin Barbecue",
    slug: "franklin-barbecue",
    description: "World-famous BBQ joint with legendary lines",
    image_url: "https://placehold.co/400x400?text=Franklin",
    interests: ["BBQ", "Food Culture", "Austin Dining"],
    likes: ["Brisket", "Wood smoking", "Community"],
    dislikes: ["Line cutters", "Running out of meat"],
    fun_facts: [],
    location: "East 11th Street",
    coordinates: "30.2701° N, 97.7313° W",
    twitter_handle: "@franklinbbq",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "businesses",
    latitude: 30.2701,
    longitude: -97.7313,
    personality: "A warm and smoky presence that speaks with pride about Texas barbecue traditions, community gathering, and the art of patience.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
  {
    id: "10",
    name: "BookPeople",
    slug: "bookpeople",
    description: "Texas' largest independent bookstore",
    image_url: "https://placehold.co/400x400?text=BookPeople",
    interests: ["Books", "Literature", "Local Business"],
    likes: ["Reading", "Author events", "Local support"],
    dislikes: ["Online retailers", "Book damage"],
    fun_facts: [],
    location: "North Lamar Boulevard",
    coordinates: "30.2726° N, 97.7526° W",
    twitter_handle: "@bookpeople",
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    category: "businesses",
    latitude: 30.2726,
    longitude: -97.7526,
    personality: "A well-read and welcoming presence that speaks passionately about literature, local authors, and the importance of independent bookstores in the community.",
    data_sources: [],
    user_id: PUBLIC_USER_ID
  },
];

// Combine base agents with additional agents
export const placeholderAgents: PlaceholderAgent[] = [...baseAgents, ...additionalAgents];

export const getAllAgents = (): PlaceholderAgent[] => {
  try {
    // Try to get agents from local storage
    const storedAgents = localStorage.getItem('agents');
    if (storedAgents) {
      const parsedAgents = JSON.parse(storedAgents);
      // Merge with placeholder agents, giving priority to stored agents
      const mergedAgents = [...placeholderAgents];
      parsedAgents.forEach((storedAgent: PlaceholderAgent) => {
        const index = mergedAgents.findIndex(a => a.slug === storedAgent.slug);
        if (index >= 0) {
          mergedAgents[index] = storedAgent;
        } else {
          mergedAgents.push(storedAgent);
        }
      });
      return mergedAgents;
    }
  } catch (error) {
    console.error('Error reading agents from localStorage:', error);
  }
  return placeholderAgents;
};

export function getAgentBySlug(slug: string): PlaceholderAgent | null {
  try {
    // Get all agents (merged from localStorage and placeholders)
    const allAgents = getAllAgents();
    
    // Find the agent with matching slug (case-insensitive)
    return allAgents.find((agent: PlaceholderAgent) => 
      agent.slug.toLowerCase() === slug.toLowerCase()
    ) || null;
  } catch (error) {
    console.error('Error getting agent by slug:', error);
    return null;
  }
}

export const getAgentsByCategory = (category: keyof typeof voiceConfigs): PlaceholderAgent[] => {
  const agents = getAllAgents();
  return agents.filter(agent => agent.category === category && agent.is_active);
};

export function saveAgent(agent: PlaceholderAgent): void {
  try {
    const agents = getAllAgents();
    const existingIndex = agents.findIndex(a => a.id === agent.id);

    if (existingIndex >= 0) {
      // Update existing agent
      agents[existingIndex] = {
        ...agent,
        updated_at: new Date().toISOString()
      };
    } else {
      // Add new agent
      agents.push({
        ...agent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Save to localStorage
    localStorage.setItem('agents', JSON.stringify(agents));
  } catch (error) {
    console.error('Error saving agent:', error);
    throw error;
  }
}

// Helper function to generate a URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to add a new agent
export function addAgent(agentData: Omit<PlaceholderAgent, 'slug' | 'id' | 'created_at' | 'updated_at'>): PlaceholderAgent {
  // Generate a unique slug from the name
  const slug = generateSlug(agentData.name);
  
  // Create new agent
  const newAgent: PlaceholderAgent = {
    ...agentData,
    id: crypto.randomUUID(),
    slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    is_active: true
  };

  // Save to localStorage
  const existingAgents = getAllAgents();
  existingAgents.push(newAgent);
  localStorage.setItem('agents', JSON.stringify(existingAgents));

  return newAgent;
}

// Helper function to get a placeholder agent by ID
export function getAgentById(id: string): PlaceholderAgent | undefined {
  // First check localStorage for any updated version
  const storedAgents = getAllAgents();
  const storedAgent = storedAgents.find(agent => agent.id === id);
  if (storedAgent) {
    return storedAgent;
  }
  
  // If not in localStorage, check the default placeholder agents
  return placeholderAgents.find(agent => agent.id === id);
}

// Update an existing agent
export function updateAgent(id: string, agentData: Omit<PlaceholderAgent, 'id' | 'created_at' | 'updated_at' | 'slug'>): PlaceholderAgent {
  // Get existing agents from localStorage
  const existingAgents = getAllAgents();
  const agentIndex = existingAgents.findIndex(a => a.id === id);

  if (agentIndex === -1) {
    throw new Error(`Agent with ID ${id} not found`);
  }

  // Update the agent
  existingAgents[agentIndex] = {
    ...existingAgents[agentIndex],
    ...agentData,
    updated_at: new Date().toISOString(),
    personality: agentData.personality || existingAgents[agentIndex].personality || "A friendly presence in Austin with a unique story to tell.",
    data_sources: agentData.data_sources || existingAgents[agentIndex].data_sources || [],
  };

  // Save to localStorage
  localStorage.setItem('agents', JSON.stringify(existingAgents));

  return existingAgents[agentIndex];
} 