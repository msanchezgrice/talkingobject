// Agent Chat Testing Script

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`Error with ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
}

// Mock data
const mockAgent = {
  id: process.env.TEST_AGENT_ID || '1',
  name: 'Test Agent',
  personality: 'Helpful and friendly assistant',
  hasDataSources: true,
  location: 'San Francisco, CA',
  slug: 'test-agent'
};

// Test agent chat API
async function testAgentChat() {
  console.log('===== TESTING AGENT CHAT API =====');
  
  // Step 1: Test creating a new conversation
  console.log('\n1. Creating a new conversation...');
  const conversationPayload = {
    agentId: mockAgent.id,
    sessionId: 'test-session-' + Date.now()
  };
  
  const conversationResponse = await makeRequest('/agent/conversation', 'POST', conversationPayload);
  
  if (!conversationResponse.success) {
    console.error('Failed to create conversation:', conversationResponse.error || conversationResponse.data);
    return;
  }
  
  const conversationId = conversationResponse.data.id;
  console.log(`Conversation created with ID: ${conversationId}`);
  
  // Step 2: Test sending a message
  console.log('\n2. Sending a message to the agent...');
  const messagePayload = {
    conversationId,
    message: 'Hello, can you tell me about the weather today?',
    agentId: mockAgent.id
  };
  
  console.log('Request payload:', messagePayload);
  const chatResponse = await makeRequest('/agent/chat', 'POST', messagePayload);
  
  if (!chatResponse.success) {
    console.error('Failed to get chat response:', chatResponse.error || chatResponse.data);
  } else {
    console.log('Chat response received:');
    console.log(chatResponse.data);
  }
  
  // Step 3: Test sending a follow-up message
  console.log('\n3. Sending a follow-up message...');
  const followUpPayload = {
    conversationId,
    message: 'What about local events happening this weekend?',
    agentId: mockAgent.id
  };
  
  console.log('Request payload:', followUpPayload);
  const followUpResponse = await makeRequest('/agent/chat', 'POST', followUpPayload);
  
  if (!followUpResponse.success) {
    console.error('Failed to get follow-up response:', followUpResponse.error || followUpResponse.data);
  } else {
    console.log('Follow-up response received:');
    console.log(followUpResponse.data);
  }
  
  // Step 4: Test retrieving conversation history
  console.log('\n4. Retrieving conversation history...');
  const historyResponse = await makeRequest(`/agent/conversation/${conversationId}/messages`);
  
  if (!historyResponse.success) {
    console.error('Failed to get conversation history:', historyResponse.error || historyResponse.data);
  } else {
    console.log('Conversation history:');
    console.log(historyResponse.data);
  }
  
  console.log('\n===== AGENT CHAT TEST COMPLETED =====');
}

// Run the test
testAgentChat(); 