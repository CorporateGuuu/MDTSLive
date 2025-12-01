#!/usr/bin/env node

// =============================================================================
// Nexus Tech Hub - Apply Security Migration
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config({ path: '.env.local' });
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================================================================
// Configuration
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =============================================================================
// Apply Migration
// =============================================================================

async function applySecurityMigration() {
  console.log('🛡️  Applying security migration...');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '..', 'migrations', '008_fix_rls_policies.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');

    // Split SQL into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception executing statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }

    console.log('🎉 Security migration completed!');
    console.log('🔍 Run the security audit again to verify fixes.');

  } catch (error) {
    console.error('💥 Error applying security migration:', error);
    process.exit(1);
  }
}

// Run the migration
applySecurityMigration().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
