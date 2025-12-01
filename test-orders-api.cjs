#!/usr/bin/env node

/**
 * Midas Technical Solutions - Orders API Test Script
 *
 * This script provides curl examples and automated testing for the orders API endpoints.
 *
 * Prerequisites:
 * 1. Start the Next.js development server: npm run dev
 * 2. Have a valid Supabase session token (login first)
 * 3. Have items in cart (add some products to cart first)
 */

const BASE_URL = 'http://localhost:3000';

// Example session token (replace with actual token after login)
const EXAMPLE_TOKEN = 'your-session-token-here';

console.log('🚀 Midas Technical Solutions - Orders API Test Examples\n');

// =============================================================================
// MANUAL CURL COMMANDS
// =============================================================================

console.log('📋 MANUAL CURL COMMANDS:\n');

// Create order
console.log('# Create order');
console.log(`curl -X POST ${BASE_URL}/api/orders \\`);
console.log('  -H "Cookie: sb-access-token=' + EXAMPLE_TOKEN + '" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log(`  -d '{
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "0501234567",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Dubai",
      "state": "Dubai",
      "postalCode": "12345",
      "country": "AE"
    },
    "paymentMethod": "cod"
  }'`);
console.log();

// List orders
console.log('# List orders');
console.log(`curl ${BASE_URL}/api/orders -H "Cookie: sb-access-token=${EXAMPLE_TOKEN}"`);
console.log();

// List orders with pagination
console.log('# List orders with pagination');
console.log(`curl "${BASE_URL}/api/orders?page=1&limit=5" -H "Cookie: sb-access-token=${EXAMPLE_TOKEN}"`);
console.log();

// List orders with status filter
console.log('# List orders with status filter');
console.log(`curl "${BASE_URL}/api/orders?status=pending" -H "Cookie: sb-access-token=${EXAMPLE_TOKEN}"`);
console.log();

// Get single order
console.log('# Get single order');
console.log(`curl ${BASE_URL}/api/orders/abc123 -H "Cookie: sb-access-token=${EXAMPLE_TOKEN}"`);
console.log();

// =============================================================================
// AUTOMATED TESTING WITH NODE.JS
// =============================================================================

console.log('🤖 AUTOMATED TESTING:\n');

const https = require('https');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testOrdersAPI(token) {
  if (!token || token === 'your-session-token-here') {
    console.log('❌ Please set a valid session token first!');
    console.log('   1. Login via the app to get a session token');
    console.log('   2. Check browser cookies for sb-access-token');
    console.log('   3. Replace EXAMPLE_TOKEN in this script\n');
    return;
  }

  const cookieHeader = `sb-access-token=${token}`;

  try {
    console.log('🧪 Testing Orders API...\n');

    // Test 1: List orders
    console.log('1️⃣  Testing GET /api/orders (list orders)');
    const listOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json'
      }
    };

    const listResponse = await makeRequest(listOptions);
    console.log(`   Status: ${listResponse.status}`);
    console.log(`   Total Count: ${listResponse.headers['x-total-count'] || 'N/A'}`);
    console.log(`   Orders: ${Array.isArray(listResponse.data?.orders) ? listResponse.data.orders.length : 0}`);
    console.log();

    // Test 2: Create order (if cart has items)
    console.log('2️⃣  Testing POST /api/orders (create order)');
    const orderData = {
      shippingAddress: {
        fullName: "John Doe",
        phone: "0501234567",
        addressLine1: "123 Main Street",
        addressLine2: "Apt 4B",
        city: "Dubai",
        state: "Dubai",
        postalCode: "12345",
        country: "AE"
      },
      paymentMethod: "cod"
    };

    const createOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json'
      }
    };

    const createResponse = await makeRequest(createOptions, orderData);
    console.log(`   Status: ${createResponse.status}`);

    if (createResponse.status === 201) {
      console.log(`   Order Created: ${createResponse.data?.order_number}`);
      console.log(`   Order ID: ${createResponse.data?.id}`);
      console.log(`   Total: $${createResponse.data?.total_amount}`);

      // Test 3: Get single order
      console.log('\n3️⃣  Testing GET /api/orders/[id] (single order)');
      const orderId = createResponse.data?.id;
      if (orderId) {
        const singleOptions = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/orders/${orderId}`,
          method: 'GET',
          headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json'
          }
        };

        const singleResponse = await makeRequest(singleOptions);
        console.log(`   Status: ${singleResponse.status}`);
        console.log(`   Order: ${singleResponse.data?.order_number}`);
        console.log(`   Items: ${singleResponse.data?.items?.length || 0}`);
      }
    } else {
      console.log(`   Error: ${createResponse.data?.error || 'Unknown error'}`);
    }

    console.log('\n✅ API Testing Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================

console.log('📖 USAGE INSTRUCTIONS:\n');

console.log('1. Start the development server:');
console.log('   npm run dev\n');

console.log('2. Login to get a session token:');
console.log('   - Visit http://localhost:3000');
console.log('   - Login via the authentication system');
console.log('   - Check browser DevTools → Application → Cookies');
console.log('   - Copy the sb-access-token value\n');

console.log('3. Add items to cart:');
console.log('   - Visit products page');
console.log('   - Add some products to cart\n');

console.log('4. Test manually with curl commands above, or:\n');

console.log('5. Test automatically with Node.js:');
console.log('   - Set your token in the script');
console.log(`   - Run: node ${__filename.replace('.js', '')}.js\n`);

// Run automated test if token is provided via environment variable
const token = process.env.SUPABASE_TOKEN || EXAMPLE_TOKEN;
if (process.env.SUPABASE_TOKEN) {
  testOrdersAPI(token);
} else {
  console.log('💡 To run automated tests:');
  console.log('   SUPABASE_TOKEN=your-token-here node test-orders-api.js\n');
}

// =============================================================================
// EXPECTED RESPONSES
// =============================================================================

console.log('📋 EXPECTED API RESPONSES:\n');

console.log('✅ POST /api/orders (Success):');
console.log(`   Status: 201
   Response: {
     "id": "uuid",
     "order_number": "NXH-20241102-0123",
     "status": "pending",
     "total_amount": 299.97,
     "shipping_address": {...},
     "payment_method": "cod",
     "items": [...],
     "created_at": "2024-11-02T19:04:40.000Z"
   }\n`);

console.log('✅ GET /api/orders (List):');
console.log(`   Status: 200
   Headers: X-Total-Count: 5
   Response: {
     "orders": [...],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 5,
       "totalPages": 1,
       "hasNext": false,
       "hasPrev": false
     }
   }\n`);

console.log('✅ GET /api/orders/[id] (Single):');
console.log(`   Status: 200
   Response: {
     "id": "uuid",
     "order_number": "NXH-20241102-0123",
     "status": "pending",
     "total_amount": 299.97,
     "shipping_address": {...},
     "payment_method": "cod",
     "items": [...],
     "created_at": "2024-11-02T19:04:40.000Z"
   }\n`);

console.log('❌ Common Error Responses:');
console.log(`   400: {"error": "Cart is empty"}
   400: {"error": "Insufficient stock for iPhone 15"}
   401: {"error": "No authentication token provided"}
   404: {"error": "Order not found or access denied"}
   500: {"error": "Order creation failed. All changes have been rolled back."}\n`);

console.log('🎉 Ready to test the Orders API!');
