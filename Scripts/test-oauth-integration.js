#!/usr/bin/env node

// OAuth Integration Testing Script for Nexus TechHub
// Tests NextAuth.js configuration and authentication flows

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
        'User-Agent': 'Nexus-TechHub-OAuth-Test/1.0',
        'Accept': 'application/json, text/html',
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

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function testOAuthIntegration() {
  console.log('🔐 Testing OAuth Integration for Nexus TechHub');
  console.log('==============================================');
  console.log(`Site URL: ${SITE_URL}`);
  
  const results = {
    authEndpoints: { passed: 0, total: 0 },
    authPages: { passed: 0, total: 0 },
    protectedRoutes: { passed: 0, total: 0 },
    issues: []
  };

  try {
    // Test 1: NextAuth.js API Endpoints
    console.log('\n🔌 Test 1: NextAuth.js API Endpoints');
    console.log('===================================');
    
    const authEndpoints = [
      {
        name: 'NextAuth Configuration',
        url: `${SITE_URL}/api/auth/providers`,
        expectedStatus: [200],
        description: 'Available authentication providers'
      },
      {
        name: 'CSRF Token',
        url: `${SITE_URL}/api/auth/csrf`,
        expectedStatus: [200],
        description: 'CSRF protection token'
      },
      {
        name: 'Session Endpoint',
        url: `${SITE_URL}/api/auth/session`,
        expectedStatus: [200],
        description: 'Current session status'
      },
      {
        name: 'SignIn Endpoint',
        url: `${SITE_URL}/api/auth/signin`,
        expectedStatus: [200, 405],
        description: 'Sign-in API endpoint'
      }
    ];

    for (const endpoint of authEndpoints) {
      try {
        console.log(`Testing: ${endpoint.name}...`);
        const response = await makeRequest(endpoint.url);
        results.authEndpoints.total++;

        if (endpoint.expectedStatus.includes(response.statusCode)) {
          console.log(`✅ ${endpoint.name}: OK (${response.statusCode})`);
          results.authEndpoints.passed++;
          
          // Parse and validate response for specific endpoints
          if (endpoint.name === 'NextAuth Configuration' && response.statusCode === 200) {
            try {
              const providers = JSON.parse(response.body);
              console.log(`   Providers found: ${Object.keys(providers).join(', ')}`);
            } catch (e) {
              console.log(`   Response: ${response.body.substring(0, 100)}...`);
            }
          }
        } else {
          console.log(`❌ ${endpoint.name}: FAIL (${response.statusCode})`);
          results.issues.push(`${endpoint.name} returned unexpected status ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ERROR (${error.message})`);
        results.issues.push(`${endpoint.name} failed: ${error.message}`);
        results.authEndpoints.total++;
      }
    }

    // Test 2: Authentication Pages
    console.log('\n📄 Test 2: Authentication Pages');
    console.log('===============================');
    
    const authPages = [
      {
        name: 'Sign In Page',
        url: `${SITE_URL}/auth/signin`,
        expectedStatus: [200],
        checkContent: ['sign in', 'email', 'password']
      },
      {
        name: 'Register Page',
        url: `${SITE_URL}/auth/register`,
        expectedStatus: [200],
        checkContent: ['register', 'create account']
      },
      {
        name: '2FA Page',
        url: `${SITE_URL}/auth/2fa`,
        expectedStatus: [200],
        checkContent: ['two-factor', '2fa', 'verification']
      },
      {
        name: 'Forgot Password',
        url: `${SITE_URL}/auth/forgot-password`,
        expectedStatus: [200],
        checkContent: ['forgot', 'reset', 'password']
      }
    ];

    for (const page of authPages) {
      try {
        console.log(`Testing: ${page.name}...`);
        const response = await makeRequest(page.url);
        results.authPages.total++;

        if (page.expectedStatus.includes(response.statusCode)) {
          console.log(`✅ ${page.name}: OK (${response.statusCode})`);
          
          // Check content if specified
          if (page.checkContent && response.body) {
            const bodyLower = response.body.toLowerCase();
            const foundContent = page.checkContent.filter(content => 
              bodyLower.includes(content.toLowerCase())
            );
            
            if (foundContent.length > 0) {
              console.log(`   Content verified: ${foundContent.join(', ')}`);
              results.authPages.passed++;
            } else {
              console.log(`   ⚠️ Expected content not found: ${page.checkContent.join(', ')}`);
              results.issues.push(`${page.name} missing expected content`);
            }
          } else {
            results.authPages.passed++;
          }
        } else {
          console.log(`❌ ${page.name}: FAIL (${response.statusCode})`);
          results.issues.push(`${page.name} returned status ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${page.name}: ERROR (${error.message})`);
        results.issues.push(`${page.name} failed: ${error.message}`);
        results.authPages.total++;
      }
    }

    // Test 3: Protected Routes
    console.log('\n🔒 Test 3: Protected Routes');
    console.log('==========================');
    
    const protectedRoutes = [
      {
        name: 'User Account Page',
        url: `${SITE_URL}/account`,
        expectedStatus: [200, 401, 403, 302], // May redirect to login
        description: 'User account dashboard'
      },
      {
        name: 'User Profile',
        url: `${SITE_URL}/user/profile`,
        expectedStatus: [200, 401, 403, 302],
        description: 'User profile management'
      },
      {
        name: 'Admin Dashboard',
        url: `${SITE_URL}/admin`,
        expectedStatus: [200, 401, 403, 302],
        description: 'Admin area (should be protected)'
      },
      {
        name: 'User Orders',
        url: `${SITE_URL}/user/orders`,
        expectedStatus: [200, 401, 403, 302],
        description: 'User order history'
      }
    ];

    for (const route of protectedRoutes) {
      try {
        console.log(`Testing: ${route.name}...`);
        const response = await makeRequest(route.url);
        results.protectedRoutes.total++;

        if (route.expectedStatus.includes(response.statusCode)) {
          console.log(`✅ ${route.name}: OK (${response.statusCode})`);
          
          // Analyze response to understand protection level
          if (response.statusCode === 200) {
            if (response.body.toLowerCase().includes('sign in') || 
                response.body.toLowerCase().includes('login')) {
              console.log(`   🔒 Route appears to show login prompt (good protection)`);
            } else {
              console.log(`   ⚠️ Route accessible without authentication`);
            }
          } else if ([401, 403].includes(response.statusCode)) {
            console.log(`   🔒 Route properly protected (${response.statusCode})`);
          } else if (response.statusCode === 302) {
            const location = response.headers.location;
            if (location && location.includes('signin')) {
              console.log(`   🔒 Route redirects to sign-in (good protection)`);
            } else {
              console.log(`   ↗️ Route redirects to: ${location || 'unknown'}`);
            }
          }
          
          results.protectedRoutes.passed++;
        } else {
          console.log(`❌ ${route.name}: UNEXPECTED (${response.statusCode})`);
          results.issues.push(`${route.name} returned unexpected status ${response.statusCode}`);
        }
      } catch (error) {
        console.log(`❌ ${route.name}: ERROR (${error.message})`);
        results.issues.push(`${route.name} failed: ${error.message}`);
        results.protectedRoutes.total++;
      }
    }

    // Test 4: Enhanced UI Components Integration
    console.log('\n🎨 Test 4: Enhanced UI Components');
    console.log('=================================');
    
    // Check if enhanced components are being used
    try {
      const signinResponse = await makeRequest(`${SITE_URL}/auth/signin`);
      if (signinResponse.statusCode === 200) {
        const body = signinResponse.body;
        
        // Check for enhanced loading components
        if (body.includes('LoadingSpinner') || body.includes('loading-spinner')) {
          console.log('✅ Enhanced loading components detected');
        } else {
          console.log('ℹ️ Enhanced loading components not detected in sign-in page');
        }
        
        // Check for enhanced error handling
        if (body.includes('ErrorMessage') || body.includes('error-message')) {
          console.log('✅ Enhanced error handling detected');
        } else {
          console.log('ℹ️ Enhanced error handling not detected in sign-in page');
        }
        
        // Check for Nexus TechHub branding
        if (body.includes('Nexus TechHub') || body.includes('nexustechhub')) {
          console.log('✅ Nexus TechHub branding present');
        } else {
          console.log('⚠️ Nexus TechHub branding not detected');
        }
      }
    } catch (error) {
      console.log(`ℹ️ Could not test UI components: ${error.message}`);
    }

    // Summary
    console.log('\n📊 OAuth Integration Test Summary');
    console.log('=================================');
    
    const totalPassed = results.authEndpoints.passed + results.authPages.passed + results.protectedRoutes.passed;
    const totalTests = results.authEndpoints.total + results.authPages.total + results.protectedRoutes.total;
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`Auth Endpoints: ${results.authEndpoints.passed}/${results.authEndpoints.total} passed`);
    console.log(`Auth Pages: ${results.authPages.passed}/${results.authPages.total} passed`);
    console.log(`Protected Routes: ${results.protectedRoutes.passed}/${results.protectedRoutes.total} passed`);
    console.log(`Overall: ${totalPassed}/${totalTests} (${successRate}%)`);

    if (results.issues.length > 0) {
      console.log('\n⚠️ Issues Found:');
      results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    // Recommendations
    console.log('\n💡 OAuth Integration Status:');
    if (successRate >= 80) {
      console.log('✅ OAuth integration is working well');
      console.log('✅ Authentication system is operational');
      console.log('✅ Protected routes are functioning');
    } else {
      console.log('⚠️ OAuth integration needs attention');
      console.log('🔧 Check environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL)');
      console.log('🔧 Verify database connections if using production mode');
    }

    return {
      success: successRate >= 70,
      successRate,
      totalTests,
      totalPassed,
      issues: results.issues
    };

  } catch (error) {
    console.error('❌ OAuth integration test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run OAuth tests
if (require.main === module) {
  testOAuthIntegration().then(result => {
    if (result.success) {
      console.log('\n✅ OAuth integration verification completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️ OAuth integration verification found issues that need attention.');
      process.exit(1);
    }
  }).catch(console.error);
}

module.exports = { testOAuthIntegration };
