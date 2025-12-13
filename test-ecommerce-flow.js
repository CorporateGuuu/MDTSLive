#!/usr/bin/env node

// =============================================================================
// E-Commerce Flow Testing Script
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log('🧪 E-Commerce Flow Testing Script\n');

// =============================================================================
// Test Functions
// =============================================================================

async function checkDatabaseSetup() {
  console.log('📊 Checking Database Setup...\n');

  const tables = ['products', 'cart_items', 'orders'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        results[table] = { status: 'error', error: error.message };
      } else {
        results[table] = { status: 'ok', count: data?.length || 0 };
      }
    } catch (error) {
      results[table] = { status: 'error', error: error.message };
    }
  }

  // Display results
  Object.entries(results).forEach(([table, result]) => {
    if (result.status === 'ok') {
      console.log(`✅ ${table}: ${result.count} records found`);
    } else {
      console.log(`❌ ${table}: ${result.error}`);
    }
  });

  return results;
}

async function checkProducts() {
  console.log('\n📦 Checking Products...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, sku')
    .limit(5);

  if (error) {
    console.log('❌ Error fetching products:', error.message);
    return false;
  }

  if (!products || products.length === 0) {
    console.log('⚠️  No products found. Run the seeding script first.');
    return false;
  }

  console.log('✅ Found products:');
  products.forEach(product => {
    console.log(`   - ${product.name} (${product.sku}) - $${product.price}`);
  });

  return products;
}

async function simulateCartOperations() {
  console.log('\n🛒 Testing Cart Operations...\n');

  // Create a test user ID (simulate authenticated user)
  const testUserId = 'test-user-' + Date.now();

  try {
    // Get a product to add to cart
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);

    if (!products || products.length === 0) {
      console.log('❌ No products available for cart testing');
      return false;
    }

    const product = products[0];
    console.log(`📦 Using product: ${product.name} (ID: ${product.id})`);

    // Simulate adding to cart
    const { error: addError } = await supabase
      .from('cart_items')
      .insert({
        user_id: testUserId,
        product_id: product.id,
        quantity: 2
      });

    if (addError) {
      console.log('❌ Error adding to cart:', addError.message);
      return false;
    }

    console.log('✅ Item added to cart');

    // Check cart contents
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, products(name, price)')
      .eq('user_id', testUserId);

    if (cartError) {
      console.log('❌ Error fetching cart:', cartError.message);
      return false;
    }

    console.log('✅ Cart contents:');
    cartItems.forEach(item => {
      console.log(`   - ${item.products.name} x${item.quantity} = $${(item.products.price * item.quantity).toFixed(2)}`);
    });

    // Clean up test data
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', testUserId);

    console.log('🧹 Cleaned up test cart data');

    return true;

  } catch (error) {
    console.log('❌ Cart operation error:', error.message);
    return false;
  }
}

async function testStripeIntegration() {
  console.log('\n💳 Testing Stripe Integration Setup...\n');

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const checks = [
    { name: 'STRIPE_SECRET_KEY', value: stripeKey, required: true },
    { name: 'STRIPE_WEBHOOK_SECRET', value: webhookSecret, required: true },
    { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: publishableKey, required: true },
  ];

  let allGood = true;

  checks.forEach(check => {
    if (check.required && !check.value) {
      console.log(`❌ ${check.name}: Missing (required)`);
      allGood = false;
    } else if (check.value) {
      console.log(`✅ ${check.name}: Set`);
    } else {
      console.log(`⚠️  ${check.name}: Not set (optional)`);
    }
  });

  if (allGood) {
    console.log('\n💡 Stripe environment variables are configured');
    console.log('   Test card: 4242 4242 4242 4242 (any expiry, any CVC)');
  }

  return allGood;
}

async function provideTestingInstructions() {
  console.log('\n📋 Manual Testing Instructions:\n');

  console.log('1. 🏠 Start the Next.js app:');
  console.log('   npm run dev');
  console.log('');

  console.log('2. 🛒 Add items to cart (as guest):');
  console.log('   - Visit homepage');
  console.log('   - Click "Add to Cart" on any toolkit');
  console.log('   - Check cart badge updates');
  console.log('');

  console.log('3. 🔐 Login via Supabase Auth:');
  console.log('   - Click "Sign In" in header');
  console.log('   - Use Supabase Auth (email/password)');
  console.log('   - Guest cart should sync to account');
  console.log('');

  console.log('4. 💳 Test Stripe Checkout:');
  console.log('   - Go to /cart');
  console.log('   - Click "Proceed to Checkout"');
  console.log('   - Use test card: 4242 4242 4242 4242');
  console.log('   - Complete payment');
  console.log('');

  console.log('5. ✅ Verify Success & Database:');
  console.log('   - Should redirect to /success');
  console.log('   - Check Supabase orders table for "paid" status');
  console.log('   - Cart should be cleared');
  console.log('');

  console.log('6. 🔍 Test Search Functionality:');
  console.log('   - Type in search bar (e.g., "iPhone")');
  console.log('   - See autocomplete dropdown');
  console.log('   - Click result to navigate');
  console.log('');
}

// =============================================================================
// Main Test Runner
// =============================================================================

async function runTests() {
  console.log('🚀 Starting E-Commerce Flow Tests...\n');

  try {
    // Run automated tests
    const dbResults = await checkDatabaseSetup();
    const products = await checkProducts();
    const cartWorks = products ? await simulateCartOperations() : false;
    const stripeReady = await testStripeIntegration();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    const tests = [
      { name: 'Database Tables', status: Object.values(dbResults).every(r => r.status === 'ok') },
      { name: 'Products Available', status: products && products.length > 0 },
      { name: 'Cart Operations', status: cartWorks },
      { name: 'Stripe Setup', status: stripeReady },
    ];

    tests.forEach(test => {
      const icon = test.status ? '✅' : '❌';
      console.log(`${icon} ${test.name}: ${test.status ? 'PASS' : 'FAIL'}`);
    });

    const passedTests = tests.filter(t => t.status).length;
    console.log(`\n📈 ${passedTests}/${tests.length} tests passed`);

    if (passedTests === tests.length) {
      console.log('\n🎉 All automated tests passed! Ready for manual testing.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix issues before manual testing.');
    }

    // Always show manual testing instructions
    await provideTestingInstructions();

  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
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
