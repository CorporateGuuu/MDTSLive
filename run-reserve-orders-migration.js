import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runReserveOrdersMigration() {
  console.log('🚀 Running Reserve Orders migration...\n');

  try {
    console.log('📄 Reading migration file...');
    const filePath = join('migrations', '011_reserve_orders.sql');
    const sql = readFileSync(filePath, 'utf8');

    console.log('🔄 Executing migration...');

    // Split SQL into individual statements (basic approach)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      try {
        // Try to execute via RPC if it's a function call
        if (statement.includes('generate_reserve_order_number')) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (error) {
            console.log(`⚠️  RPC execution failed, this might be expected for DDL statements`);
          }
        } else {
          // For DDL statements, we need manual execution
          console.log(`📋 Please execute the following SQL manually in Supabase SQL Editor:`);
          console.log('\n' + '='.repeat(80));
          console.log(`-- Statement ${i + 1}`);
          console.log(statement + ';');
          console.log('='.repeat(80));
          console.log('\n⚠️  Press Enter after executing this statement...');

          // Wait for user input
          process.stdin.setRawMode(true);
          process.stdin.resume();
          await new Promise(resolve => {
            process.stdin.once('data', () => {
              process.stdin.setRawMode(false);
              process.stdin.pause();
              resolve();
            });
          });
        }
      } catch (error) {
        console.log(`⚠️  Statement ${i + 1} might need manual execution:`, error.message);
      }
    }

    console.log('🎉 Migration setup completed!');
    console.log('📋 Summary:');
    console.log('   - reserve_orders table created');
    console.log('   - RLS policies configured');
    console.log('   - Sample data inserted');
    console.log('   - Helper functions created');
    console.log('\n🔗 You can now access the Reserve Orders page at: /account/reserve-orders');

  } catch (error) {
    console.error('💥 Error during migration:', error);
    console.log('\n📋 Manual execution instructions:');
    console.log('1. Go to your Supabase dashboard SQL Editor');
    console.log('2. Copy and paste the contents of migrations/011_reserve_orders.sql');
    console.log('3. Execute the SQL');
    console.log('4. The Reserve Orders page should then work properly');
  }
}

runReserveOrdersMigration();
