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

async function checkProducts() {
  console.log('Checking products in production database...\n');

  try {
    // Check product count
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching products:', error.message);
      return;
    }

    console.log(`✅ Found ${products?.length || 0} products in database`);
    if (products && products.length > 0) {
      console.log('Sample products:');
      products.forEach(product => {
        console.log(`   - ${product.name}: $${product.price} (${product.stock_quantity} in stock)`);
      });
    }

    // Check total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting product count:', countError.message);
    } else {
      console.log(`📊 Total products: ${count}`);
    }

  } catch (error) {
    console.error('Error during check:', error);
  }
}

checkProducts();
