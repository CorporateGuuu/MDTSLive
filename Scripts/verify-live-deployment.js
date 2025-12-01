#!/usr/bin/env node

// Live Deployment Verification Script for Nexus TechHub
// Verifies that the website is working correctly with live Stripe integration

const https = require('https');
const { URL } = require('url');

const SITE_URL = 'https://nexustechhub.netlify.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Nexus-TechHub-Verification/1.0'
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

    req.end();
  });
}

async function verifyLiveDeployment() {
  console.log('🚀 Verifying Nexus TechHub Live Deployment');
  console.log('==========================================');
  console.log(`Site URL: ${SITE_URL}`);
  
  const tests = [
    {
      name: 'Homepage Load',
      url: `${SITE_URL}/`,
      check: (response) => response.statusCode === 200 && response.body.includes('Nexus TechHub')
    },
    {
      name: 'iPhone Parts Page',
      url: `${SITE_URL}/iphone-parts`,
      check: (response) => response.statusCode === 200 && response.body.includes('iPhone')
    },
    {
      name: 'Samsung Parts Page',
      url: `${SITE_URL}/samsung-parts`,
      check: (response) => response.statusCode === 200 && response.body.includes('Samsung')
    },
    {
      name: 'iPad Parts Page',
      url: `${SITE_URL}/ipad-parts`,
      check: (response) => response.statusCode === 200 && response.body.includes('iPad')
    },
    {
      name: 'Repair Tools Page',
      url: `${SITE_URL}/repair-tools`,
      check: (response) => response.statusCode === 200 && response.body.includes('Tools')
    },
    {
      name: 'LCD Buyback Page',
      url: `${SITE_URL}/lcd-buyback`,
      check: (response) => response.statusCode === 200 && response.body.includes('Buyback')
    },
    {
      name: 'Contact Page',
      url: `${SITE_URL}/contact`,
      check: (response) => response.statusCode === 200 && response.body.includes('+971 58 553 1029')
    },
    {
      name: 'Enhanced Checkout',
      url: `${SITE_URL}/enhanced-checkout`,
      check: (response) => response.statusCode === 200 && response.body.includes('Stripe')
    },
    {
      name: 'Manifest.json (PWA)',
      url: `${SITE_URL}/manifest.json`,
      check: (response) => response.statusCode === 200 && response.body.includes('Nexus TechHub')
    },
    {
      name: 'Sitemap.xml (SEO)',
      url: `${SITE_URL}/sitemap.xml`,
      check: (response) => response.statusCode === 200 && response.body.includes('<?xml')
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  console.log(`\n🧪 Running ${totalTests} verification tests...\n`);

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await makeRequest(test.url);
      
      if (test.check(response)) {
        console.log(`✅ ${test.name} - PASS`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - FAIL (Status: ${response.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
    }
  }

  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your website is live and working correctly.');
    console.log('\n✅ Next Steps:');
    console.log('1. Test the Stripe checkout process manually');
    console.log('2. Verify WhatsApp contact button works');
    console.log('3. Check mobile responsiveness');
    console.log('4. Test search functionality');
    console.log('5. Announce your launch! 🚀');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the issues above.');
    console.log('\n🔧 Common Solutions:');
    console.log('- Wait a few minutes for deployment to complete');
    console.log('- Check environment variables in Netlify');
    console.log('- Verify build completed successfully');
    console.log('- Check for any build errors in Netlify logs');
  }

  // Additional checks
  console.log('\n🔍 Additional Checks:');
  console.log('====================');
  
  try {
    const homepageResponse = await makeRequest(`${SITE_URL}/`);
    
    // Check for Stripe integration
    if (homepageResponse.body.includes('pk_live_') || homepageResponse.body.includes('stripe')) {
      console.log('✅ Stripe integration detected');
    } else {
      console.log('⚠️ Stripe integration not detected in homepage');
    }
    
    // Check for UAE branding
    if (homepageResponse.body.includes('AED') || homepageResponse.body.includes('UAE')) {
      console.log('✅ UAE market optimization detected');
    } else {
      console.log('⚠️ UAE market optimization not detected');
    }
    
    // Check for contact information
    if (homepageResponse.body.includes('+971 58 553 1029')) {
      console.log('✅ Correct phone number found');
    } else {
      console.log('⚠️ Phone number not found or incorrect');
    }
    
    // Check for WhatsApp integration
    if (homepageResponse.body.includes('wa.me/971585531029')) {
      console.log('✅ WhatsApp integration found');
    } else {
      console.log('⚠️ WhatsApp integration not found');
    }
    
  } catch (error) {
    console.log('❌ Could not perform additional checks:', error.message);
  }

  console.log('\n📞 Support Information:');
  console.log('======================');
  console.log('Business Phone: +971 58 553 1029');
  console.log('WhatsApp: https://wa.me/971585531029');
  console.log('Email: admin@nexustechhub.ae');
  console.log('Location: Ras Al Khaimah, UAE');
}

// Run verification
if (require.main === module) {
  verifyLiveDeployment().catch(console.error);
}

module.exports = { verifyLiveDeployment };
