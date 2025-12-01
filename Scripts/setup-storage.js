#!/usr/bin/env node

// =============================================================================
// Midas Technical Solutions - Storage Setup Script
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

// Initialize Supabase client
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
 * Execute SQL query
 */
async function executeSql(sql) {
  try {
    console.log('📡 Executing SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ SQL execution error:', error);
      return false;
    }

    console.log('✅ SQL executed successfully');
    return true;
  } catch (error) {
    console.error('❌ SQL execution failed:', error);
    return false;
  }
}

/**
 * Check if storage buckets exist
 */
async function checkBuckets() {
  try {
    console.log('🔍 Checking existing storage buckets...');

    // Try to list objects in products bucket
    const { data: productsData, error: productsError } = await supabase.storage
      .from('products')
      .list('', { limit: 1 });

    const productsExists = !productsError;

    // Try to list objects in avatars bucket
    const { data: avatarsData, error: avatarsError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 1 });

    const avatarsExists = !avatarsError;

    console.log(`📦 Products bucket: ${productsExists ? '✅ Exists' : '❌ Missing'}`);
    console.log(`👤 Avatars bucket: ${avatarsExists ? '✅ Exists' : '❌ Missing'}`);

    return { productsExists, avatarsExists };
  } catch (error) {
    console.error('❌ Error checking buckets:', error);
    return { productsExists: false, avatarsExists: false };
  }
}

/**
 * Run storage setup
 */
async function setupStorage() {
  console.log('🚀 Starting Midas Technical Solutions storage setup...\n');

  try {
    // Check existing buckets
    const { productsExists, avatarsExists } = await checkBuckets();

    if (productsExists && avatarsExists) {
      console.log('🎉 All storage buckets already exist!');
      console.log('ℹ️  If you want to recreate buckets, delete them first in Supabase Dashboard.');
      return;
    }

    // Read the storage migration SQL
    const sqlPath = join(__dirname, '..', 'migrations', '004_storage.sql');
    console.log(`📖 Reading storage migration: ${sqlPath}`);

    let sqlContent;
    try {
      sqlContent = readFileSync(sqlPath, 'utf8');
    } catch (error) {
      console.error(`❌ Failed to read SQL file: ${error.message}`);
      console.error('Please ensure migrations/004_storage.sql exists.');
      process.exit(1);
    }

    // Split SQL into individual statements (basic approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);

      // For storage operations, we need to use the Supabase client methods
      // rather than raw SQL execution
      if (statement.includes('INSERT INTO storage.buckets')) {
        // Handle bucket creation separately
        const bucketMatch = statement.match(/VALUES\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*ARRAY\[([^\]]+)\]/);
        if (bucketMatch) {
          const [, id, name, isPublic, fileSizeLimit, allowedMimeTypes] = bucketMatch;

          try {
            const { data, error } = await supabase.storage.createBucket(id, {
              public: isPublic.trim() === 'true',
              fileSizeLimit: parseInt(fileSizeLimit.trim()),
              allowedMimeTypes: allowedMimeTypes.split(',').map(type => type.trim().replace(/'/g, '')),
            });

            if (error && !error.message.includes('already exists')) {
              console.error(`❌ Failed to create bucket ${id}:`, error);
              failureCount++;
            } else {
              console.log(`✅ Created bucket: ${id}`);
              successCount++;
            }
          } catch (error) {
            console.error(`❌ Error creating bucket ${id}:`, error);
            failureCount++;
          }
        }
      } else if (statement.includes('CREATE POLICY')) {
        // For policies, we'll use the Supabase dashboard approach
        console.log('ℹ️  Storage policies need to be created manually in Supabase Dashboard');
        console.log('   Copy the policy SQL from migrations/004_storage.sql');
        successCount++;
      } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
        // Try to execute function creation
        const success = await executeSql(statement + ';');
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } else if (statement.includes('INSERT INTO public.supabase_migrations')) {
        // Record migration
        const success = await executeSql(statement + ';');
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } else {
        // Skip comments and other statements
        console.log('⏭️  Skipping non-essential statement');
        successCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 STORAGE SETUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful operations: ${successCount}`);
    console.log(`❌ Failed operations: ${failureCount}`);
    console.log(`📋 Total operations: ${statements.length}`);

    if (failureCount === 0) {
      console.log('\n🎉 Storage setup completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Go to Supabase Dashboard > Storage');
      console.log('2. Verify buckets "products" and "avatars" exist');
      console.log('3. Copy and run the CREATE POLICY statements from migrations/004_storage.sql');
      console.log('4. Test file uploads using the /api/upload-signed-url endpoint');
    } else {
      console.log(`\n⚠️  Storage setup completed with ${failureCount} issues.`);
      console.log('Check the error messages above for details.');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Unexpected error during storage setup:', error);
    process.exit(1);
  }
}

// =============================================================================
// Script Execution
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  setupStorage().catch(error => {
    console.error('💥 Script execution failed:', error);
    process.exit(1);
  });
}
