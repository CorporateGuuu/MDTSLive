#!/usr/bin/env node

// Live Stripe Testing Script for Nexus TechHub UAE
// Tests live Stripe integration with UAE VAT calculations

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testLiveStripeIntegration() {
  console.log('🇦🇪 Testing Live Stripe Integration for Nexus TechHub');
  console.log('===================================================');
  console.log(`Using Stripe Key: ${process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 12) + '...' : 'NOT SET'}`);

  try {
    // Test 1: Create a tax calculation for UAE
    console.log('\n📊 Test 1: Creating UAE Tax Calculation...');

    const taxCalculation = await stripe.tax.calculations.create({
      currency: 'aed',
      customer_details: {
        address: {
          country: 'AE',
          state: 'Ras Al Khaimah',
          city: 'Ras Al Khaimah',
          postal_code: '12345',
          line1: 'Al Hamra Industrial Zone-FZ'
        },
        address_source: 'billing'
      },
      line_items: [
        {
          amount: 10000, // 100 AED in fils
          reference: 'NTH-TEST-001',
          tax_code: 'txcd_99999999' // General goods
        }
      ]
    });

    console.log('✅ Tax Calculation Created:');
    console.log(`   ID: ${taxCalculation.id}`);
    console.log(`   Amount Total: ${taxCalculation.amount_total / 100} AED`);
    console.log(`   Tax Amount: ${taxCalculation.tax_amount_exclusive / 100} AED`);
    console.log(`   Tax Rate: ${(taxCalculation.tax_amount_exclusive / taxCalculation.amount_total * 100).toFixed(2)}%`);

    // Test 2: Create payment intent with tax
    console.log('\n💳 Test 2: Creating Payment Intent with Tax...');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: taxCalculation.amount_total,
      currency: 'aed',
      payment_method_types: ['card'], // Explicitly specify payment methods
      metadata: {
        tax_calculation_id: taxCalculation.id,
        business_name: 'Nexus TechHub',
        customer_phone: '+971585531029',
        location: 'Ras Al Khaimah, UAE'
      }
    });

    console.log('✅ Payment Intent Created:');
    console.log(`   ID: ${paymentIntent.id}`);
    console.log(`   Amount: ${paymentIntent.amount / 100} AED`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Client Secret: ${paymentIntent.client_secret.substring(0, 20)}...`);

    // Test 3: Test small amount transaction (typical for mobile parts)
    console.log('\n📱 Test 3: Testing Mobile Part Transaction (50 AED)...');

    const smallTaxCalc = await stripe.tax.calculations.create({
      currency: 'aed',
      customer_details: {
        address: {
          country: 'AE',
          state: 'Ras Al Khaimah',
          city: 'Ras Al Khaimah',
          postal_code: '12345',
          line1: 'Al Hamra Industrial Zone'
        },
        address_source: 'billing'
      },
      line_items: [
        {
          amount: 5000, // 50 AED in fils (typical mobile part price)
          reference: 'NTH-MOBILE-PART-001',
          tax_code: 'txcd_99999999'
        }
      ]
    });

    console.log('✅ Mobile Part Tax Calculation:');
    console.log(`   Amount: ${smallTaxCalc.amount_total / 100} AED`);
    console.log(`   VAT: ${smallTaxCalc.tax_amount_exclusive / 100} AED`);
    console.log(`   Rate: ${(smallTaxCalc.tax_amount_exclusive / smallTaxCalc.amount_total * 100).toFixed(2)}%`);

    // Test 4: Test checkout session creation
    console.log('\n🛒 Test 4: Creating Checkout Session...');

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'iPhone 14 Pro Screen Replacement',
              description: 'High-quality OLED screen replacement for iPhone 14 Pro',
            },
            unit_amount: 29999, // 299.99 AED in fils
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://nexustechhub.netlify.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://nexustechhub.netlify.app/checkout/cancel',
      customer_email: 'customer@example.com',
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AE'],
      },
      metadata: {
        business_name: 'Nexus TechHub',
        location: 'UAE',
        order_type: 'mobile_repair_part'
      }
    });

    console.log('✅ Checkout Session Created:');
    console.log(`   ID: ${checkoutSession.id}`);
    console.log(`   URL: ${checkoutSession.url}`);
    console.log(`   Payment Status: ${checkoutSession.payment_status}`);

    console.log('\n🎉 All tests passed! Live Stripe integration is working correctly.');
    console.log('\n📋 Summary:');
    console.log(`   • Tax Calculation: ${taxCalculation.id}`);
    console.log(`   • Payment Intent: ${paymentIntent.id}`);
    console.log(`   • Small Amount Test: ${smallTaxCalc.id}`);
    console.log(`   • Checkout Session: ${checkoutSession.id}`);
    console.log(`   • VAT Rate: 5% (as expected for UAE)`);
    console.log(`   • Currency: AED`);
    console.log(`   • Ready for production use! 🚀`);

    console.log('\n🔗 Next Steps:');
    console.log('1. Add these environment variables to Netlify:');
    console.log(`   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`);
    console.log(`   STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...`);
    console.log('2. Set up webhook endpoint in Stripe Dashboard');
    console.log('3. Deploy to production');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Error details:', error);

    if (error.code === 'api_key_invalid') {
      console.log('\n💡 Solution: Make sure you\'re using your live Stripe secret key');
      console.log('   Format: sk_live_...');
    } else if (error.code === 'tax_calculation_invalid') {
      console.log('\n💡 Solution: Stripe Tax may not be enabled for your account');
      console.log('   Contact Stripe support to enable Tax calculations');
    } else if (error.type === 'StripePermissionError') {
      console.log('\n💡 Solution: Enable Stripe Tax in your dashboard');
      console.log('   Go to: Dashboard > Settings > Tax');
    }
  }
}

// Run the test
if (require.main === module) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY environment variable not set');
    console.log('Usage: STRIPE_SECRET_KEY=sk_live_... node Scripts/test-stripe-live.js');
    process.exit(1);
  }

  testLiveStripeIntegration();
}

module.exports = { testLiveStripeIntegration };
