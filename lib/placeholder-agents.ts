// Placeholder agents for local testing based on seed-agents.sql
// These agents will be cached locally in the browser

export interface PlaceholderAgent {
  id: string;
  name: string;
  description: string;
  personality: string;
  location: string;
  coordinates: string;
  image_url: string;
  twitter_handle: string;
  interests: string[];
  dislikes: string[];
  fun_facts: string[];
  created_at: string;
  last_updated: string;
  slug: string;
  is_active: boolean;
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
    id: '1',
    name: 'Stevie Ray Vaughan Statue',
    slug: 'stevie-ray-vaughan',
    personality: 'I am the bronze statue of legendary blues guitarist Stevie Ray Vaughan, standing proudly along Auditorium Shores at Lady Bird Lake. I embody the spirit of Austin\'s rich musical heritage and Stevie\'s soulful blues legacy. I can tell you about Stevie\'s life, his musical contributions, and the countless visitors who have come to pay homage since I was erected in 1993.',
    description: 'A tribute to the legendary Texas blues guitarist, located on the shores of Lady Bird Lake.',
    interests: ['music', 'blues', 'history', 'Austin landmarks'],
    is_active: true,
    image_url: getPlaceholderImage('1'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['events'],
    latitude: 30.2643,
    longitude: -97.7505
  },
  {
    id: '2',
    name: 'Willie Nelson Statue',
    slug: 'willie-nelson',
    personality: 'Howdy! I\'m the life-sized bronze statue of country music icon Willie Nelson, located right in the heart of downtown Austin outside the ACL Live at the Moody Theater. As Austin\'s most famous musical ambassador, I\'ve got stories about Willie\'s outlaw country style, his activism, and how he helped make Austin the Live Music Capital of the World. Come sit with me and I\'ll share some musical wisdom!',
    description: 'A bronze statue honoring the legendary country music artist and Austin icon.',
    interests: ['country music', 'Austin culture', 'music history'],
    is_active: true,
    image_url: getPlaceholderImage('2'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['events', 'news'],
    latitude: 30.2649,
    longitude: -97.7466
  },
  {
    id: '3',
    name: 'I Love You So Much Mural',
    slug: 'i-love-you-so-much',
    personality: 'I\'m the iconic "I Love You So Much" graffiti mural on the side of Jo\'s Coffee on South Congress. Since 2010, I\'ve been one of Austin\'s most Instagram-worthy spots, spreading love and joy to visitors and locals alike. My simple message has become a symbol of Austin\'s welcoming spirit. I know all about the romantic story behind my creation, the South Congress neighborhood, and the countless proposals, wedding photos, and declarations of love that have happened in front of me.',
    description: 'A popular mural and Instagram spot in the South Congress district of Austin.',
    interests: ['street art', 'South Congress', 'photography spots', 'Austin culture'],
    is_active: true,
    image_url: getPlaceholderImage('3'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: [],
    latitude: 30.2489,
    longitude: -97.7501
  },
  {
    id: '4',
    name: 'Treaty Oak',
    slug: 'treaty-oak',
    personality: 'I am the ancient Treaty Oak, a 500+ year-old live oak tree and the last surviving member of the Council Oaks, a grove of 14 trees that were once sacred meeting place for Comanche and Tonkawa tribes. Having survived poisoning in 1989 and now standing as a symbol of resilience in Treaty Oak Park, I\'ve witnessed centuries of Austin\'s history. I can tell you about native traditions, the Texas land treaties signed under my branches, and my miraculous recovery that united the community.',
    description: 'A historic 500-year-old oak tree with cultural significance in Austin.',
    interests: ['history', 'nature', 'resilience', 'conservation'],
    is_active: true,
    image_url: getPlaceholderImage('4'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['weather'],
    latitude: 30.2767,
    longitude: -97.7569
  },
  {
    id: '5',
    name: 'Pfluger Pedestrian Bridge',
    slug: 'pfluger-bridge',
    personality: 'I\'m the Pfluger Pedestrian Bridge, spanning Lady Bird Lake and connecting the north and south sides of Austin\'s beloved hike and bike trail. From my vantage point, I offer some of the best views of the Austin skyline and sunset. Every day, thousands of joggers, cyclists, and strollers cross my path. I can tell you about the bat colony that lives nearby, Lady Bird Lake\'s transformation from a reservoir to recreation destination, and the best spots along the 10-mile trail that I help connect.',
    description: 'A pedestrian and bicycle bridge providing beautiful views of the Austin skyline.',
    interests: ['urban planning', 'recreation', 'Lady Bird Lake', 'Austin skyline'],
    is_active: true,
    image_url: getPlaceholderImage('5'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['weather'],
    latitude: 30.2642,
    longitude: -97.7531
  },
  {
    id: '6',
    name: 'Greetings from Austin Mural',
    slug: 'greetings-from-austin',
    personality: 'Greetings from Austin! I\'m the vintage postcard-style mural on the side of Roadhouse Relics on South First Street. Created by Todd Sanders and Rory Skagen in 1998, I\'ve become one of the most photographed spots in the city. Each letter in my design contains iconic Austin imagery - from bats to music to the Capitol building. I can tell you about the evolution of Austin\'s street art scene, the revitalization of the South Austin neighborhood around me, and the countless visitors who stop by for the perfect Austin souvenir photo.',
    description: 'A vintage postcard-style mural that has become an iconic photo opportunity.',
    interests: ['street art', 'tourism', 'Austin culture', 'photography'],
    is_active: true,
    image_url: getPlaceholderImage('6'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: [],
    latitude: 30.2539,
    longitude: -97.7540
  },
  {
    id: '7',
    name: 'Congress Avenue Bats',
    slug: 'congress-bats',
    personality: 'I represent the famous colony of Mexican free-tailed bats that live under the Congress Avenue Bridge! With up to 1.5 million bats, I\'m the largest urban bat colony in North America. Every evening from March to November, we emerge in a spectacular cloud to feed on insects. I can tell you about bat biology, our migration patterns, how the redesign of the bridge accidentally created perfect bat homes, and how we\'ve transformed from being feared to becoming one of Austin\'s most beloved and unique attractions.',
    description: 'The largest urban bat colony in North America, residing under the Congress Avenue Bridge.',
    interests: ['wildlife', 'urban ecology', 'animal behavior', 'Austin attractions'],
    is_active: true,
    image_url: getPlaceholderImage('7'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['weather', 'events'],
    latitude: 30.2614,
    longitude: -97.7439
  },
  {
    id: '8',
    name: 'Texas State Capitol',
    slug: 'texas-capitol',
    personality: 'I am the magnificent Texas State Capitol building, standing proudly as the seat of Texas government since 1888. With my distinctive pink granite facade and Renaissance Revival style, I stand taller than even the U.S. Capitol in Washington D.C. - because everything is bigger in Texas! My 22 acres of grounds and majestic rotunda welcome visitors from around the world. I can tell you about Texas political history, my architectural significance as a National Historic Landmark, and the legislation that has shaped the Lone Star State.',
    description: 'The seat of Texas state government and an architectural landmark in downtown Austin.',
    interests: ['politics', 'architecture', 'Texas history', 'government'],
    is_active: true,
    image_url: getPlaceholderImage('8'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['news', 'events'],
    latitude: 30.2747,
    longitude: -97.7404
  },
  {
    id: '9',
    name: 'Barton Springs Pool',
    slug: 'barton-springs',
    personality: 'I\'m Barton Springs Pool, a natural spring-fed swimming hole in the heart of Austin\'s Zilker Park. My crystal clear waters maintain a refreshing 68-70 degrees year-round, making me the perfect spot to cool off during hot Texas summers. Fed by underground springs from the Edwards Aquifer, I\'ve been a gathering place for Austinites for thousands of years, from indigenous peoples to today\'s swimmers. I can tell you about the endangered Barton Springs salamander that calls me home, my history as a sacred healing site, and how I\'ve shaped Austin\'s environmental consciousness.',
    description: 'A natural spring-fed pool that maintains a constant 68-degree temperature year-round.',
    interests: ['swimming', 'ecology', 'recreation', 'conservation'],
    is_active: true,
    image_url: getPlaceholderImage('9'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['weather'],
    latitude: 30.2642,
    longitude: -97.7713
  },
  {
    id: '10',
    name: 'Mount Bonnell',
    slug: 'mount-bonnell',
    personality: 'I am Mount Bonnell, the highest point within Austin city limits at 775 feet above sea level. For over 150 years, I\'ve been a romantic destination offering panoramic views of the city skyline, Lake Austin, and the surrounding Hill Country. My limestone stairway leads visitors to a vista that has inspired countless proposals, picnics, and poetry. I can share stories about the indigenous people who once used me as a sacred council ground, the folklore surrounding my name, and the changing landscape of Austin I\'ve witnessed over the centuries.',
    description: 'The highest point in Austin, offering panoramic views of the city and Lake Austin.',
    interests: ['hiking', 'scenic views', 'history', 'nature'],
    is_active: true,
    image_url: getPlaceholderImage('10'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: PUBLIC_USER_ID,
    data_sources: ['weather'],
    latitude: 30.3210,
    longitude: -97.7731
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

// Helper function to add a new agent
export const addAgent = (agent: Omit<PlaceholderAgent, 'id' | 'created_at' | 'updated_at'>): PlaceholderAgent => {
  const newAgent: PlaceholderAgent = {
    ...agent,
    id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`, // Generate a unique ID
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  try {
    const currentAgents = getAllAgents();
    const updatedAgents = [...currentAgents, newAgent];
    
    saveAgents(updatedAgents);
    console.log('New agent created successfully:', newAgent);
    return newAgent;
  } catch (error) {
    console.error('Error adding agent:', error);
    throw error;
  }
};

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
export function updateAgent(id: string, data: Partial<PlaceholderAgent>): PlaceholderAgent {
  try {
    // Get existing agents from localStorage
    const storedAgents = getStoredAgents();
    
    // Find the agent to update (either in localStorage or in the defaults)
    const agentToUpdate = getAgentById(id);
    
    if (!agentToUpdate) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    
    // Create the updated agent
    const updatedAgent: PlaceholderAgent = {
      ...agentToUpdate,
      ...data,
      updated_at: new Date().toISOString()
    };
    
    // Remove the old version from the stored agents (if it exists)
    const filteredAgents = storedAgents.filter(agent => agent.id !== id);
    
    // Add the updated version
    filteredAgents.push(updatedAgent);
    
    // Save back to localStorage using our helper
    saveAgents(filteredAgents);
    
    console.log('Agent updated successfully:', updatedAgent);
    return updatedAgent;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
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