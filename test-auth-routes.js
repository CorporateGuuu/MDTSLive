// Test script for auth routes using curl
import { execSync } from 'child_process';

const BASE_URL = 'http://localhost:3002';

function runCurlTest(description, curlCommand) {
  console.log(description);
  try {
    const result = execSync(curlCommand, { encoding: 'utf8' });
    console.log('Response:', result);
    return true;
  } catch (error) {
    console.log('Response:', error.stdout || error.stderr);
    return false;
  }
}

function testAuthRoutes() {
  console.log('🧪 Testing Supabase Auth API Routes\n');

  // Test 1: Register a new user
  const timestamp = Date.now();
  runCurlTest(
    '1. Testing user registration...',
    `curl -X POST ${BASE_URL}/api/auth/register \\
      -H "Content-Type: application/json" \\
      -d '{"email":"test${timestamp}@test.com","password":"password123","fullName":"Test User"}'`
  );

  // Test 2: Login (this will fail if email confirmation is required)
  runCurlTest(
    '\n2. Testing user login...',
    `curl -X POST ${BASE_URL}/api/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{"email":"test@example.com","password":"password123"}'`
  );

  // Test 3: Get current user (will fail without proper auth)
  runCurlTest(
    '\n3. Testing /me endpoint (should fail without auth)...',
    `curl ${BASE_URL}/api/auth/me`
  );

  // Test 4: Logout
  runCurlTest(
    '\n4. Testing logout...',
    `curl -X POST ${BASE_URL}/api/auth/logout`
  );

  console.log('\n🎉 Auth routes test completed!');
}

// Run the tests
testAuthRoutes();
