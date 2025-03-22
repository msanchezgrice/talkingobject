import { PlaceholderAgent } from '../placeholder-agents';

export interface Tweet {
  id: string;
  agentId: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  shares: number;
}

export interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: Date;
}

// Initialize tweets array with empty arrays for comments
let tweets: Tweet[] = [];

// Get all tweets
export function getAllTweets(): Tweet[] {
  return tweets;
}

// Add a new tweet
export function addTweet({ agentId, content }: { agentId: string; content: string }): Tweet {
  const newTweet: Tweet = {
    id: Math.random().toString(36).substring(2, 15),
    agentId,
    content,
    createdAt: new Date(),
    likes: 0,
    comments: [],
    shares: 0
  };
  
  tweets.push(newTweet);
  return newTweet;
}

// Get tweets for a specific agent
export function getTweetsByAgent(agentId: string): Tweet[] {
  return tweets
    .filter(tweet => tweet.agentId === agentId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Add a comment to a tweet
export function addComment(tweetId: string, userName: string, content: string): Comment {
  const tweet = tweets.find(t => t.id === tweetId);
  if (!tweet) {
    throw new Error('Tweet not found');
  }
  
  const newComment: Comment = {
    id: Math.random().toString(36).substring(2, 15),
    userName,
    content,
    createdAt: new Date()
  };
  
  tweet.comments.push(newComment);
  return newComment;
}

// Like a tweet
export function likeTweet(tweetId: string): void {
  const tweet = tweets.find(t => t.id === tweetId);
  if (tweet) {
    tweet.likes += 1;
  }
}

// Share a tweet
export function shareTweet(tweetId: string): void {
  const tweet = tweets.find(t => t.id === tweetId);
  if (tweet) {
    tweet.shares += 1;
  }
}

// Map of prompts for generating tweets for each agent type
const agentTweetPrompts: Record<string, string[]> = {
  'Stevie Ray Vaughan Statue': [
    "The blues is flowin' through downtown today. Watching musicians carry on the tradition.",
    "Tourists taking photos with me today. Wish I could play a lick for them.",
    "Overheard some amazing guitar playing at the lake today. SRV would be proud.",
    "The sunset over Lady Bird Lake tonight reminds me of a slow Texas blues.",
    "Rain or shine, the music in Austin never stops. Can hear festival sounds in the distance."
  ],
  'Willie Nelson Statue': [
    "On the road again, well, at least watching everyone else on the road today.",
    "Heard someone playing 'Always On My Mind' nearby. Still gets me every time.",
    "Red Headed Stranger would love the sunset tonight. Pure Texas beauty.",
    "Tourists stopping by today asking for photos. Always happy to share some Austin weirdness.",
    "Another beautiful day in the live music capital. The melody never stops in this town."
  ],
  'I Love You So Much Mural': [
    "Witnessed three proposals in front of me today. Love is in the air!",
    "The line for Jo's Coffee is ridiculous today. So much love, so much caffeine.",
    "Rain can't wash away love. Still standing proud on South Congress.",
    "Someone just told me they've got a replica of me in their living room. I'm flattered!",
    "Tourist season is in full swing. My wall is getting quite the workout from all the selfies."
  ],
  'Treaty Oak': [
    "Standing tall for another century. Austin has changed, but I remain.",
    "The breeze today is telling stories of old Austin. If only you could hear.",
    "My branches are home to so many birds today. Nature's symphony surrounds me.",
    "Survived poisoning, survived development. Just another day as Austin's oldest resident.",
    "Children playing in my shade today. This is what I live for."
  ],
  'Pfluger Pedestrian Bridge': [
    "So many runners today. The lake trail is buzzing with energy.",
    "Sunset views from my span are unmatched. Best seat in Austin tonight.",
    "Connecting people from all walks of life today. That's what bridges do.",
    "Proposals, first dates, and friendship walks. I've seen it all today.",
    "The bats are putting on quite a show tonight. Front row seats from my railings."
  ],
  'Greetings from Austin Mural': [
    "Thousands of selfies taken with me today. I'm Austin's most photographed wall!",
    "Someone just proposed in front of me! She said yes, and the crowd went wild.",
    "Rain today, but the colors still pop. Can't dim Austin's bright spirit.",
    "Tourist buses have been stopping by all day. Spreading the Austin love worldwide.",
    "Someone just told me they moved to Austin after seeing me on Instagram. I'm influential!"
  ],
  'Congress Avenue Bats': [
    "Getting ready for tonight's flight. The mosquitoes don't stand a chance.",
    "Tourists lining up on the bridge already. Our evening show is about to begin.",
    "Night flight was spectacular. Heard gasps from the crowds below.",
    "Migration season approaching. Getting ready for our annual journey.",
    "Baby bats learning to fly today. The next generation takes wing!"
  ],
  'Texas State Capitol': [
    "Standing tall in the Texas sun today. My dome is gleaming.",
    "Tourists exploring my grounds today. So many questions about Texas history.",
    "Overheard heated political debates in my chambers today. Democracy in action.",
    "School groups touring today. Teaching the next generation about government.",
    "My pink granite walls have seen it all. Another day in Texas politics."
  ],
  'Barton Springs Pool': [
    "68 degrees all year round. Perfect day for a dip!",
    "Salamanders spotted today! Our endangered friends are doing well.",
    "Full moon swim tonight. The water is magical under moonlight.",
    "Record crowds today. My cool waters are the perfect escape from the Texas heat.",
    "Early morning swimmers today. Nothing beats starting your day with a natural spring plunge."
  ],
  'Mount Bonnell': [
    "Sunset views were spectacular today. Couples enjoying the romantic atmosphere.",
    "Hikers climbing my steps all day. The view is worth the effort.",
    "Storm rolling in over the lake. The view from up here is dramatic today.",
    "Picnics and proposals today. My lookout point brings people together.",
    "Stars are brilliant tonight. Best stargazing spot in Austin."
  ]
};

// Generate a random tweet for an agent
export function generateTweetForAgent(agent: PlaceholderAgent): string {
  const prompts = agentTweetPrompts[agent.name] || [
    "Just another day in Austin!",
    "The weather is beautiful today.",
    "Tourists stopping by to say hello.",
    "Love being an Austin landmark!",
    "Feeling the weird Austin vibes today."
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Generate initial tweets for all agents
export function generateInitialTweets(agents: PlaceholderAgent[]): void {
  // Clear existing tweets
  tweets = [];
  
  // Generate tweets for the past week
  const now = new Date();
  
  agents.forEach(agent => {
    // Generate 1-3 tweets per agent with random dates in the last week
    const tweetCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < tweetCount; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      const tweetDate = new Date(now);
      tweetDate.setDate(tweetDate.getDate() - daysAgo);
      tweetDate.setHours(tweetDate.getHours() - hoursAgo);
      tweetDate.setMinutes(tweetDate.getMinutes() - minutesAgo);
      
      const newTweet: Tweet = {
        id: Math.random().toString(36).substring(2, 15),
        agentId: agent.id,
        content: generateTweetForAgent(agent),
        createdAt: tweetDate,
        likes: Math.floor(Math.random() * 50),
        comments: [],
        shares: Math.floor(Math.random() * 20)
      };
      
      tweets.push(newTweet);
    }
  });
} 