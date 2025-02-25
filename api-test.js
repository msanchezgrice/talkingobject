// API Endpoint Testing Script

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function testEndpoint(endpoint, method = 'GET', body = null) {
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
    console.log(`Testing ${method} ${endpoint}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('-----------------------------------');
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error);
    console.log('-----------------------------------');
    return { success: false, error: error.message };
  }
}

// Test functions for each API endpoint
async function testWeatherAPI() {
  return testEndpoint('/external/weather?lat=37.7749&lon=-122.4194');
}

async function testNewsAPI() {
  return testEndpoint('/external/news');
}

async function testNewsAPIWithQuery() {
  return testEndpoint('/external/news?q=technology');
}

async function testEventsAPI() {
  return testEndpoint('/external/events?lat=40.7128&lon=-74.0060');
}

async function testStocksAPI() {
  return testEndpoint('/external/stocks?symbols=AAPL,MSFT,GOOGL');
}

async function testQRCodeAPI() {
  // This returns an image, so we'll just check if the request is successful
  const url = `${BASE_URL}/qrcode?data=https://example.com&format=png`;
  try {
    console.log(`Testing GET /qrcode...`);
    const response = await fetch(url);
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('Content-Type')}`);
    console.log('-----------------------------------');
    
    return { 
      success: response.ok, 
      status: response.status,
      contentType: response.headers.get('Content-Type')
    };
  } catch (error) {
    console.error('Error testing /qrcode:', error);
    console.log('-----------------------------------');
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log('=== STARTING API ENDPOINT TESTS ===');
  console.log('-----------------------------------');
  
  await testWeatherAPI();
  await testNewsAPI();
  await testNewsAPIWithQuery();
  await testEventsAPI();
  await testStocksAPI();
  await testQRCodeAPI();
  
  console.log('=== API ENDPOINT TESTS COMPLETED ===');
}

// Run the tests
runTests(); 