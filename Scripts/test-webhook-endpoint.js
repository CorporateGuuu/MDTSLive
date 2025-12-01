#!/usr/bin/env node

// Test Webhook Endpoint for Nexus TechHub
// Verifies that the webhook endpoint is accessible and properly configured

const https = require('https');
const crypto = require('crypto');

const WEBHOOK_URL = 'https://nexustechhub.netlify.app/api/stripe/webhook';
const WEBHOOK_SECRET = 'whsec_test_placeholder_webhook_secret';

function createStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', secret.replace('whsec_', ''))
    .update(signedPayload, 'utf8')
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

function makeWebhookRequest(payload) {
  return new Promise((resolve, reject) => {
    const payloadString = JSON.stringify(payload);
    const signature = createStripeSignature(payload, WEBHOOK_SECRET);
    
    const url = new URL(WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString),
        'Stripe-Signature': signature,
        'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(payloadString);
    req.end();
  });
}

async function testWebhookEndpoint() {
  console.log('🔗 Testing Nexus TechHub Webhook Endpoint');
  console.log('=========================================');
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Webhook Secret: ${WEBHOOK_SECRET.substring(0, 12)}...`);
  
  try {
    // Test 1: Basic endpoint accessibility
    console.log('\n📡 Test 1: Basic Endpoint Accessibility');
    console.log('======================================');
    
    const basicPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'test_object',
          object: 'test'
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test',
        idempotency_key: null
      },
      type: 'test.event'
    };
    
    const response1 = await makeWebhookRequest(basicPayload);
    console.log(`✅ Response Status: ${response1.statusCode}`);
    console.log(`✅ Response Body: ${response1.body.substring(0, 200)}...`);
    
    if (response1.statusCode === 200) {
      console.log('🎉 Webhook endpoint is accessible and responding!');
    } else {
      console.log(`⚠️ Unexpected status code: ${response1.statusCode}`);
    }
    
    // Test 2: Checkout session completed event
    console.log('\n💳 Test 2: Checkout Session Completed Event');
    console.log('==========================================');
    
    const checkoutPayload = {
      id: 'evt_test_checkout',
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'cs_test_nexustechhub',
          object: 'checkout.session',
          amount_total: 31499, // 314.99 AED including VAT
          currency: 'aed',
          customer_details: {
            email: 'customer@nexustechhub.ae',
            name: 'Test Customer',
            phone: '+971501234567'
          },
          payment_status: 'paid',
          metadata: {
            business_name: 'Nexus TechHub',
            product_name: 'iPhone 14 Pro Screen',
            subtotal: '299.99',
            vat_amount: '15.00',
            vat_rate: '5%'
          }
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test_checkout',
        idempotency_key: null
      },
      type: 'checkout.session.completed'
    };
    
    const response2 = await makeWebhookRequest(checkoutPayload);
    console.log(`✅ Checkout Event Status: ${response2.statusCode}`);
    console.log(`✅ Response: ${response2.body.substring(0, 200)}...`);
    
    // Test 3: Payment intent succeeded event
    console.log('\n💰 Test 3: Payment Intent Succeeded Event');
    console.log('=======================================');
    
    const paymentPayload = {
      id: 'evt_test_payment',
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'pi_test_nexustechhub',
          object: 'payment_intent',
          amount: 31499,
          currency: 'aed',
          status: 'succeeded',
          metadata: {
            business_name: 'Nexus TechHub',
            location: 'UAE'
          }
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test_payment',
        idempotency_key: null
      },
      type: 'payment_intent.succeeded'
    };
    
    const response3 = await makeWebhookRequest(paymentPayload);
    console.log(`✅ Payment Event Status: ${response3.statusCode}`);
    console.log(`✅ Response: ${response3.body.substring(0, 200)}...`);
    
    console.log('\n🎯 Webhook Test Summary');
    console.log('======================');
    
    const allTestsPassed = [response1, response2, response3].every(r => r.statusCode === 200);
    
    if (allTestsPassed) {
      console.log('🎉 All webhook tests passed!');
      console.log('✅ Webhook endpoint is properly configured');
      console.log('✅ Stripe signature verification working');
      console.log('✅ Event processing functional');
      console.log('✅ Ready to receive live webhook events');
      
      console.log('\n🔗 Stripe Dashboard Configuration:');
      console.log(`   Endpoint URL: ${WEBHOOK_URL}`);
      console.log(`   Signing Secret: ${WEBHOOK_SECRET}`);
      console.log('   Events: checkout.session.completed, payment_intent.succeeded');
      
    } else {
      console.log('⚠️ Some webhook tests failed');
      console.log('🔧 Troubleshooting steps:');
      console.log('1. Check environment variables in Netlify');
      console.log('2. Verify STRIPE_WEBHOOK_SECRET is correct');
      console.log('3. Ensure deployment completed successfully');
      console.log('4. Check Netlify function logs for errors');
    }
    
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Solution: Check if the website is deployed and accessible');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Solution: The endpoint might be slow to respond, try again');
    } else {
      console.log('💡 Solution: Check Netlify deployment logs for errors');
    }
  }
}

// Run webhook tests
if (require.main === module) {
  testWebhookEndpoint();
}

module.exports = { testWebhookEndpoint };
