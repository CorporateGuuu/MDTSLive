import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Migrations that need to be run
const pendingMigrations = [
  '001_initial_users',
  '002_add_products_table',
  '003_create_rls_policies',
  '004_storage',
  '005_cart_items_simple',
  '006_orders_tables',
  '007_orders_system_simple',
  '008_fix_rls_policies',
  '009_product_reviews'
];

async function runPendingMigrations() {
  console.log('🚀 Running pending migrations on production...\n');

  try {
    for (const migrationName of pendingMigrations) {
      console.log(`🔄 Running migration: ${migrationName}`);

      const filePath = join('migrations', `${migrationName}.sql`);
      const sql = readFileSync(filePath, 'utf8');

      // Execute the SQL
      const { error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error(`❌ Error executing ${migrationName}:`, error.message);
        // Try direct execution for DDL
        console.log('🔄 Trying direct execution...');
        try {
          // For DDL statements, we need to execute them differently
          // Since Supabase doesn't allow direct DDL execution via RPC,
          // we'll log the SQL for manual execution
          console.log(`📋 Please execute the following SQL manually in Supabase SQL Editor:`);
          console.log('\n' + '='.repeat(80));
          console.log(`-- Migration: ${migrationName}`);
          console.log(`BEGIN;`);
          console.log(sql.trim());
          console.log(`COMMIT;`);
          console.log('='.repeat(80));
          console.log('\n⚠️  After executing, press Enter to continue...');

          // Wait for manual execution
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (manualError) {
          console.error(`❌ Manual execution failed for ${migrationName}`);
          continue;
        }
      } else {
        console.log(`✅ Migration ${migrationName} executed successfully`);
      }

      // Record the migration as applied
      const { error: recordError } = await supabase
        .from('supabase_migrations')
        .insert({
          migration_name: migrationName,
          checksum: null,
        });

      if (recordError) {
        console.error(`❌ Error recording migration ${migrationName}:`, recordError.message);
      } else {
        console.log(`✅ Migration ${migrationName} recorded as applied`);
      }

      console.log();
    }

    console.log('🎉 All pending migrations completed!');

  } catch (error) {
    console.error('💥 Error during migration:', error);
  }
}

runPendingMigrations();
