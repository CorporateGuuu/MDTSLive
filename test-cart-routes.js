#!/usr/bin/env node

// =============================================================================
// Nexus Tech Hub - Cart API Routes Test
// =============================================================================

import { execSync } from 'child_process';

// Test configuration
const BASE_URL = 'http://localhost:3003'; // Adjust if your dev server runs on different port

// Test user credentials (create a test user first)
const TEST_EMAIL = 'test-cart@example.com';
const TEST_PASSWORD = 'testpassword123';

// Test product ID (found in database)
const TEST_PRODUCT_ID = '1127'; // iPhone 13 Pro OLED Screen

// Helper function to make HTTP requests
function makeRequest(method, url, data = null, authToken = null) {
  const curlCommand = [
    'curl',
    '-s',
    '-X', method.toUpperCase(),
    '-H', '"Content-Type: application/json"',
    authToken ? ['-H', `"Cookie: supabase-auth-token=${authToken}"`] : [],
    data ? ['-d', JSON.stringify(data).replace(/"/g, '\\"')] : [],
    `"${url}"`
  ].flat().filter(Boolean).join(' ');

  try {
    const result = execSync(curlCommand, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return null;
  }
}

// Main test function
async function testCartRoutes() {
  console.log('🛒 Testing Cart API Routes\n');

  try {
    // 1. Register/Login to get auth token
    console.log('1. Authenticating user...');
    const loginResponse = makeRequest('POST', `${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (!loginResponse || loginResponse.error) {
      console.log('   User not found, attempting registration...');
      const registerResponse = makeRequest('POST', `${BASE_URL}/api/auth/register`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        firstName: 'Test',
        lastName: 'User'
      });

      if (!registerResponse || registerResponse.error) {
        console.error('❌ Failed to authenticate user');
        return;
      }

      console.log('   ✅ User registered successfully');
      // For simplicity, we'll assume the token is set in cookies after registration
      // In a real test, you'd need to extract the token from the response or cookies
      console.log('   ⚠️  Please manually login to get auth token for subsequent tests');
      return;
    }

    console.log('   ✅ User authenticated');
    // Note: In a real implementation, you'd extract the auth token from the response
    // For now, we'll assume it's set in cookies

    // 2. Test GET /api/cart (should return empty cart initially)
    console.log('\n2. Testing GET /api/cart (empty cart)...');
    const getCartResponse = makeRequest('GET', `${BASE_URL}/api/cart`);
    console.log('   Response:', getCartResponse);

    // 3. Test POST /api/cart (add item to cart)
    console.log('\n3. Testing POST /api/cart (add item)...');
    const addToCartResponse = makeRequest('POST', `${BASE_URL}/api/cart`, {
      productId: TEST_PRODUCT_ID,
      quantity: 2
    });
    console.log('   Response:', addToCartResponse);

    // 4. Test GET /api/cart (should return cart with item)
    console.log('\n4. Testing GET /api/cart (with item)...');
    const getCartWithItemResponse = makeRequest('GET', `${BASE_URL}/api/cart`);
    console.log('   Response:', getCartWithItemResponse);

    // 5. Test POST /api/cart (update quantity)
    console.log('\n5. Testing POST /api/cart (update quantity)...');
    const updateCartResponse = makeRequest('POST', `${BASE_URL}/api/cart`, {
      productId: TEST_PRODUCT_ID,
      quantity: 3
    });
    console.log('   Response:', updateCartResponse);

    // 6. Test DELETE /api/cart/[productId] (remove specific item)
    console.log('\n6. Testing DELETE /api/cart/[productId] (remove item)...');
    const removeItemResponse = makeRequest('DELETE', `${BASE_URL}/api/cart/${TEST_PRODUCT_ID}`);
    console.log('   Response:', removeItemResponse);

    // 7. Test DELETE /api/cart (clear cart)
    console.log('\n7. Testing DELETE /api/cart (clear cart)...');
    // First add an item back
    makeRequest('POST', `${BASE_URL}/api/cart`, {
      productId: TEST_PRODUCT_ID,
      quantity: 1
    });
    const clearCartResponse = makeRequest('DELETE', `${BASE_URL}/api/cart`);
    console.log('   Response:', clearCartResponse);

    console.log('\n🎉 Cart routes test completed!');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testCartRoutes().catch(console.error);
}

export { testCartRoutes };
