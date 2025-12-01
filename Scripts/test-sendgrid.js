#!/usr/bin/env node

// SendGrid Testing Script for Nexus TechHub
// Tests email functionality with UAE business context

const https = require('https');

const SITE_URL = 'https://nexustechhub.netlify.app';
const API_ENDPOINT = `${SITE_URL}/api/sendgrid/send-email`;

function makeAPIRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const url = new URL(API_ENDPOINT);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function testSendGrid() {
  console.log('📧 Testing SendGrid Integration for Nexus TechHub UAE');
  console.log('===================================================');
  console.log(`API Endpoint: ${API_ENDPOINT}`);
  
  const tests = [
    {
      name: 'Configuration Test',
      type: 'test',
      data: {}
    },
    {
      name: 'Order Confirmation Email',
      type: 'order_confirmation',
      data: {
        customerEmail: 'customer@example.com',
        customerName: 'Ahmed Al-Rashid',
        orderId: 'NTH-ORD-001',
        amount: '314.99',
        paymentMethod: 'Credit Card',
        orderDate: new Date().toLocaleDateString('en-AE'),
        items: [
          {
            name: 'iPhone 14 Pro Screen Replacement',
            quantity: 1,
            price: '299.99'
          }
        ],
        deliveryAddress: 'Dubai Marina, Dubai, UAE',
        estimatedDelivery: '2-3 business days'
      }
    },
    {
      name: 'Quote Request Email',
      type: 'quote_request',
      data: {
        customerEmail: 'business@example.com',
        customerName: 'Fatima Al-Zahra',
        phone: '+971501234567',
        device: 'Samsung Galaxy S23 Ultra',
        partsNeeded: 'OLED Display Assembly',
        quantity: '5 units',
        message: 'Need bulk pricing for repair shop',
        requestId: 'NTH-QUO-001',
        requestDate: new Date().toLocaleDateString('en-AE')
      }
    },
    {
      name: 'Contact Form Email',
      type: 'contact_form',
      data: {
        name: 'Mohammed Al-Mansouri',
        email: 'contact@example.com',
        phone: '+971585531029',
        subject: 'iPad Pro Parts Inquiry',
        message: 'Hello, I need original iPad Pro 12.9" 2022 screen replacement. Do you have it in stock? What is the price including VAT?'
      }
    },
    {
      name: 'Custom Business Email',
      type: 'custom',
      data: {
        to: 'admin@nexustechhub.ae',
        subject: 'SendGrid Integration Test - Nexus TechHub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Nexus TechHub</h1>
              <p style="color: white; margin: 5px 0;">SendGrid Integration Test</p>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Integration Test Successful!</h2>
              <p>This email confirms that SendGrid is properly integrated with your Nexus TechHub website.</p>
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #10b981;">Test Details</h3>
                <p><strong>Business:</strong> Nexus TechHub UAE</p>
                <p><strong>Location:</strong> Ras Al Khaimah, UAE</p>
                <p><strong>Phone:</strong> +971 58 553 1029</p>
                <p><strong>WhatsApp:</strong> https://wa.me/971585531029</p>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
              </div>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
                <h3 style="color: #10b981;">Email Features Ready</h3>
                <p>✅ Order confirmations</p>
                <p>✅ Quote requests</p>
                <p>✅ Contact form submissions</p>
                <p>✅ Custom business emails</p>
                <p>✅ UAE VAT calculations</p>
                <p>✅ Professional branding</p>
              </div>
            </div>
          </div>
        `,
        text: 'SendGrid integration test successful for Nexus TechHub UAE'
      }
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  console.log(`\n🧪 Running ${totalTests} SendGrid tests...\n`);

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const response = await makeAPIRequest({
        type: test.type,
        data: test.data
      });
      
      if (response.statusCode === 200 && response.data.success) {
        console.log(`✅ ${test.name} - SUCCESS`);
        if (response.data.data.messageId) {
          console.log(`   Message ID: ${response.data.data.messageId}`);
        }
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
    }
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 SendGrid Test Results:');
  console.log('=========================');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All SendGrid tests passed!');
    console.log('✅ Email service is fully operational');
    console.log('✅ Order confirmations working');
    console.log('✅ Quote requests working');
    console.log('✅ Contact forms working');
    console.log('✅ Custom emails working');
    console.log('✅ UAE business branding applied');
    
    console.log('\n📧 Email Features Available:');
    console.log('• Automatic order confirmations with UAE VAT');
    console.log('• Quote request notifications');
    console.log('• Contact form submissions');
    console.log('• Custom business communications');
    console.log('• Professional HTML templates');
    console.log('• Mobile-optimized email design');
    
  } else {
    console.log('\n⚠️ Some SendGrid tests failed');
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check SENDGRID_API_KEY in environment variables');
    console.log('2. Verify SENDGRID_FROM_EMAIL is configured');
    console.log('3. Ensure SendGrid account is active');
    console.log('4. Check domain authentication in SendGrid');
    console.log('5. Verify API endpoint is deployed correctly');
  }

  console.log('\n📋 SendGrid Setup Requirements:');
  console.log('===============================');
  console.log('Environment Variables Needed:');
  console.log('• SENDGRID_API_KEY=SG.xxx (from SendGrid dashboard)');
  console.log('• SENDGRID_FROM_EMAIL=noreply@nexustechhub.ae');
  console.log('• ADMIN_EMAIL=admin@nexustechhub.ae');
  
  console.log('\n🔗 SendGrid Dashboard:');
  console.log('• Create account: https://sendgrid.com/');
  console.log('• Get API key: Settings > API Keys');
  console.log('• Verify domain: Settings > Sender Authentication');
  console.log('• Monitor emails: Activity > Email Activity');
}

// Run SendGrid tests
if (require.main === module) {
  testSendGrid().catch(console.error);
}

module.exports = { testSendGrid };
