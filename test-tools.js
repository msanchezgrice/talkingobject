// Simple test to verify tool integration
const { chatLLM, availableTools } = require('./lib/aiProvider');

async function testTools() {
  console.log('Available tools:', availableTools.map(t => t.name));
  
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant with access to real-time tools.'
    },
    {
      role: 'user', 
      content: 'What is the weather like?'
    }
  ];
  
  const agentLocation = { lat: 30.2672, lon: -97.7431 }; // Austin, TX
  
  try {
    console.log('Testing tool-enabled chat...');
    const response = await chatLLM(messages, availableTools, agentLocation);
    console.log('Response:', response.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testTools(); 