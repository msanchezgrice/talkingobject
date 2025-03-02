'use client';

import { useState, useRef, useEffect } from 'react';
import type { PlaceholderAgent } from '@/lib/placeholder-agents';
import { generateOpenAIResponse } from '@/lib/openai';

type ChatInterfaceProps = {
  agent: PlaceholderAgent;
};

type Message = {
  id: string;
  created_at: string;
  content: string;
  role: 'user' | 'assistant';
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
        // Generate a session ID for this conversation
        const sessionId = Math.random().toString(36).substring(2, 15);
        const conversationId = `${agent.id}-${sessionId}`;
        
        setConversationId(conversationId);
        
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
        content: input,
        role: 'user'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Store the conversation in localStorage
      saveMessageToLocalStorage({
        conversationId,
        message: userMessage
      });
      
      // Simulate a delay for the agent's response (1-3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000;
      setTimeout(async () => {
        try {
          // Get AI response using the enhanced function
          const responseText = await getAIResponse(input, agent);
          await sendAgentMessage(responseText);
        } catch (error) {
          console.error('Error generating response:', error);
          await sendAgentMessage("I'm sorry, I had trouble processing your request. Could you try again?");
        } finally {
          setIsLoading(false);
        }
      }, delay);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  // Helper function to send an agent message
  const sendAgentMessage = async (content: string) => {
    if (!conversationId) return;
    
    // Add the agent message to the UI
    const agentMessage: Message = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      content,
      role: 'assistant'
    };
    
    setMessages(prev => [...prev, agentMessage]);
    
    // Store the conversation in localStorage
    saveMessageToLocalStorage({
      conversationId,
      message: agentMessage
    });
  };

  // Save message to localStorage
  const saveMessageToLocalStorage = ({ conversationId, message }: { conversationId: string, message: Message }) => {
    try {
      // Get existing conversations or initialize empty object
      const storedConversations = localStorage.getItem('agentConversations');
      const conversations = storedConversations ? JSON.parse(storedConversations) : {};
      
      // Get or initialize this conversation's messages
      const conversationMessages = conversations[conversationId] || [];
      
      // Add the new message
      conversationMessages.push(message);
      
      // Update the conversations object
      conversations[conversationId] = conversationMessages;
      
      // Save back to localStorage
      localStorage.setItem('agentConversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Simulate an AI response based on the agent's personality
  const mockAIResponse = async (userMessage: string, agent: PlaceholderAgent): Promise<string> => {
    // Very simple response generation - in a real app this would call OpenAI/Anthropic
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Simple greeting detection
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi ') || lowercaseMessage === 'hi') {
      return `Hello! I'm ${agent.name}, your ${agent.personality.split('!')[0].toLowerCase()}. How can I assist you today?`;
    }
    
    // If asked about capabilities
    if (lowercaseMessage.includes('what can you do') || lowercaseMessage.includes('help me with')) {
      return `As ${agent.name}, ${agent.personality} I'd be happy to chat about ${agent.interests.join(', ')}.`;
    }
    
    // If asked about location
    if (lowercaseMessage.includes('where are you') || lowercaseMessage.includes('location')) {
      if (agent.latitude && agent.longitude) {
        return `I'm virtually located at latitude ${agent.latitude} and longitude ${agent.longitude}. This would typically be in a major city or point of interest.`;
      } else {
        return "I don't have a specific location assigned to me. I exist virtually to help you with information!";
      }
    }
    
    // Default response that references the agent's personality and interests
    return `Based on my expertise in ${agent.interests.join(', ')}, I would typically provide a detailed response here about "${userMessage}". In a complete implementation, this would be generated by OpenAI or Anthropic's API based on my personality: ${agent.personality}`;
  };

  // Add an OpenAI-powered response generator
  const getAIResponse = async (userMessage: string, agent: PlaceholderAgent): Promise<string> => {
    try {
      // Get chat history for context (limited to last 10 messages)
      const chatHistory = messages
        .slice(-10)
        .map(msg => ({ role: msg.role, content: msg.content }));

      // Try OpenAI API first
      const openAIResult = await generateOpenAIResponse({
        prompt: userMessage,
        agentPersonality: agent.personality,
        agentInterests: agent.interests,
        chatHistory: chatHistory
      });

      if (openAIResult.success) {
        return openAIResult.response;
      } else {
        console.warn('OpenAI API error:', openAIResult.error);
        // Fall back to mock response if OpenAI fails
        return openAIResult.fallbackResponse || await mockAIResponse(userMessage, agent);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      return await mockAIResponse(userMessage, agent);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden flex flex-col border border-gray-800" style={{ maxHeight: '70vh' }}>
      <div className="p-4 border-b border-gray-800 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden">
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
          <h2 className="font-bold text-xl text-white">{agent.name}</h2>
          {agent.latitude && agent.longitude && (
            <p className="text-sm text-gray-400">
              Located at {agent.latitude.toFixed(6)}, {agent.longitude.toFixed(6)}
            </p>
          )}
        </div>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="p-4 overflow-y-auto bg-gray-800 flex-1" style={{ height: '350px' }}
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
                    ? 'bg-blue-900 text-blue-100 self-end' 
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm font-medium mb-1 text-gray-300">
                  {message.role === 'user' ? 'You' : agent.name}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-gray-700 p-3 rounded-lg shadow-sm max-w-[80%]">
                <p className="text-sm font-medium mb-1 text-gray-300">{agent.name}</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 p-2 border rounded-md bg-gray-800 text-white border-gray-700"
            disabled={isLoading || !conversationId}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim() || !conversationId}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 