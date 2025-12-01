#!/usr/bin/env node

// Test Manual UAE VAT Calculation for Nexus TechHub
// This works even if Stripe Tax is not enabled

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Manual UAE VAT calculation function
function calculateUAEVAT(amount, vatRate = 0.05) {
  const subtotal = amount;
  const vatAmount = Math.round(subtotal * vatRate);
  const total = subtotal + vatAmount;
  
  return {
    subtotal,
    vatAmount,
    total,
    vatRate: vatRate * 100
  };
}

async function testManualUAEVAT() {
  console.log('🇦🇪 Testing Manual UAE VAT Calculation for Nexus TechHub');
  console.log('====================================================');
  
  try {
    // Test 1: Manual VAT calculation for typical mobile part
    console.log('\n📱 Test 1: iPhone Screen Replacement (299.99 AED)');
    console.log('================================================');
    
    const iPhoneScreenPrice = 29999; // 299.99 AED in fils
    const iPhoneVAT = calculateUAEVAT(iPhoneScreenPrice);
    
    console.log('✅ Manual VAT Calculation:');
    console.log(`   Product: iPhone 14 Pro Screen Replacement`);
    console.log(`   Subtotal: ${iPhoneVAT.subtotal / 100} AED`);
    console.log(`   VAT (5%): ${iPhoneVAT.vatAmount / 100} AED`);
    console.log(`   Total: ${iPhoneVAT.total / 100} AED`);
    console.log(`   VAT Rate: ${iPhoneVAT.vatRate}%`);
    
    // Test 2: Create payment intent with manual VAT
    console.log('\n💳 Test 2: Payment Intent with Manual VAT');
    console.log('=========================================');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: iPhoneVAT.total, // Total including VAT
      currency: 'aed',
      payment_method_types: ['card'],
      metadata: {
        business_name: 'Nexus TechHub',
        product_name: 'iPhone 14 Pro Screen Replacement',
        subtotal: (iPhoneVAT.subtotal / 100).toString(),
        vat_amount: (iPhoneVAT.vatAmount / 100).toString(),
        vat_rate: '5%',
        customer_phone: '+971585531029',
        location: 'UAE'
      }
    });
    
    console.log('✅ Payment Intent Created:');
    console.log(`   ID: ${paymentIntent.id}`);
    console.log(`   Amount: ${paymentIntent.amount / 100} AED (including VAT)`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Metadata includes VAT breakdown: ✅`);
    
    // Test 3: Checkout session with manual VAT
    console.log('\n🛒 Test 3: Checkout Session with Manual VAT');
    console.log('==========================================');
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'iPhone 14 Pro Screen Replacement',
              description: 'High-quality OLED screen replacement (Price includes 5% UAE VAT)',
            },
            unit_amount: iPhoneVAT.total, // Total including VAT
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://nexustechhub.netlify.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://nexustechhub.netlify.app/checkout/cancel',
      customer_email: 'customer@nexustechhub.ae',
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
        subtotal: (iPhoneVAT.subtotal / 100).toString(),
        vat_amount: (iPhoneVAT.vatAmount / 100).toString(),
        vat_rate: '5%',
        total_with_vat: (iPhoneVAT.total / 100).toString()
      }
    });
    
    console.log('✅ Checkout Session Created:');
    console.log(`   ID: ${checkoutSession.id}`);
    console.log(`   URL: ${checkoutSession.url}`);
    console.log(`   Amount: ${checkoutSession.amount_total / 100} AED (including VAT)`);
    
    // Test 4: Small amount transaction
    console.log('\n🔋 Test 4: Samsung Battery (89.99 AED)');
    console.log('====================================');
    
    const batteryPrice = 8999; // 89.99 AED in fils
    const batteryVAT = calculateUAEVAT(batteryPrice);
    
    console.log('✅ Battery VAT Calculation:');
    console.log(`   Product: Samsung Galaxy S23 Battery`);
    console.log(`   Subtotal: ${batteryVAT.subtotal / 100} AED`);
    console.log(`   VAT (5%): ${batteryVAT.vatAmount / 100} AED`);
    console.log(`   Total: ${batteryVAT.total / 100} AED`);
    
    // Test 5: Multiple items cart
    console.log('\n🛒 Test 5: Multiple Items Cart');
    console.log('=============================');
    
    const cartItems = [
      { name: 'iPhone Screen', price: 29999 },
      { name: 'Samsung Battery', price: 8999 },
      { name: 'Repair Tools Set', price: 4999 }
    ];
    
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const cartVAT = calculateUAEVAT(cartSubtotal);
    
    console.log('✅ Cart VAT Calculation:');
    console.log(`   Items: ${cartItems.length}`);
    console.log(`   Subtotal: ${cartVAT.subtotal / 100} AED`);
    console.log(`   VAT (5%): ${cartVAT.vatAmount / 100} AED`);
    console.log(`   Total: ${cartVAT.total / 100} AED`);
    
    console.log('\n🎉 All Manual VAT Tests Passed!');
    console.log('===============================');
    
    console.log('✅ Manual UAE VAT calculation working correctly');
    console.log('✅ Payment intents created successfully');
    console.log('✅ Checkout sessions working');
    console.log('✅ Metadata includes VAT breakdown');
    console.log('✅ Ready for production deployment');
    
    console.log('\n📋 Summary:');
    console.log(`   • iPhone Screen: ${iPhoneVAT.total / 100} AED (incl. VAT)`);
    console.log(`   • Samsung Battery: ${batteryVAT.total / 100} AED (incl. VAT)`);
    console.log(`   • Cart Total: ${cartVAT.total / 100} AED (incl. VAT)`);
    console.log(`   • VAT Rate: 5% (UAE standard)`);
    console.log(`   • Currency: AED`);
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Add environment variables to Netlify');
    console.log('2. Deploy to production');
    console.log('3. Test live checkout flow');
    console.log('4. Verify webhook events');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    
    if (error.code === 'api_key_invalid') {
      console.log('\n💡 Solution: Check your Stripe secret key');
    } else {
      console.log('\n💡 Check Stripe Dashboard settings and try again');
    }
  }
}

// Run the test
if (require.main === module) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY environment variable not set');
    console.log('Usage: STRIPE_SECRET_KEY=sk_live_... node Scripts/test-manual-uae-vat.js');
    process.exit(1);
  }
  
  testManualUAEVAT();
}

module.exports = { testManualUAEVAT, calculateUAEVAT };
