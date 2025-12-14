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

// Sample reviews data for popular Midas products
const sampleReviews = [
  // MidasGold 7.0 iPhone 16 Screen Reviews
  {
    product_slug: 'iphone-16-pro-max-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Perfect replacement screen - exceeded expectations!',
    review_text: 'This MidasGold 7.0 OLED screen is absolutely incredible. The color accuracy is perfect, touch sensitivity is enhanced, and the installation was straightforward. My customer couldn\'t tell the difference from the original. Highly recommend!',
    name: 'Verified Buyer - Sarah M.',
    verified: true,
    helpful_votes: 12
  },
  {
    product_slug: 'iphone-16-pro-max-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Best quality screen I\'ve used',
    review_text: 'As a professional repair technician, I\'ve tried many screens and this MidasGold 7.0 is by far the best. The True Tone technology works perfectly, blacks are deep, and the durability is outstanding. Worth every penny.',
    name: 'Verified Buyer - Mike R.',
    verified: true,
    helpful_votes: 8
  },
  {
    product_slug: 'iphone-16-pro-max-midasgold-7-0-oled-screen',
    rating: 4,
    title: 'Great quality, fast shipping',
    review_text: 'Ordered this screen and it arrived the next day. Installation was easy and the quality is top-notch. Only giving 4 stars because the adhesive kit wasn\'t included, but the screen itself is perfect.',
    name: 'Verified Buyer - Jennifer L.',
    verified: true,
    helpful_votes: 6
  },

  // Galaxy S25 Ultra Screen Reviews
  {
    product_slug: 'galaxy-s25-ultra-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Outstanding Samsung screen replacement',
    review_text: 'This screen is incredible. The S Pen functionality is perfect, colors are vibrant, and the build quality is exceptional. My customer was blown away by how well it works. MidasGold never disappoints.',
    name: 'Verified Buyer - David K.',
    verified: true,
    helpful_votes: 15
  },
  {
    product_slug: 'galaxy-s25-ultra-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Professional grade quality',
    review_text: 'I run a busy repair shop and these MidasGold screens are my go-to choice. The quality is consistent, installation is quick, and customers are always satisfied. The lifetime warranty gives me peace of mind.',
    name: 'Verified Buyer - TechPro Solutions',
    verified: true,
    helpful_votes: 10
  },

  // Midas Precision Repair Toolkit Reviews
  {
    product_slug: 'midas-precision-repair-toolkit-pro',
    rating: 5,
    title: 'Essential toolkit for any repair shop',
    review_text: 'This toolkit has everything I need for professional mobile repairs. The precision screwdrivers are high quality, the suction cups are strong, and all tools are durable. Highly recommend for both beginners and professionals.',
    name: 'Verified Buyer - RepairShop Pro',
    verified: true,
    helpful_votes: 18
  },
  {
    product_slug: 'midas-precision-repair-toolkit-pro',
    rating: 5,
    title: 'Perfect for professional repairs',
    review_text: 'I\'ve been doing mobile repairs for 5 years and this toolkit is the best investment I\'ve made. Every tool is precision-made and durable. The lifetime warranty is a great bonus. Worth every dollar.',
    name: 'Verified Buyer - Alex T.',
    verified: true,
    helpful_votes: 14
  },
  {
    product_slug: 'midas-precision-repair-toolkit-pro',
    rating: 4,
    title: 'Great toolkit, missing one tool',
    review_text: 'Excellent quality toolkit with all the essential tools. Only wish it included the specialized pry tools for newer devices, but overall very satisfied. Fast shipping and good packaging.',
    name: 'Verified Buyer - Lisa P.',
    verified: true,
    helpful_votes: 7
  },

  // Adhesive Kit Reviews
  {
    product_slug: 'midasgold-7-0-adhesive-kit',
    rating: 5,
    title: 'Perfect adhesive for screen replacements',
    review_text: 'This adhesive kit is specifically formulated for MidasGold screens and works perfectly. Easy to apply, cures quickly, and provides strong hold. Essential for professional screen replacements.',
    name: 'Verified Buyer - MobileFix Lab',
    verified: true,
    helpful_votes: 9
  },

  // Pixel 9 Screen Reviews
  {
    product_slug: 'pixel-9-pro-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Excellent Pixel screen quality',
    review_text: 'Replaced a Pixel 9 screen and the results were outstanding. The OLED quality matches the original perfectly, and the installation was straightforward. Customer was very happy with the repair.',
    name: 'Verified Buyer - Robert S.',
    verified: true,
    helpful_votes: 5
  },
  {
    product_slug: 'pixel-9-pro-midasgold-7-0-oled-screen',
    rating: 5,
    title: 'Top-notch Google Pixel repair',
    review_text: 'This MidasGold screen for Pixel 9 is excellent. The fit is perfect, colors are accurate, and the touch response is flawless. Much better than cheaper alternatives. Highly recommended for Pixel repairs.',
    name: 'Verified Buyer - Google Certified Tech',
    verified: true,
    helpful_votes: 11
  },

  // Battery Reviews
  {
    product_slug: 'iphone-16-battery-midaspower',
    rating: 5,
    title: 'Reliable battery replacement',
    review_text: 'This MidasPower battery is high capacity and holds charge well. The installation was easy and the battery health is excellent. Much better than OEM replacement. Great value for money.',
    name: 'Verified Buyer - Emma W.',
    verified: true,
    helpful_votes: 8
  },

  // Camera Module Reviews
  {
    product_slug: 'iphone-16-camera-module',
    rating: 5,
    title: 'Perfect camera replacement',
    review_text: 'Replaced an iPhone 16 camera module and the results are perfect. All camera functions work flawlessly, image quality is excellent, and the repair was successful. Professional quality parts.',
    name: 'Verified Buyer - PhotoTech Repair',
    verified: true,
    helpful_votes: 6
  },

  // Charging Port Reviews
  {
    product_slug: 'iphone-16-charging-port-assembly',
    rating: 4,
    title: 'Good quality charging port',
    review_text: 'This charging port assembly works well and charges reliably. The build quality is good and installation was straightforward. Minor fitment issue but overall satisfied with the performance.',
    name: 'Verified Buyer - Tom H.',
    verified: true,
    helpful_votes: 4
  },

  // Generic positive reviews for various products
  {
    product_slug: 'samsung-screen-adhesive-kit',
    rating: 5,
    title: 'Essential for screen repairs',
    review_text: 'This adhesive kit is perfect for Samsung screen replacements. Stays flexible, cures quickly, and provides excellent hold. Professional grade quality that I rely on for all my repairs.',
    name: 'Verified Buyer - Samsung Repair Pro',
    verified: true,
    helpful_votes: 12
  },
  {
    product_slug: 'universal-screen-protector-kit',
    rating: 5,
    title: 'Complete protection kit',
    review_text: 'Great value kit with multiple screen protectors and installation tools. Easy to apply and provides excellent protection. Perfect for protecting newly installed screens.',
    name: 'Verified Buyer - Crystal Clear Repairs',
    verified: true,
    helpful_votes: 7
  }
];

async function insertSampleReviews() {
  try {
    console.log('Starting sample reviews insertion...');

    // First, get product IDs from slugs
    const productSlugs = [...new Set(sampleReviews.map(review => review.product_slug))];
    console.log(`Getting product IDs for ${productSlugs.length} products...`);

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, slug')
      .in('slug', productSlugs);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    if (!products || products.length === 0) {
      console.error('No products found with the specified slugs');
      console.log('Available product slugs:', productSlugs);
      return;
    }

    // Create a map of slug to product ID
    const productMap = {};
    products.forEach(product => {
      productMap[product.slug] = product.id;
    });

    console.log(`Found ${products.length} products. Inserting reviews...`);

    // Prepare reviews with product IDs
    const reviewsWithIds = sampleReviews.map(review => ({
      ...review,
      product_id: productMap[review.product_slug],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
    })).filter(review => review.product_id); // Filter out reviews for products that don't exist

    console.log(`Inserting ${reviewsWithIds.length} reviews...`);

    // Insert reviews in batches
    const batchSize = 5;
    let insertedCount = 0;

    for (let i = 0; i < reviewsWithIds.length; i += batchSize) {
      const batch = reviewsWithIds.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(reviewsWithIds.length / batchSize)}...`);

      const { data, error } = await supabase
        .from('reviews')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
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
      .select('id, product_id, rating, name, verified')
      .limit(5);

    if (verifyError) {
      console.error('Error verifying reviews:', verifyError);
    } else {
      console.log(`\nVerification: ${verifyData?.length || 0} reviews in database`);
      console.log('Sample ratings distribution:', verifyData?.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {}));
    }

    // Calculate average ratings per product
    const { data: ratingStats, error: statsError } = await supabase
      .from('reviews')
      .select('product_id, rating')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        const stats = data?.reduce((acc, review) => {
          if (!acc[review.product_id]) {
            acc[review.product_id] = { total: 0, count: 0 };
          }
          acc[review.product_id].total += review.rating;
          acc[review.product_id].count += 1;
          return acc;
        }, {});
        return { data: stats, error: null };
      });

    if (!statsError && ratingStats) {
      console.log('\nAverage ratings by product:');
      Object.entries(ratingStats).forEach(([productId, stats]) => {
        const avg = (stats.total / stats.count).toFixed(1);
        console.log(`Product ${productId}: ${avg} stars (${stats.count} reviews)`);
      });
    }

  } catch (error) {
    console.error('Error in sample reviews insertion process:', error);
    process.exit(1);
  }
}

// Run the insertion
insertSampleReviews();
