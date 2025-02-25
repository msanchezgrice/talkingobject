export type Agent = {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  user_id: string;
  personality: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  data_sources: string[];
};

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export type DataSource = {
  id: string;
  name: string;
  api_key_name: string;
  description: string;
};

export type Conversation = {
  id: string;
  created_at: string;
  agent_id: string;
  user_id: string | null;
  session_id: string;
};

export type Message = {
  id: string;
  created_at: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
}; 