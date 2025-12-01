#!/usr/bin/env node

// =============================================================================
// Nexus Tech Hub - Products API Routes Test
// =============================================================================

import { execSync } from 'child_process';

// Test configuration
const BASE_URL = 'http://localhost:3000'; // Server should be running on port 3000

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
async function testProductsRoutes() {
  console.log('📦 Testing Products API Routes\n');

  try {
    // 1. Test GET /api/products (public access)
    console.log('1. Testing GET /api/products (public access)...');
    const getProductsResponse = makeRequest('GET', `${BASE_URL}/api/products?limit=5`);
    console.log('   Response:', getProductsResponse);

    // 2. Test GET /api/products with search
    console.log('\n2. Testing GET /api/products with search...');
    const searchProductsResponse = makeRequest('GET', `${BASE_URL}/api/products?search=screen&limit=5`);
    console.log('   Response:', searchProductsResponse);

    // 3. Test GET /api/products/[id] (public access)
    console.log('\n3. Testing GET /api/products/[id] (public access)...');
    const getProductResponse = makeRequest('GET', `${BASE_URL}/api/products/${TEST_PRODUCT_ID}`);
    console.log('   Response:', getProductResponse);

    // 4. Test POST /api/products (should fail without admin auth)
    console.log('\n4. Testing POST /api/products (should fail without admin auth)...');
    const createProductResponse = makeRequest('POST', `${BASE_URL}/api/products`, {
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      stock_quantity: 10
    });
    console.log('   Response:', createProductResponse);

    // 5. Test PUT /api/products/[id] (should fail without admin auth)
    console.log('\n5. Testing PUT /api/products/[id] (should fail without admin auth)...');
    const updateProductResponse = makeRequest('PUT', `${BASE_URL}/api/products/${TEST_PRODUCT_ID}`, {
      name: 'Updated Test Product'
    });
    console.log('   Response:', updateProductResponse);

    // 6. Test DELETE /api/products/[id] (should fail without admin auth)
    console.log('\n6. Testing DELETE /api/products/[id] (should fail without admin auth)...');
    const deleteProductResponse = makeRequest('DELETE', `${BASE_URL}/api/products/${TEST_PRODUCT_ID}`);
    console.log('   Response:', deleteProductResponse);

    console.log('\n🎉 Products routes test completed!');
    console.log('\nNote: Admin operations require authentication with admin role.');
    console.log('To test admin operations, you need to:');
    console.log('1. Create/login as an admin user');
    console.log('2. Include the auth token in requests');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testProductsRoutes().catch(console.error);
}

export { testProductsRoutes };
