import { getDatabase } from '../src/lib/mongodb-utils.js';
import { indexProductsToAlgolia, clearAlgoliaIndex } from '../src/lib/algolia.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function indexProducts() {
  try {
    console.log('Starting Algolia indexing process...');

    // Get database connection
    const db = await getDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Fetch all products from MongoDB
    console.log('Fetching products from database...');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products in database`);

    if (products.length === 0) {
      console.log('No products found in database. Skipping indexing.');
      return;
    }

    // Clear existing index (optional - remove this if you want to keep existing data)
    console.log('Clearing existing Algolia index...');
    await clearAlgoliaIndex();

    // Index products to Algolia
    console.log('Indexing products to Algolia...');
    await indexProductsToAlgolia(products);

    console.log('Algolia indexing completed successfully!');

  } catch (error) {
    console.error('Error during Algolia indexing:', error);
    process.exit(1);
  }
}

// Run the indexing
indexProducts();
