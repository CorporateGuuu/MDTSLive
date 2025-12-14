import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Script dynamically generates reviews for available products

async function insertSampleReviews() {
  try {
    console.log('Starting sample reviews insertion...');

    // First, get all available products to see what we can work with
    console.log('Checking available products...');
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(20);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    if (!allProducts || allProducts.length === 0) {
      console.error('No products found in database');
      return;
    }

    console.log(`Found ${allProducts.length} products in database`);
    allProducts.forEach(p => console.log(`  - ID ${p.id}: ${p.name}`));

    // Create simplified reviews for the first few products
    const simplifiedReviews = [];
    const numProducts = Math.min(5, allProducts.length); // Use first 5 products

    for (let i = 0; i < numProducts; i++) {
      const product = allProducts[i];
      // Add 2-3 reviews per product
      const numReviews = Math.floor(Math.random() * 2) + 2;

      for (let j = 0; j < numReviews; j++) {
        simplifiedReviews.push({
          product_id: product.id,
          user_id: null, // Allow null user_id
          rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
          title: `Great ${product.name}`,
          comment: `This ${product.name} is excellent quality and works perfectly. Highly recommended for professional use.`,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    console.log(`\nInserting ${simplifiedReviews.length} simplified reviews...`);

    // Insert reviews in batches
    const batchSize = 5;
    let insertedCount = 0;

    for (let i = 0; i < simplifiedReviews.length; i += batchSize) {
      const batch = simplifiedReviews.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(simplifiedReviews.length / batchSize)}...`);

      const { data, error } = await supabase
        .from('reviews')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        console.log('Batch data:', JSON.stringify(batch, null, 2));
        continue;
      }

      insertedCount += data?.length || 0;
      console.log(`Successfully inserted ${data?.length || 0} reviews in batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.log(`\nSample reviews insertion completed!`);
    console.log(`Total reviews inserted: ${insertedCount}`);

    // Verify the insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('reviews')
      .select('id, product_id, rating, title, comment')
      .limit(10);

    if (verifyError) {
      console.error('Error verifying reviews:', verifyError);
    } else {
      console.log(`\nVerification: ${verifyData?.length || 0} reviews in database`);
      console.log('Sample of inserted reviews:');
      verifyData?.slice(0, 3).forEach(review => {
        console.log(`  - Rating ${review.rating}: ${review.title}`);
      });
    }

  } catch (error) {
    console.error('Error in sample reviews insertion process:', error);
    process.exit(1);
  }
}

// Run the insertion
insertSampleReviews();
