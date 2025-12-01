#!/usr/bin/env node

// Comprehensive Site Check for Nexus TechHub
// Verifies all critical functionality is working

const https = require('https');
const { URL } = require('url');

const SITE_URL = 'https://nexustechhub.netlify.app';

function makeRequest(url, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'User-Agent': 'Nexus-TechHub-Verification/1.0',
        ...headers
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

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function comprehensiveSiteCheck() {
  console.log('🔍 Comprehensive Nexus TechHub Site Check');
  console.log('=========================================');
  console.log(`Site URL: ${SITE_URL}`);
  
  const results = {
    pages: { passed: 0, total: 0 },
    api: { passed: 0, total: 0 },
    features: { passed: 0, total: 0 },
    issues: []
  };
  
  try {
    // Test 1: Critical Pages
    console.log('\n📄 Test 1: Critical Pages Accessibility');
    console.log('=======================================');
    
    const criticalPages = [
      { name: 'Homepage', url: '/' },
      { name: 'iPhone Parts', url: '/iphone-parts' },
      { name: 'Samsung Parts', url: '/samsung-parts' },
      { name: 'iPad Parts', url: '/ipad-parts' },
      { name: 'Repair Tools', url: '/repair-tools' },
      { name: 'LCD Buyback', url: '/lcd-buyback' },
      { name: 'Contact', url: '/contact' },
      { name: 'Enhanced Checkout', url: '/enhanced-checkout' }
    ];
    
    for (const page of criticalPages) {
      try {
        const response = await makeRequest(`${SITE_URL}${page.url}`);
        results.pages.total++;
        
        if (response.statusCode === 200) {
          console.log(`✅ ${page.name}: OK (${response.statusCode})`);
          results.pages.passed++;
        } else {
          console.log(`❌ ${page.name}: FAIL (${response.statusCode})`);
          results.issues.push(`${page.name} returned status ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${page.name}: ERROR (${error.message})`);
        results.issues.push(`${page.name} failed: ${error.message}`);
        results.pages.total++;
      }
    }
    
    // Test 2: API Endpoints
    console.log('\n🔌 Test 2: API Endpoints');
    console.log('========================');
    
    const apiEndpoints = [
      { name: 'Stripe Webhook', url: '/api/stripe/webhook', method: 'POST' },
      { name: 'Contact API', url: '/api/contact', method: 'POST' },
      { name: 'Products API', url: '/api/products', method: 'GET' },
      { name: 'Search API', url: '/api/search', method: 'GET' }
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await makeRequest(`${SITE_URL}${endpoint.url}`, endpoint.method);
        results.api.total++;
        
        // For API endpoints, 404 might be expected for some, 405 for wrong method is OK
        if ([200, 201, 405, 422].includes(response.statusCode)) {
          console.log(`✅ ${endpoint.name}: OK (${response.statusCode})`);
          results.api.passed++;
        } else if (response.statusCode === 404) {
          console.log(`⚠️ ${endpoint.name}: Not Found (404) - May need environment variables`);
          results.issues.push(`${endpoint.name} not found - check deployment`);
        } else {
          console.log(`❌ ${endpoint.name}: FAIL (${response.statusCode})`);
          results.issues.push(`${endpoint.name} returned status ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ERROR (${error.message})`);
        results.issues.push(`${endpoint.name} failed: ${error.message}`);
        results.api.total++;
      }
    }
    
    // Test 3: Content and Features Check
    console.log('\n🎯 Test 3: Content and Features');
    console.log('===============================');
    
    try {
      const homepageResponse = await makeRequest(`${SITE_URL}/`);
      results.features.total += 6;
      
      // Check for Nexus TechHub branding
      if (homepageResponse.body.includes('Nexus TechHub')) {
        console.log('✅ Nexus TechHub branding: Found');
        results.features.passed++;
      } else {
        console.log('❌ Nexus TechHub branding: Missing');
        results.issues.push('Nexus TechHub branding not found on homepage');
      }
      
      // Check for UAE phone number
      if (homepageResponse.body.includes('+971 58 553 1029') || homepageResponse.body.includes('+971585531029')) {
        console.log('✅ UAE phone number: Found');
        results.features.passed++;
      } else {
        console.log('❌ UAE phone number: Missing');
        results.issues.push('UAE phone number not found');
      }
      
      // Check for WhatsApp integration
      if (homepageResponse.body.includes('wa.me/971585531029') || homepageResponse.body.includes('whatsapp')) {
        console.log('✅ WhatsApp integration: Found');
        results.features.passed++;
      } else {
        console.log('❌ WhatsApp integration: Missing');
        results.issues.push('WhatsApp integration not found');
      }
      
      // Check for AED currency
      if (homepageResponse.body.includes('AED') || homepageResponse.body.includes('Dirham')) {
        console.log('✅ AED currency: Found');
        results.features.passed++;
      } else {
        console.log('❌ AED currency: Missing');
        results.issues.push('AED currency not found');
      }
      
      // Check for Stripe integration
      if (homepageResponse.body.includes('stripe') || homepageResponse.body.includes('pk_live_')) {
        console.log('✅ Stripe integration: Detected');
        results.features.passed++;
      } else {
        console.log('❌ Stripe integration: Not detected');
        results.issues.push('Stripe integration not detected');
      }
      
      // Check for mobile responsiveness indicators
      if (homepageResponse.body.includes('viewport') && homepageResponse.body.includes('mobile')) {
        console.log('✅ Mobile responsiveness: Configured');
        results.features.passed++;
      } else {
        console.log('⚠️ Mobile responsiveness: Check needed');
        results.issues.push('Mobile responsiveness indicators not clear');
      }
      
    } catch (error) {
      console.log('❌ Content check failed:', error.message);
      results.issues.push(`Content check failed: ${error.message}`);
    }
    
    // Test 4: PWA and SEO Files
    console.log('\n📱 Test 4: PWA and SEO Files');
    console.log('============================');
    
    const seoFiles = [
      { name: 'Manifest.json', url: '/manifest.json' },
      { name: 'Sitemap.xml', url: '/sitemap.xml' },
      { name: 'Robots.txt', url: '/robots.txt' }
    ];
    
    for (const file of seoFiles) {
      try {
        const response = await makeRequest(`${SITE_URL}${file.url}`);
        if (response.statusCode === 200) {
          console.log(`✅ ${file.name}: Available`);
        } else {
          console.log(`❌ ${file.name}: Missing (${response.statusCode})`);
          results.issues.push(`${file.name} not available`);
        }
      } catch (error) {
        console.log(`❌ ${file.name}: ERROR (${error.message})`);
        results.issues.push(`${file.name} failed: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Comprehensive Check Summary');
    console.log('==============================');
    
    const totalPassed = results.pages.passed + results.api.passed + results.features.passed;
    const totalTests = results.pages.total + results.api.total + results.features.total;
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`Pages: ${results.pages.passed}/${results.pages.total} passed`);
    console.log(`APIs: ${results.api.passed}/${results.api.total} passed`);
    console.log(`Features: ${results.features.passed}/${results.features.total} passed`);
    console.log(`Overall: ${totalPassed}/${totalTests} (${successRate}%)`);
    
    if (results.issues.length > 0) {
      console.log('\n⚠️ Issues Found:');
      results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
      
      console.log('\n🔧 Recommended Actions:');
      if (results.issues.some(issue => issue.includes('404') || issue.includes('not found'))) {
        console.log('1. Add environment variables to Netlify dashboard');
        console.log('2. Trigger a new deployment');
        console.log('3. Check Netlify build logs for errors');
      }
      if (results.issues.some(issue => issue.includes('Stripe'))) {
        console.log('4. Verify Stripe environment variables are set');
        console.log('5. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is configured');
      }
      if (results.issues.some(issue => issue.includes('phone') || issue.includes('WhatsApp'))) {
        console.log('6. Verify business contact information is configured');
        console.log('7. Check BUSINESS_PHONE and BUSINESS_WHATSAPP variables');
      }
    } else {
      console.log('\n🎉 All checks passed! Website is fully operational.');
    }
    
    return {
      success: successRate >= 80,
      successRate,
      issues: results.issues,
      totalTests,
      totalPassed
    };
    
  } catch (error) {
    console.error('❌ Comprehensive check failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run comprehensive check
if (require.main === module) {
  comprehensiveSiteCheck().then(result => {
    if (result.success) {
      console.log('\n✅ Site verification completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Site verification found issues that need attention.');
      process.exit(1);
    }
  }).catch(console.error);
}

module.exports = { comprehensiveSiteCheck };
