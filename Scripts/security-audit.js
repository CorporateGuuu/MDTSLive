#!/usr/bin/env node

// =============================================================================
// Nexus Tech Hub - Security Audit Script
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });
config();

// =============================================================================
// Configuration
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// =============================================================================
// Security Checks
// =============================================================================

let issues = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };

function logIssue(severity, category, description, recommendation = '') {
  const colors = {
    critical: '\x1b[31m', // Red
    high: '\x1b[31m',     // Red
    medium: '\x1b[33m',   // Yellow
    low: '\x1b[36m',      // Cyan
    info: '\x1b[37m'      // White
  };
  const reset = '\x1b[0m';

  console.log(`${colors[severity]}[${severity.toUpperCase()}]${reset} ${category}: ${description}`);
  if (recommendation) {
    console.log(`   💡 ${recommendation}`);
  }
  console.log('');

  issues[severity]++;
}

/**
 * Check 1: Environment Variables Security
 */
async function checkEnvironmentSecurity() {
  console.log('🔐 Checking Environment Variables Security...');

  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Check for exposed secrets
    if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      logIssue('high', 'Environment Variables',
        'Service role key found in .env.local - ensure this file is in .gitignore',
        'Verify .env.local is in .gitignore and never commit sensitive keys');
    }

    // Check for weak JWT secrets
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      logIssue('medium', 'JWT Secret',
        'JWT secret is shorter than recommended (32+ characters)',
        'Generate a longer, more secure JWT secret');
    }
  } else {
    logIssue('info', 'Environment File',
      '.env.local file not found - ensure environment variables are properly configured');
  }
}

/**
 * Check 2: Database Policies Security
 */
async function checkDatabasePolicies() {
  console.log('🛡️  Checking Database Policies Security...');

  try {
    // Check if RLS is enabled on critical tables
    const tables = ['products', 'orders', 'user_addresses', 'cart_items'];

    for (const table of tables) {
      try {
        const { data, error } = await supabaseService
          .from('pg_class')
          .select('relname, relrowsecurity')
          .eq('relname', table)
          .single();

        if (error || !data?.relrowsecurity) {
          logIssue('critical', 'RLS Not Enabled',
            `Row Level Security not enabled on table: ${table}`,
            'Enable RLS and create appropriate policies for this table');
        }
      } catch (err) {
        logIssue('medium', 'Table Check Failed',
          `Could not verify RLS on table: ${table}`);
      }
    }

    // Test unauthorized access
    const { error: anonProductsError } = await supabaseAnon
      .from('orders')
      .select('*')
      .limit(1);

    if (!anonProductsError) {
      logIssue('critical', 'Policy Bypass',
        'Anonymous users can access orders table',
        'Review and fix RLS policies for orders table');
    }

  } catch (error) {
    logIssue('medium', 'Database Policy Check',
      'Failed to check database policies',
      'Manually verify RLS is enabled on all tables');
  }
}

/**
 * Check 3: Authentication Security
 */
async function checkAuthenticationSecurity() {
  console.log('🔑 Checking Authentication Security...');

  try {
    // Test weak password
    const weakPassword = '123';
    const { error: weakAuthError } = await supabaseAnon.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: weakPassword,
    });

    if (!weakAuthError) {
      logIssue('high', 'Weak Password Policy',
        'System allows very weak passwords',
        'Implement stronger password requirements (8+ chars, mixed case, numbers)');
    }

    // Check rate limiting (this would need to be tested with actual requests)
    logIssue('info', 'Rate Limiting',
      'Rate limiting implemented in middleware - verify it works in production');

  } catch (error) {
    logIssue('medium', 'Auth Security Check',
      'Failed to test authentication security');
  }
}

/**
 * Check 4: File Upload Security
 */
async function checkFileUploadSecurity() {
  console.log('📁 Checking File Upload Security...');

  try {
    // Check storage bucket policies
    const { data: buckets, error } = await supabaseService.storage.listBuckets();

    if (error) {
      logIssue('medium', 'Storage Access',
        'Cannot access storage buckets for security check');
      return;
    }

    for (const bucket of buckets) {
      // Check if public buckets have proper restrictions
      if (bucket.public) {
        logIssue('info', 'Public Bucket',
          `Bucket '${bucket.name}' is public - ensure proper policies are in place`);
      }
    }

  } catch (error) {
    logIssue('medium', 'File Upload Security',
      'Failed to check file upload security');
  }
}

/**
 * Check 5: API Security
 */
async function checkAPISecurity() {
  console.log('🌐 Checking API Security...');

  // Check for common API security issues in code
  const apiFiles = [
    'src/app/api/auth/login/route.ts',
    'src/app/api/products/route.ts',
    'src/middleware.ts'
  ];

  for (const file of apiFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');

      // Check for SQL injection patterns
      if (content.includes('${') && content.includes('query')) {
        logIssue('high', 'Potential SQL Injection',
          `String interpolation found in ${file}`,
          'Use parameterized queries instead of string interpolation');
      }

      // Check for missing input validation
      if (content.includes('request.json()') && !content.includes('zod') && !content.includes('validate')) {
        logIssue('medium', 'Input Validation',
          `API route ${file} may lack input validation`,
          'Add proper input validation using Zod schemas');
      }
    }
  }
}

/**
 * Check 6: Code Security Issues
 */
async function checkCodeSecurity() {
  console.log('💻 Checking Code Security Issues...');

  // Scan for common security issues
  const scanDirectory = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for console.log in production code
        if (content.includes('console.log') && !file.includes('test') && !file.includes('script')) {
          logIssue('low', 'Debug Code',
            `console.log found in ${filePath}`,
            'Remove or replace console.log with proper logging in production');
        }

        // Check for hardcoded secrets
        if (content.includes('password') && content.includes('123') && !file.includes('test')) {
          logIssue('high', 'Hardcoded Credentials',
            `Potential hardcoded password found in ${filePath}`,
            'Never hardcode credentials in source code');
        }

        // Check for eval usage
        if (content.includes('eval(') || content.includes('Function(')) {
          logIssue('critical', 'Dangerous Code Execution',
            `eval() or Function() found in ${filePath}`,
            'Remove eval() usage as it can execute malicious code');
        }
      }
    }
  };

  scanDirectory('src');
}

/**
 * Generate Security Report
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('🔒 SECURITY AUDIT REPORT');
  console.log('='.repeat(60));

  console.log(`Critical Issues: ${issues.critical}`);
  console.log(`High Issues: ${issues.high}`);
  console.log(`Medium Issues: ${issues.medium}`);
  console.log(`Low Issues: ${issues.low}`);
  console.log(`Info Items: ${issues.info}`);

  const total = issues.critical + issues.high + issues.medium + issues.low + issues.info;

  if (issues.critical > 0 || issues.high > 0) {
    console.log('\n❌ SECURITY ISSUES FOUND - IMMEDIATE ACTION REQUIRED');
    console.log('   Critical and High severity issues must be addressed before deployment.');
  } else if (issues.medium > 0) {
    console.log('\n⚠️  MEDIUM PRIORITY ISSUES FOUND');
    console.log('   Address medium severity issues before production deployment.');
  } else {
    console.log('\n✅ NO CRITICAL SECURITY ISSUES FOUND');
    console.log('   Review low priority items for best practices.');
  }

  console.log('\n📋 RECOMMENDATIONS:');
  console.log('   1. Run this audit regularly, especially before deployments');
  console.log('   2. Address all Critical and High severity issues immediately');
  console.log('   3. Implement automated security testing in CI/CD pipeline');
  console.log('   4. Regular security training for development team');
  console.log('   5. Consider third-party security audit for production systems');
}

// =============================================================================
// Main Execution
// =============================================================================

async function runSecurityAudit() {
  console.log('🛡️  Starting Nexus Tech Hub Security Audit...\n');

  try {
    await checkEnvironmentSecurity();
    await checkDatabasePolicies();
    await checkAuthenticationSecurity();
    await checkFileUploadSecurity();
    await checkAPISecurity();
    await checkCodeSecurity();

    generateReport();

  } catch (error) {
    console.error('💥 Security audit failed:', error);
    process.exit(1);
  }
}

// Run the audit
runSecurityAudit().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
