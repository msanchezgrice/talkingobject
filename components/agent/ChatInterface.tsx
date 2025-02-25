'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Agent, Message } from '@/lib/supabase/types';

type ChatInterfaceProps = {
  agent: Agent;
};

export default function ChatInterface({ agent }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Create a greeting message when the component mounts
  useEffect(() => {
    const createConversation = async () => {
      try {
        // Generate a session ID for anonymous users
        const sessionId = Math.random().toString(36).substring(2, 15);
        
        // Get user ID if logged in
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        
        // Create a new conversation
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            agent_id: agent.id,
            user_id: userId,
            session_id: sessionId
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setConversationId(data.id);
        
        // Add an initial greeting message
        await sendAgentMessage(`Hi there! I'm ${agent.name}. How can I help you today?`);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    };
    
    createConversation();
  }, [agent]);

  // Send a message to the agent
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !conversationId) return;
    
    try {
      setIsLoading(true);
      
      // Add the user message to the UI immediately
      const userMessage: Message = {
        id: Date.now().toString(), // Temporary ID
        created_at: new Date().toISOString(),
        conversation_id: conversationId,
        content: input,
        role: 'user'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Save the user message to the database
      const { error: saveError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: input,
          role: 'user'
        });
        
      if (saveError) throw saveError;
      
      // Call the API to get the agent's response
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: input,
          agentId: agent.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }
      
      const data = await response.json();
      
      // Add the agent's response to the UI
      await sendAgentMessage(data.message);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to send an agent message
  const sendAgentMessage = async (content: string) => {
    if (!conversationId) return;
    
    // Add the agent message to the UI
    const agentMessage: Message = {
      id: Date.now().toString(), // Temporary ID
      created_at: new Date().toISOString(),
      conversation_id: conversationId,
      content,
      role: 'assistant'
    };
    
    setMessages(prev => [...prev, agentMessage]);
    
    // Save the agent message to the database
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        role: 'assistant'
      });
  };

  // Load previous messages when the conversationId is set
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error loading messages:', error);
        return;
      }
      
      if (data) {
        setMessages(data as Message[]);
      }
    };
    
    loadMessages();
  }, [conversationId]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
          {agent.image_url ? (
            <img 
              src={agent.image_url} 
              alt={agent.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-bold text-xl">{agent.name}</h2>
          {agent.latitude && agent.longitude && (
            <p className="text-sm text-gray-600">
              Located at {agent.latitude.toFixed(6)}, {agent.longitude.toFixed(6)}
            </p>
          )}
        </div>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="h-96 p-4 overflow-y-auto bg-gray-50 flex-1"
      >
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            {isLoading ? 'Starting conversation...' : 'No messages yet'}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-100 self-end' 
                    : 'bg-white'
                }`}
              >
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {message.role === 'user' ? 'You' : agent.name}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                <p className="text-sm font-medium text-gray-500 mb-1">{agent.name}</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 p-2 border rounded-md"
            disabled={isLoading || !conversationId}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim() || !conversationId}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 