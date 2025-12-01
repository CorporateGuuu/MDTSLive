import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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

async function checkMigrations() {
  console.log('Checking migration status...\n');

  try {
    // Check if migration tracking table exists
    const { data, error } = await supabase
      .from('supabase_migrations')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Migration tracking table does not exist or is not accessible');
      console.log('This means no migrations have been run yet.\n');
    } else {
      console.log('✅ Migration tracking table exists');

      // Get applied migrations
      const { data: migrations, error: migError } = await supabase
        .from('supabase_migrations')
        .select('migration_name, executed_at')
        .order('executed_at', { ascending: true });

      if (migError) {
        console.log('❌ Error fetching applied migrations:', migError.message);
      } else {
        console.log(`📋 Found ${migrations.length} applied migrations:`);
        migrations.forEach(m => {
          console.log(`   ✓ ${m.migration_name} (${new Date(m.executed_at).toLocaleString()})`);
        });
      }
    }

    // Check if basic tables exist
    console.log('\n🔍 Checking if basic tables exist...');

    const tables = ['profiles', 'products', 'orders'];
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        if (error) {
          console.log(`❌ Table '${table}' does not exist or is not accessible`);
        } else {
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }

  } catch (error) {
    console.error('Error during check:', error);
  }
}

checkMigrations();
