// scripts/seed-supabase.js
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config({ path: '.env.production' });
config({ path: '.env.local' });
config(); // fallback to .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required Supabase environment variables:');
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

// Parse CSV content
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// Transform CSV data to Supabase format
function transformProduct(csvProduct) {
  return {
    name: csvProduct.name,
    slug: csvProduct.slug,
    sku: csvProduct.sku,
    description: csvProduct.description,
    price: parseFloat(csvProduct.price) || 0,
    discount_percentage: parseFloat(csvProduct.discount_percentage) || 0,
    stock_quantity: parseInt(csvProduct.stock_quantity) || 0,
    is_featured: csvProduct.is_featured === 'true'
    // Note: Only using columns that exist in the database
  };
}

async function seedDatabase() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // Test Supabase connection
    console.log('🔗 Testing Supabase connection...');
    const { error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Supabase connection test failed:', testError.message);
      console.error('Please check your SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL');
      process.exit(1);
    }
    console.log('✅ Supabase connection successful');

    // Read products CSV
    const csvPath = join(__dirname, '..', 'data', 'products.csv');
    console.log(`📖 Reading products CSV: ${csvPath}`);

    let csvContent;
    try {
      csvContent = readFileSync(csvPath, 'utf8');
    } catch (error) {
      console.error(`❌ Failed to read CSV file: ${error.message}`);
      process.exit(1);
    }

    // Parse CSV
    const csvProducts = parseCSV(csvContent);
    console.log(`📝 Found ${csvProducts.length} products in CSV\n`);

    // Transform products (simplified - without foreign keys for now)
    const products = csvProducts.map(product => transformProduct(product));

    // Clear existing products
    console.log('🧹 Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This should work for UUID

    if (deleteError) {
      // If the above fails, try a different approach
      console.warn(`⚠️  Primary delete method failed: ${deleteError.message}`);
      console.log('🔄 Trying alternative delete method...');

      // Try deleting all products using a different condition
      const { error: altDeleteError } = await supabase
        .from('products')
        .delete()
        .gt('price', -1); // Delete where price is greater than -1 (should match all)

      if (altDeleteError) {
        console.warn(`⚠️  Alternative delete also failed: ${altDeleteError.message}`);
        console.log('⚠️  Continuing with seeding (existing products may remain)');
      } else {
        console.log('✅ Cleared existing products (alternative method)');
      }
    } else {
      console.log('✅ Cleared existing products');
    }

    // Insert products
    console.log('📥 Inserting products...');
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      console.error('❌ Failed to insert products:', error.message);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} products`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 DATABASE SEEDING SUMMARY');
    console.log('='.repeat(50));
    console.log(`📦 Products seeded: ${data?.length || 0}`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('💥 Unexpected error during seeding:');
    console.error(error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
