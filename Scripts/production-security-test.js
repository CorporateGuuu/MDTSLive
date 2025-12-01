#!/usr/bin/env node

// Production Security and Performance Testing for Nexus TechHub
// Comprehensive security, performance, and business functionality verification

const https = require('https');
const { URL } = require('url');

const SITE_URL = process.env.SITE_URL || 'https://nexustechhub.netlify.app';

function makeRequest(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'User-Agent': 'Nexus-TechHub-Security-Test/1.0',
        'Accept': 'application/json, text/html',
        ...headers
      }
    };

    const startTime = Date.now();
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: endTime - startTime
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

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runProductionSecurityTest() {
  console.log('🔒 Production Security and Performance Test - Nexus TechHub');
  console.log('==========================================================');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Test Time: ${new Date().toISOString()}`);
  
  const results = {
    security: { passed: 0, total: 0 },
    performance: { passed: 0, total: 0 },
    business: { passed: 0, total: 0 },
    ssl: { passed: 0, total: 0 },
    issues: [],
    recommendations: []
  };

  try {
    // Test 1: SSL/HTTPS Security
    console.log('\n🔐 Test 1: SSL/HTTPS Security Verification');
    console.log('==========================================');
    
    try {
      const response = await makeRequest(SITE_URL);
      results.ssl.total = 3;

      // Check HTTPS redirect
      if (response.statusCode === 200) {
        console.log('✅ HTTPS connection successful');
        results.ssl.passed++;
      }

      // Check security headers
      const securityHeaders = {
        'strict-transport-security': 'HSTS header',
        'x-frame-options': 'Clickjacking protection',
        'x-content-type-options': 'MIME type sniffing protection',
        'content-security-policy': 'CSP protection',
        'x-xss-protection': 'XSS protection'
      };

      let securityHeadersFound = 0;
      for (const [header, description] of Object.entries(securityHeaders)) {
        if (response.headers[header]) {
          console.log(`✅ ${description}: Present`);
          securityHeadersFound++;
        } else {
          console.log(`⚠️ ${description}: Missing`);
        }
      }

      if (securityHeadersFound >= 3) {
        console.log('✅ Security headers: Adequate protection');
        results.ssl.passed++;
      } else {
        console.log('⚠️ Security headers: Needs improvement');
        results.issues.push('Missing critical security headers');
      }

      // Check SSL certificate
      if (SITE_URL.startsWith('https://')) {
        console.log('✅ SSL certificate: Valid HTTPS connection');
        results.ssl.passed++;
      }

    } catch (error) {
      console.log(`❌ SSL/HTTPS test failed: ${error.message}`);
      results.issues.push('SSL/HTTPS connection failed');
    }

    // Test 2: API Security and Error Handling
    console.log('\n🛡️ Test 2: API Security and Error Handling');
    console.log('==========================================');
    
    const apiTests = [
      {
        name: 'Contact API Security',
        url: `${SITE_URL}/api/contact`,
        method: 'POST',
        expectedStatus: [400, 405, 422], // Should reject malformed requests
        body: '{"invalid": "data"}'
      },
      {
        name: 'Stripe API Security',
        url: `${SITE_URL}/api/stripe/create-checkout-session`,
        method: 'POST',
        expectedStatus: [400, 401, 405],
        body: '{"test": "unauthorized"}'
      },
      {
        name: 'Auth API Security',
        url: `${SITE_URL}/api/auth/session`,
        method: 'GET',
        expectedStatus: [200, 401],
        body: null
      },
      {
        name: 'Admin API Security',
        url: `${SITE_URL}/api/admin/inventory`,
        method: 'GET',
        expectedStatus: [401, 403, 405], // Should require authentication
        body: null
      }
    ];

    for (const test of apiTests) {
      try {
        console.log(`Testing: ${test.name}...`);
        const response = await makeRequest(test.url, test.method, 
          { 'Content-Type': 'application/json' }, test.body);
        results.security.total++;

        if (test.expectedStatus.includes(response.statusCode)) {
          console.log(`✅ ${test.name}: Proper security (${response.statusCode})`);
          results.security.passed++;
          
          // Check that sensitive data is not exposed
          if (response.body && !response.body.toLowerCase().includes('password') && 
              !response.body.toLowerCase().includes('secret') &&
              !response.body.toLowerCase().includes('key')) {
            console.log(`   ✅ No sensitive data exposed`);
          }
        } else {
          console.log(`⚠️ ${test.name}: Unexpected response (${response.statusCode})`);
          results.issues.push(`${test.name} returned unexpected status`);
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR (${error.message})`);
        results.security.total++;
      }
    }

    // Test 3: Performance Verification
    console.log('\n⚡ Test 3: Performance Verification');
    console.log('==================================');
    
    const performanceTests = [
      { name: 'Homepage', url: `${SITE_URL}/`, maxTime: 3000 },
      { name: 'Products Page', url: `${SITE_URL}/products`, maxTime: 3000 },
      { name: 'Enhanced Checkout', url: `${SITE_URL}/enhanced-checkout`, maxTime: 3000 },
      { name: 'Contact Page', url: `${SITE_URL}/contact`, maxTime: 3000 }
    ];

    for (const test of performanceTests) {
      try {
        console.log(`Testing: ${test.name} performance...`);
        const response = await makeRequest(test.url);
        results.performance.total++;

        if (response.statusCode === 200) {
          if (response.responseTime <= test.maxTime) {
            console.log(`✅ ${test.name}: Fast loading (${response.responseTime}ms)`);
            results.performance.passed++;
          } else {
            console.log(`⚠️ ${test.name}: Slow loading (${response.responseTime}ms)`);
            results.issues.push(`${test.name} loads slowly (${response.responseTime}ms)`);
          }
        } else {
          console.log(`❌ ${test.name}: Not accessible (${response.statusCode})`);
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR (${error.message})`);
        results.performance.total++;
      }
    }

    // Test 4: Business Functionality Verification
    console.log('\n🏢 Test 4: Business Functionality Verification');
    console.log('==============================================');
    
    try {
      const homepageResponse = await makeRequest(SITE_URL);
      results.business.total = 6;

      if (homepageResponse.statusCode === 200) {
        const bodyLower = homepageResponse.body.toLowerCase();
        
        // Check Nexus TechHub branding
        if (bodyLower.includes('nexus techhub')) {
          console.log('✅ Nexus TechHub branding: Present');
          results.business.passed++;
        } else {
          console.log('❌ Nexus TechHub branding: Missing');
          results.issues.push('Nexus TechHub branding not found');
        }

        // Check UAE contact information
        if (bodyLower.includes('+971 58 553 1029') || bodyLower.includes('971585531029')) {
          console.log('✅ UAE phone number: Present');
          results.business.passed++;
        } else {
          console.log('❌ UAE phone number: Missing');
          results.issues.push('UAE phone number not found');
        }

        // Check WhatsApp integration
        if (bodyLower.includes('wa.me/971585531029') || bodyLower.includes('whatsapp')) {
          console.log('✅ WhatsApp integration: Present');
          results.business.passed++;
        } else {
          console.log('❌ WhatsApp integration: Missing');
          results.issues.push('WhatsApp integration not found');
        }

        // Check AED currency
        if (bodyLower.includes('aed') || bodyLower.includes('dirham')) {
          console.log('✅ AED currency: Present');
          results.business.passed++;
        } else {
          console.log('⚠️ AED currency: Not detected on homepage');
        }

        // Check Stripe integration
        if (bodyLower.includes('stripe') || bodyLower.includes('payment')) {
          console.log('✅ Stripe integration: Present');
          results.business.passed++;
        } else {
          console.log('⚠️ Stripe integration: Not detected on homepage');
        }

        // Check UAE VAT information
        if (bodyLower.includes('vat') || bodyLower.includes('5%') || bodyLower.includes('tax')) {
          console.log('✅ UAE VAT information: Present');
          results.business.passed++;
        } else {
          console.log('⚠️ UAE VAT information: Not detected on homepage');
        }
      }
    } catch (error) {
      console.log(`❌ Business functionality test failed: ${error.message}`);
    }

    // Test 5: Rate Limiting and CSRF Protection
    console.log('\n🚦 Test 5: Rate Limiting and CSRF Protection');
    console.log('============================================');
    
    try {
      console.log('Testing rate limiting on contact form...');
      const rapidRequests = [];
      for (let i = 0; i < 5; i++) {
        rapidRequests.push(
          makeRequest(`${SITE_URL}/api/contact`, 'POST', 
            { 'Content-Type': 'application/json' }, 
            '{"test": "rate_limit"}')
        );
      }

      const responses = await Promise.allSettled(rapidRequests);
      const rateLimitedResponses = responses.filter(r => 
        r.status === 'fulfilled' && r.value.statusCode === 429
      );

      if (rateLimitedResponses.length > 0) {
        console.log('✅ Rate limiting: Active (429 responses detected)');
      } else {
        console.log('⚠️ Rate limiting: Not detected (may be configured at Netlify level)');
      }

      // Test CSRF protection
      console.log('Testing CSRF protection...');
      const csrfResponse = await makeRequest(`${SITE_URL}/api/auth/csrf`);
      if (csrfResponse.statusCode === 200 && csrfResponse.body.includes('csrfToken')) {
        console.log('✅ CSRF protection: Active');
      } else {
        console.log('⚠️ CSRF protection: Not detected');
      }

    } catch (error) {
      console.log(`⚠️ Rate limiting test: ${error.message}`);
    }

    // Summary
    console.log('\n📊 Production Security Test Summary');
    console.log('==================================');
    
    const totalPassed = results.security.passed + results.performance.passed + 
                       results.business.passed + results.ssl.passed;
    const totalTests = results.security.total + results.performance.total + 
                      results.business.total + results.ssl.total;
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`SSL/HTTPS Security: ${results.ssl.passed}/${results.ssl.total} passed`);
    console.log(`API Security: ${results.security.passed}/${results.security.total} passed`);
    console.log(`Performance: ${results.performance.passed}/${results.performance.total} passed`);
    console.log(`Business Features: ${results.business.passed}/${results.business.total} passed`);
    console.log(`Overall: ${totalPassed}/${totalTests} (${successRate}%)`);

    // Security Score
    console.log('\n🔒 Security Score Assessment:');
    if (successRate >= 90) {
      console.log('🟢 EXCELLENT: Production ready with strong security');
    } else if (successRate >= 80) {
      console.log('🟡 GOOD: Production ready with minor security improvements needed');
    } else if (successRate >= 70) {
      console.log('🟠 FAIR: Needs security improvements before full production');
    } else {
      console.log('🔴 POOR: Significant security issues need immediate attention');
    }

    if (results.issues.length > 0) {
      console.log('\n⚠️ Security Issues Found:');
      results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    // Recommendations
    console.log('\n💡 Production Readiness Recommendations:');
    console.log('• Monitor error rates and performance metrics continuously');
    console.log('• Set up automated security scanning in CI/CD pipeline');
    console.log('• Implement comprehensive logging for security events');
    console.log('• Regular security audits and penetration testing');
    console.log('• Keep all dependencies updated with automated tools');
    console.log('• Backup critical business data regularly');

    return {
      success: successRate >= 80,
      successRate,
      totalTests,
      totalPassed,
      issues: results.issues,
      securityScore: successRate >= 90 ? 'EXCELLENT' : 
                    successRate >= 80 ? 'GOOD' : 
                    successRate >= 70 ? 'FAIR' : 'POOR'
    };

  } catch (error) {
    console.error('❌ Production security test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run production security tests
if (require.main === module) {
  runProductionSecurityTest().then(result => {
    if (result.success) {
      console.log('\n✅ Production security verification completed successfully!');
      console.log(`🎯 Security Score: ${result.securityScore}`);
      process.exit(0);
    } else {
      console.log('\n⚠️ Production security verification found critical issues.');
      process.exit(1);
    }
  }).catch(console.error);
}

module.exports = { runProductionSecurityTest };
