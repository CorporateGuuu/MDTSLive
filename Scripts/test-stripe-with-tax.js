#!/usr/bin/env node

// Test Stripe with UAE Tax Configuration
// Run this AFTER enabling Stripe Tax in your dashboard

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeWithTax() {
  console.log('🇦🇪 Testing Stripe with UAE Tax Configuration');
  console.log('==============================================');
  
  try {
    // Test 1: Create tax calculation with UAE address
    console.log('\n📊 Test 1: UAE Tax Calculation (After enabling Stripe Tax)...');
    
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
          reference: 'NTH-IPHONE-SCREEN-001',
          tax_code: 'txcd_99999999' // General goods
        }
      ]
    });
    
    console.log('✅ Tax Calculation Results:');
    console.log(`   ID: ${taxCalculation.id}`);
    console.log(`   Subtotal: ${(taxCalculation.amount_total - taxCalculation.tax_amount_exclusive) / 100} AED`);
    console.log(`   Tax Amount: ${taxCalculation.tax_amount_exclusive / 100} AED`);
    console.log(`   Total: ${taxCalculation.amount_total / 100} AED`);
    console.log(`   Tax Rate: ${(taxCalculation.tax_amount_exclusive / (taxCalculation.amount_total - taxCalculation.tax_amount_exclusive) * 100).toFixed(2)}%`);
    
    // Check if tax is calculated correctly
    const expectedTaxRate = 5.0; // 5% UAE VAT
    const actualTaxRate = (taxCalculation.tax_amount_exclusive / (taxCalculation.amount_total - taxCalculation.tax_amount_exclusive) * 100);
    
    if (Math.abs(actualTaxRate - expectedTaxRate) < 0.1) {
      console.log('🎉 UAE VAT (5%) is working correctly!');
    } else if (taxCalculation.tax_amount_exclusive === 0) {
      console.log('⚠️ Tax amount is 0 - Stripe Tax may not be enabled yet');
      console.log('💡 Go to https://dashboard.stripe.com/settings/tax and enable Stripe Tax');
    } else {
      console.log(`⚠️ Unexpected tax rate: ${actualTaxRate.toFixed(2)}%`);
    }
    
    // Test 2: Create checkout session with tax
    console.log('\n🛒 Test 2: Checkout Session with Tax...');
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'iPhone 14 Pro Screen Replacement',
              description: 'High-quality OLED screen replacement',
            },
            unit_amount: 29999, // 299.99 AED
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://nexustechhub.netlify.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://nexustechhub.netlify.app/checkout/cancel',
      customer_email: 'test@nexustechhub.ae',
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AE'],
      },
      automatic_tax: {
        enabled: true, // This enables automatic tax calculation
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
    console.log(`   Automatic Tax: ${checkoutSession.automatic_tax?.enabled ? 'Enabled' : 'Disabled'}`);
    
    // Test 3: Small amount transaction (typical mobile part)
    console.log('\n📱 Test 3: Small Amount Transaction (50 AED)...');
    
    const smallTaxCalc = await stripe.tax.calculations.create({
      currency: 'aed',
      customer_details: {
        address: {
          country: 'AE',
          state: 'Dubai',
          city: 'Dubai',
          postal_code: '12345',
          line1: 'Sheikh Zayed Road'
        },
        address_source: 'billing'
      },
      line_items: [
        {
          amount: 5000, // 50 AED
          reference: 'NTH-BATTERY-001',
          tax_code: 'txcd_99999999'
        }
      ]
    });
    
    console.log('✅ Small Amount Results:');
    console.log(`   Subtotal: ${(smallTaxCalc.amount_total - smallTaxCalc.tax_amount_exclusive) / 100} AED`);
    console.log(`   Tax: ${smallTaxCalc.tax_amount_exclusive / 100} AED`);
    console.log(`   Total: ${smallTaxCalc.amount_total / 100} AED`);
    
    console.log('\n🎯 Summary:');
    console.log('===========');
    
    if (taxCalculation.tax_amount_exclusive > 0) {
      console.log('✅ Stripe Tax is working correctly');
      console.log('✅ UAE VAT (5%) is being calculated');
      console.log('✅ Ready for production deployment');
      console.log('\n🚀 Next Steps:');
      console.log('1. Add environment variables to Netlify');
      console.log('2. Deploy to production');
      console.log('3. Test live payment flow');
    } else {
      console.log('⚠️ Stripe Tax is not calculating VAT');
      console.log('💡 Action Required:');
      console.log('1. Go to https://dashboard.stripe.com/settings/tax');
      console.log('2. Click "Enable Stripe Tax"');
      console.log('3. Configure for UAE with 5% VAT rate');
      console.log('4. Run this test again');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    
    if (error.code === 'api_key_invalid') {
      console.log('\n💡 Solution: Check your Stripe secret key');
    } else if (error.code === 'tax_calculation_invalid') {
      console.log('\n💡 Solution: Enable Stripe Tax in your dashboard');
    } else {
      console.log('\n💡 Check Stripe Dashboard settings and try again');
    }
  }
}

// Run the test
if (require.main === module) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY environment variable not set');
    console.log('Usage: STRIPE_SECRET_KEY=sk_live_... node Scripts/test-stripe-with-tax.js');
    process.exit(1);
  }
  
  testStripeWithTax();
}

module.exports = { testStripeWithTax };
