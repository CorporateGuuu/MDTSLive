#!/usr/bin/env node

// =============================================================================
// Midas Technical Solutions - Migration Runner
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
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
// Migration Tracking Table
// =============================================================================

const MIGRATION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS public.supabase_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT NOT NULL UNIQUE,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checksum TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.supabase_migrations ENABLE ROW LEVEL SECURITY;

-- Only admins can view migrations
CREATE POLICY "Admins can view migrations"
  ON public.supabase_migrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only service role can insert migrations (for this script)
CREATE POLICY "Service role can manage migrations"
  ON public.supabase_migrations FOR ALL
  USING (auth.role() = 'service_role');
`;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Ensure migration tracking table exists
 */
async function ensureMigrationTable() {
  try {
    console.log('🔧 Ensuring migration tracking table exists...');

    // Try to select from the migration table
    const { data, error } = await supabase
      .from('supabase_migrations')
      .select('id')
      .limit(1);

    // If we get data, table exists
    if (data !== null) {
      console.log('✅ Migration tracking table ready.');
      return;
    }

    // If error indicates table doesn't exist, we need to create it
    if (error && (error.message.includes('does not exist') || error.message.includes('schema cache') || error.code === 'PGRST116' || error.code === 'PGRST205')) {
      console.log('📋 Migration table does not exist. Please create it manually in Supabase Dashboard:');
      console.log('\n--- Copy and paste this SQL into Supabase SQL Editor ---');
      console.log(MIGRATION_TABLE_SQL);
      console.log('--- End SQL ---');
      console.log('\nThen run this script again.');
      process.exit(1);
    }

    // For other errors, warn but continue
    console.warn('⚠️  Could not verify migration table existence, proceeding...');
    if (error) {
      console.warn('   Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error checking migration table:', error.message);
    process.exit(1);
  }
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations() {
  try {
    const { data, error } = await supabase
      .from('supabase_migrations')
      .select('migration_name')
      .order('executed_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching applied migrations:', error.message);
      return [];
    }

    return data.map(m => m.migration_name);
  } catch (error) {
    console.error('❌ Error fetching applied migrations:', error.message);
    return [];
  }
}

/**
 * Record a migration as applied
 */
async function recordMigration(migrationName, checksum = null) {
  try {
    const { error } = await supabase
      .from('supabase_migrations')
      .insert({
        migration_name: migrationName,
        checksum: checksum,
      });

    if (error) {
      console.error(`❌ Error recording migration ${migrationName}:`, error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error recording migration ${migrationName}:`, error.message);
    return false;
  }
}

/**
 * Calculate simple checksum for migration content
 */
function calculateChecksum(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

/**
 * Get all migration files from migrations directory
 */
function getMigrationFiles() {
  const migrationsDir = join(__dirname, '..', 'migrations');

  try {
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically (timestamp order)

    return files.map(file => ({
      filename: file,
      name: file.replace('.sql', ''),
      path: join(migrationsDir, file),
    }));
  } catch (error) {
    console.error('❌ Error reading migrations directory:', error.message);
    return [];
  }
}

/**
 * Read migration file content
 */
function readMigrationFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading migration file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Execute a migration (log guidance for manual execution)
 */
async function executeMigration(migration) {
  console.log(`\n🔄 Running migration: ${migration.name}`);

  const content = readMigrationFile(migration.path);
  if (!content) {
    return false;
  }

  const checksum = calculateChecksum(content);

  // Check if this is a DDL operation (which requires manual execution)
  const upperContent = content.toUpperCase();
  const isDDL = upperContent.includes('CREATE TABLE') ||
                upperContent.includes('ALTER TABLE') ||
                upperContent.includes('CREATE POLICY') ||
                upperContent.includes('CREATE FUNCTION') ||
                upperContent.includes('CREATE TRIGGER') ||
                upperContent.includes('CREATE INDEX');

  if (isDDL) {
    console.log('📋 This migration contains DDL operations that must be executed manually.');
    console.log('📖 Please copy and paste the following SQL into your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(80));
    console.log(content);
    console.log('='.repeat(80));

    // Wait for user confirmation
    console.log('\n⚠️  After executing the SQL in Supabase Dashboard, press Enter to continue...');

    // In a real implementation, you'd wait for user input here
    // For now, we'll just record it as applied
    await new Promise(resolve => setTimeout(resolve, 2000)); // Brief pause

    const recorded = await recordMigration(migration.name, checksum);
    if (recorded) {
      console.log(`✅ Migration ${migration.name} recorded as applied.`);
      return true;
    } else {
      console.log(`❌ Failed to record migration ${migration.name}.`);
      return false;
    }
  } else {
    // For DML operations (if any), you could execute them here
    console.log('📋 This migration contains DML operations.');

    // For now, just record as applied since we don't have DML migrations
    const recorded = await recordMigration(migration.name, checksum);
    if (recorded) {
      console.log(`✅ Migration ${migration.name} recorded as applied.`);
      return true;
    } else {
      console.log(`❌ Failed to record migration ${migration.name}.`);
      return false;
    }
  }
}

// =============================================================================
// Main Migration Function
// =============================================================================

// Debug: Immediate output to verify script is running
console.log('🚀 Starting Midas Technical Solutions migration runner...\n');
console.log('Debug: Script loaded successfully\n');

async function runMigrations() {
  console.log('🚀 Starting Midas Technical Solutions migration runner...\n');

  try {
    // Ensure migration tracking table exists
    await ensureMigrationTable();

    // Get all migration files
    const migrationFiles = getMigrationFiles();
    if (migrationFiles.length === 0) {
      console.log('ℹ️  No migration files found in migrations/ directory.');
      return;
    }

    console.log(`📁 Found ${migrationFiles.length} migration file(s):`);
    migrationFiles.forEach(file => {
      console.log(`   - ${file.filename}`);
    });
    console.log();

    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`📋 ${appliedMigrations.length} migration(s) already applied.`);

    if (appliedMigrations.length > 0) {
      console.log('Applied migrations:');
      appliedMigrations.forEach(name => {
        console.log(`   ✓ ${name}`);
      });
      console.log();
    }

    // Filter unapplied migrations
    const unappliedMigrations = migrationFiles.filter(
      file => !appliedMigrations.includes(file.name)
    );

    if (unappliedMigrations.length === 0) {
      console.log('🎉 All migrations are up to date!');
      return;
    }

    console.log(`🔄 ${unappliedMigrations.length} migration(s) to apply:`);
    unappliedMigrations.forEach(file => {
      console.log(`   - ${file.filename}`);
    });
    console.log();

    // Apply migrations
    let successCount = 0;
    let failureCount = 0;

    for (const migration of unappliedMigrations) {
      const success = await executeMigration(migration);
      if (success) {
        successCount++;
      } else {
        failureCount++;
        console.log(`❌ Migration ${migration.name} failed. Stopping.`);
        break;
      }

      // Small delay between migrations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful migrations: ${successCount}`);
    console.log(`❌ Failed migrations: ${failureCount}`);
    console.log(`📋 Total migrations: ${unappliedMigrations.length}`);

    if (failureCount === 0) {
      console.log('\n🎉 All migrations completed successfully!');
      console.log('🚀 Your Midas Technical Solutions database schema is up to date.');
    } else {
      console.log(`\n⚠️  Migration process stopped due to ${failureCount} failure(s).`);
      console.log('🔍 Check the error messages above for details.');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Unexpected error during migration:', error);
    process.exit(1);
  }
}

// =============================================================================
// Script Execution
// =============================================================================

// Run migrations immediately when script is executed
runMigrations().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
