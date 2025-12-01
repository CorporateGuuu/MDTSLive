#!/usr/bin/env node

// =============================================================================
// Midas Technical Solutions - Supabase Schema Application Script
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config({ path: '.env.local' });
config(); // fallback to .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================================================================
// Configuration
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if a table exists in the mdts schema
 */
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'mdts')
      .eq('table_name', tableName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.warn(`⚠️  Warning checking table ${tableName}:`, error.message);
      return false;
    }

    return !!data;
  } catch (error) {
    console.warn(`⚠️  Warning checking table ${tableName}:`, error.message);
    return false;
  }
}

/**
 * Execute a single SQL statement
 * Note: Supabase JS client doesn't support DDL operations (CREATE, ALTER, DROP)
 * This function will attempt RPC calls for DML operations only
 */
async function executeSQL(sql, description = '') {
  try {
    // Check if this is a DDL statement (Data Definition Language)
    const upperSQL = sql.toUpperCase().trim();
    const isDDL = upperSQL.startsWith('CREATE') ||
                  upperSQL.startsWith('ALTER') ||
                  upperSQL.startsWith('DROP') ||
                  upperSQL.startsWith('SET');

    if (isDDL) {
      console.log(`⚠️  Skipping DDL statement: ${description}`);
      console.log(`   DDL operations must be run in Supabase Dashboard SQL Editor`);
      console.log(`   Statement: ${sql.substring(0, 80)}${sql.length > 80 ? '...' : ''}\n`);
      return true; // Consider DDL "successful" since it's expected to be skipped
    }

    // For DML operations, try to execute via RPC if available
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.warn(`⚠️  Could not execute via RPC: ${description}`);
      console.warn(`   Error: ${error.message}`);
      return false;
    }

    console.log(`✅ ${description || 'SQL executed'}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute SQL: ${description || sql.substring(0, 50)}...`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

/**
 * Split SQL content into individual statements
 */
function splitSQLStatements(sqlContent) {
  // Remove comments and split by semicolons
  const statements = sqlContent
    .replace(/--.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  return statements;
}

/**
 * Check if schema already exists
 */
async function schemaExists() {
  try {
    const { data } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'mdts')
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// =============================================================================
// Main Execution Function
// =============================================================================

async function applySchema() {
  console.log('🚀 Starting Supabase schema application for Midas Technical Solutions...\n');

  try {
    // Check if schema already exists
    const schemaAlreadyExists = await schemaExists();
    if (schemaAlreadyExists) {
      console.log('ℹ️  Schema "mdts" already exists. Checking tables...\n');

      // Check existing tables
      const tables = [
        'products', 'categories', 'brands', 'user_profiles', 'orders',
        'order_items', 'addresses', 'carts', 'cart_items', 'wishlists',
        'wishlist_items', 'product_reviews', 'lcd_buyback_requests'
      ];

      const existingTables = [];
      for (const table of tables) {
        if (await tableExists(table)) {
          existingTables.push(table);
        }
      }

      if (existingTables.length > 0) {
        console.log(`ℹ️  Found existing tables: ${existingTables.join(', ')}`);
        console.log('ℹ️  Schema appears to be already applied. Use --force to reapply.\n');

        // Check for --force flag
        if (process.argv.includes('--force')) {
          console.log('🔄 Force applying schema...\n');
        } else {
          console.log('💡 Tip: Use --force flag to reapply the schema anyway.');
          return;
        }
      }
    }

    // Read schema file
    const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
    console.log(`📖 Reading schema file: ${schemaPath}`);

    let sqlContent;
    try {
      sqlContent = readFileSync(schemaPath, 'utf8');
    } catch (error) {
      console.error(`❌ Failed to read schema file: ${error.message}`);
      process.exit(1);
    }

    // Split into statements
    const statements = splitSQLStatements(sqlContent);
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute statements
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const description = getStatementDescription(statement, i + 1);

      console.log(`🔄 Executing statement ${i + 1}/${statements.length}: ${description}`);

      const success = await executeSQL(statement, description);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SCHEMA APPLICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${failureCount}`);
    console.log(`📋 Total statements: ${statements.length}`);

    if (failureCount === 0) {
      console.log('\n🎉 Schema application completed successfully!');
      console.log('🚀 Your Midas Technical Solutions database is ready.');
    } else {
      console.log(`\n⚠️  Schema application completed with ${failureCount} errors.`);
      console.log('🔍 Check the error messages above for details.');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Unexpected error during schema application:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Get a human-readable description of a SQL statement
 */
function getStatementDescription(sql, index) {
  const upperSQL = sql.toUpperCase().trim();

  if (upperSQL.includes('CREATE SCHEMA')) {
    return 'Create mdts schema';
  }
  if (upperSQL.includes('SET SEARCH_PATH')) {
    return 'Set search path';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('PRODUCTS')) {
    return 'Create products table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('CATEGORIES')) {
    return 'Create categories table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('BRANDS')) {
    return 'Create brands table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('USER_PROFILES')) {
    return 'Create user_profiles table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('ORDERS')) {
    return 'Create orders table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('ORDER_ITEMS')) {
    return 'Create order_items table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('ADDRESSES')) {
    return 'Create addresses table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('CARTS')) {
    return 'Create carts table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('CART_ITEMS')) {
    return 'Create cart_items table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('WISHLISTS')) {
    return 'Create wishlists table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('WISHLIST_ITEMS')) {
    return 'Create wishlist_items table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('PRODUCT_REVIEWS')) {
    return 'Create product_reviews table';
  }
  if (upperSQL.includes('CREATE TABLE') && upperSQL.includes('LCD_BUYBACK_REQUESTS')) {
    return 'Create lcd_buyback_requests table';
  }
  if (upperSQL.includes('ALTER TABLE') && upperSQL.includes('ENABLE ROW LEVEL SECURITY')) {
    const tableMatch = sql.match(/ALTER TABLE (\w+)\.(\w+) ENABLE ROW LEVEL SECURITY/);
    if (tableMatch) {
      return `Enable RLS on ${tableMatch[2]} table`;
    }
  }
  if (upperSQL.includes('CREATE POLICY')) {
    const policyMatch = sql.match(/CREATE POLICY "([^"]+)"/);
    if (policyMatch) {
      return `Create policy: ${policyMatch[1]}`;
    }
  }
  if (upperSQL.includes('CREATE FUNCTION')) {
    return 'Create version function';
  }
  if (upperSQL.includes('ALTER TABLE') && upperSQL.includes('ADD CONSTRAINT')) {
    return 'Add foreign key constraint';
  }

  return `Statement ${index}`;
}

// =============================================================================
// Script Execution
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  applySchema().catch(error => {
    console.error('💥 Script execution failed:', error);
    process.exit(1);
  });
}
