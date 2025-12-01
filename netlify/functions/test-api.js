// Simple test function to verify Netlify Functions are working
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const response = {
    message: 'Netlify Functions are working!',
    timestamp: new Date().toISOString(),
    method: event.httpMethod,
    path: event.path,
    environment: process.env.NODE_ENV || 'unknown',
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    nexusTechHub: {
      business: 'Nexus TechHub',
      location: 'Ras Al Khaimah, UAE',
      phone: '+971585531029',
      vatReady: true
    }
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response, null, 2),
  };
};
