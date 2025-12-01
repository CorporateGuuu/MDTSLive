// Simple test
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Starting simple test...');
console.log('URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Key:', supabaseServiceKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log('Client created, testing query...');

supabase
  .from('products')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Query failed:', error.message);
    } else {
      console.log('Query successful');
    }
  })
  .catch(err => {
    console.error('Exception:', err.message);
  });
