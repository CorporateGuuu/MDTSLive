#!/usr/bin/env node

// =============================================================================
// Midas Technical Solutions - Supabase Test Suite
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });
config(); // fallback to .env

// =============================================================================
// Configuration
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Initialize Supabase clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// =============================================================================
// Test Utilities
// =============================================================================

let testUser = null;
let testResults = { passed: 0, failed: 0 };

function logTest(testName, passed, message = '') {
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m'; // Green for pass, red for fail
  const reset = '\x1b[0m';

  console.log(`${color}${status} ${testName}${message ? ': ' + message : ''}${reset}`);

  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// =============================================================================
// Test Functions
// =============================================================================

/**
 * Test 1: Basic connectivity
 */
async function testConnectivity() {
  console.log('\n🔗 Test 1: Basic Connectivity');

  try {
    // Test with service key (should have full access)
    const { data, error } = await supabaseService
      .from('products')
      .select('*')
      .limit(1);

    assert(!error, `Service key query failed: ${error?.message}`);
    logTest('Service key connectivity', true);

    // Test with anon key (should work for public reads)
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('products')
      .select('*')
      .limit(1);

    if (anonError) {
      logTest('Anon key connectivity', false, `Failed: ${anonError.message}`);
    } else {
      logTest('Anon key connectivity', true);
    }

  } catch (error) {
    logTest('Basic connectivity', false, error.message);
  }
}

/**
 * Test 2: Auth simulation
 */
async function testAuthSimulation() {
  console.log('\n🔐 Test 2: Auth Simulation');

  try {
    // Create a temporary test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    const { data: signUpData, error: signUpError } = await supabaseAnon.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      logTest('User signup', false, `Failed: ${signUpError.message}`);
      return;
    }

    testUser = { email: testEmail, password: testPassword, id: signUpData.user?.id };
    logTest('User signup', true);

    // Try to sign in (may require email confirmation, but let's test)
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      logTest('User signin', false, `Failed: ${signInError.message} (may require email confirmation)`);
    } else {
      logTest('User signin', true);
    }

  } catch (error) {
    logTest('Auth simulation', false, error.message);
  }
}

/**
 * Test 3: RLS policies
 */
async function testRLSPolicies() {
  console.log('\n🔒 Test 3: RLS Policies');

  try {
    // Test public read on products (should work with anon key)
    const { data: productsData, error: productsError } = await supabaseAnon
      .from('products')
      .select('id, name')
      .limit(1);

    if (productsError) {
      logTest('Public read products', false, `Failed: ${productsError.message}`);
    } else {
      logTest('Public read products', true);
    }

    // Test authenticated insert on orders (should fail with anon key)
    const { error: orderInsertError } = await supabaseAnon
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
        status: 'pending',
        total_amount: 100.00,
      });

    if (orderInsertError) {
      logTest('Anon insert orders blocked', true, '(Expected RLS rejection)');
    } else {
      logTest('Anon insert orders blocked', false, 'RLS policy not working');
    }

    // Test admin insert on orders (should work with service key)
    const { error: adminOrderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
        status: 'pending',
        total_amount: 100.00,
      });

    if (adminOrderError) {
      logTest('Admin insert orders', false, `Failed: ${adminOrderError.message}`);
    } else {
      logTest('Admin insert orders', true);
    }

  } catch (error) {
    logTest('RLS policies', false, error.message);
  }
}

/**
 * Test 4: Foreign keys/relationships
 */
async function testRelationships() {
  console.log('\n🔗 Test 4: Foreign Keys & Relationships');

  try {
    // First, let's check if we have any orders
    const { data: ordersData, error: ordersError } = await supabaseService
      .from('orders')
      .select(`
        id,
        user_id,
        status,
        total_amount,
        order_items (
          id,
          product_id,
          quantity,
          price
        )
      `)
      .limit(1);

    if (ordersError) {
      logTest('Order relationships query', false, `Failed: ${ordersError.message}`);
    } else {
      logTest('Order relationships query', true, `Found ${ordersData?.length || 0} orders with items`);
    }

    // Test products with categories relationship
    const { data: productsWithCategories, error: catError } = await supabaseService
      .from('products')
      .select(`
        id,
        name,
        categories (
          id,
          name
        )
      `)
      .limit(1);

    if (catError) {
      logTest('Product-category relationships', false, `Failed: ${catError.message}`);
    } else {
      logTest('Product-category relationships', true);
    }

  } catch (error) {
    logTest('Relationships', false, error.message);
  }
}

/**
 * Test 5: Edge cases
 */
async function testEdgeCases() {
  console.log('\n⚠️  Test 5: Edge Cases');

  try {
    // Test duplicate insert (if we have products)
    const { data: existingProducts } = await supabaseService
      .from('products')
      .select('name, slug')
      .limit(1);

    if (existingProducts && existingProducts.length > 0) {
      const product = existingProducts[0];

      // Try to insert a product with duplicate slug
      const { error: duplicateError } = await supabaseService
        .from('products')
        .insert({
          name: product.name + ' (Duplicate)',
          slug: product.slug, // This should cause a unique constraint violation
          price: 10.00,
        });

      if (duplicateError && duplicateError.code === '23505') { // Unique violation
        logTest('Duplicate slug handling', true, '(Unique constraint working)');
      } else {
        logTest('Duplicate slug handling', false, 'Expected unique constraint violation');
      }
    } else {
      logTest('Duplicate slug handling', false, 'No existing products to test with');
    }

    // Test invalid foreign key
    const { error: fkError } = await supabaseService
      .from('order_items')
      .insert({
        order_id: '00000000-0000-0000-0000-000000000000', // Non-existent order
        product_id: '00000000-0000-0000-0000-000000000000', // Non-existent product
        quantity: 1,
        price: 10.00,
      });

    if (fkError) {
      logTest('Foreign key constraints', true, '(FK validation working)');
    } else {
      logTest('Foreign key constraints', false, 'Expected FK violation');
    }

  } catch (error) {
    logTest('Edge cases', false, error.message);
  }
}

/**
 * Cleanup test data
 */
async function cleanup() {
  console.log('\n🧹 Cleanup');

  try {
    // Delete test orders (if any were created)
    const { error: orderCleanup } = await supabaseService
      .from('orders')
      .delete()
      .eq('user_id', '00000000-0000-0000-0000-000000000000');

    if (orderCleanup) {
      console.log('⚠️  Order cleanup warning:', orderCleanup.message);
    } else {
      logTest('Test orders cleanup', true);
    }

    // Note: User cleanup would require admin access to auth.users
    // This is typically done manually in Supabase dashboard
    if (testUser) {
      console.log(`📋 Test user ${testUser.email} created - clean up manually in Supabase Auth`);
    }

  } catch (error) {
    logTest('Cleanup', false, error.message);
  }
}

// =============================================================================
// Main Test Runner
// =============================================================================

function runTests() {
  console.log('🧪 Starting Midas Technical Solutions Supabase Test Suite...\n');

  // Run tests sequentially using promises
  testConnectivity()
    .then(() => testAuthSimulation())
    .then(() => testRLSPolicies())
    .then(() => testRelationships())
    .then(() => testEdgeCases())
    .then(() => cleanup())
    .then(() => {
      // Summary
      console.log('\n' + '='.repeat(60));
      console.log('📊 TEST SUITE SUMMARY');
      console.log('='.repeat(60));
      console.log(`✅ Passed: ${testResults.passed}`);
      console.log(`❌ Failed: ${testResults.failed}`);
      console.log(`📊 Total: ${testResults.passed + testResults.failed}`);

      if (testResults.failed === 0) {
        console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
      } else {
        console.log(`\n⚠️  ${testResults.failed} test(s) failed. Check the output above for details.`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error during testing:', error);
      process.exit(1);
    });
}

// =============================================================================
// Script Execution
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('💥 Script execution failed:', error);
    process.exit(1);
  });
}
