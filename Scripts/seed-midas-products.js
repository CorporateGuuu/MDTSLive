#!/usr/bin/env node

// =============================================================================
// Midas Technical Solutions - Comprehensive Product Seeding Script
// =============================================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.production' });
config({ path: '.env.local' });
config();

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

// =============================================================================
// Product Data
// =============================================================================

// Categories
const categories = [
  { name: 'iPhone Parts', slug: 'iphone-parts' },
  { name: 'Samsung Parts', slug: 'samsung-parts' },
  { name: 'Replacement Parts', slug: 'replacement-parts' },
  { name: 'Tools & Supplies', slug: 'tools-supplies' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Batteries', slug: 'batteries' }
];

// Brands
const brands = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Google', slug: 'google' },
  { name: 'MidasGold', slug: 'midasgold' },
  { name: 'ProTools', slug: 'protools' }
];

// Comprehensive product data
const productsData = [
  // iPhone 16 Series - MidasGold 7.0 Premium Screens
  {
    name: 'iPhone 16 Pro Max MidasGold 7.0 OLED Screen',
    slug: 'iphone-16-pro-max-midasgold-7-0-oled-screen',
    sku: 'MG-IP16PM-OLED-70',
    description: 'Premium MidasGold 7.0 OLED screen replacement for iPhone 16 Pro Max. Features advanced color accuracy, true-to-life blacks, and enhanced durability with our proprietary 7.0 technology coating.',
    short_description: 'Premium OLED screen with MidasGold 7.0 technology',
    price: 349.99,
    original_price: 399.99,
    discount_percentage: 12.5,
    stock_quantity: 25,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'iphone-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-iphone-16-pm-screen.jpg'],
    thumbnail_url: '/images/products/mg-iphone-16-pm-screen-thumb.jpg'
  },
  {
    name: 'iPhone 16 Pro MidasGold 7.0 OLED Screen',
    slug: 'iphone-16-pro-midasgold-7-0-oled-screen',
    sku: 'MG-IP16P-OLED-70',
    description: 'Professional-grade MidasGold 7.0 OLED screen for iPhone 16 Pro. Enhanced color reproduction and superior touch responsiveness with lifetime warranty.',
    short_description: 'Pro OLED screen with enhanced touch technology',
    price: 329.99,
    original_price: 379.99,
    discount_percentage: 13.16,
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'iphone-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-iphone-16-p-screen.jpg'],
    thumbnail_url: '/images/products/mg-iphone-16-p-screen-thumb.jpg'
  },
  {
    name: 'iPhone 16 Plus MidasGold 7.0 OLED Screen',
    slug: 'iphone-16-plus-midasgold-7-0-oled-screen',
    sku: 'MG-IP16PLUS-OLED-70',
    description: 'High-quality MidasGold 7.0 OLED replacement for iPhone 16 Plus. Advanced screen technology with improved brightness and color accuracy.',
    short_description: 'Enhanced OLED screen for iPhone 16 Plus',
    price: 299.99,
    original_price: 349.99,
    discount_percentage: 14.29,
    stock_quantity: 35,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'iphone-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-iphone-16-plus-screen.jpg'],
    thumbnail_url: '/images/products/mg-iphone-16-plus-screen-thumb.jpg'
  },
  {
    name: 'iPhone 16 MidasGold 7.0 OLED Screen',
    slug: 'iphone-16-midasgold-7-0-oled-screen',
    sku: 'MG-IP16-OLED-70',
    description: 'Premium MidasGold 7.0 OLED screen replacement for iPhone 16. Features our latest 7.0 technology for unmatched durability and performance.',
    short_description: 'Standard OLED screen with premium technology',
    price: 279.99,
    original_price: 329.99,
    discount_percentage: 15.15,
    stock_quantity: 40,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'iphone-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-iphone-16-screen.jpg'],
    thumbnail_url: '/images/products/mg-iphone-16-screen-thumb.jpg'
  },

  // Samsung Galaxy S25 Series
  {
    name: 'Galaxy S25 Ultra MidasGold 7.0 OLED Screen',
    slug: 'galaxy-s25-ultra-midasgold-7-0-oled-screen',
    sku: 'MG-GS25U-OLED-70',
    description: 'Professional MidasGold 7.0 OLED screen for Samsung Galaxy S25 Ultra. Enhanced S Pen compatibility and superior display quality.',
    short_description: 'Ultra premium OLED screen with S Pen support',
    price: 399.99,
    original_price: 449.99,
    discount_percentage: 11.11,
    stock_quantity: 20,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'samsung-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-s25-ultra-screen.jpg'],
    thumbnail_url: '/images/products/mg-s25-ultra-screen-thumb.jpg'
  },
  {
    name: 'Galaxy S25+ MidasGold 7.0 OLED Screen',
    slug: 'galaxy-s25-plus-midasgold-7-0-oled-screen',
    sku: 'MG-GS25P-OLED-70',
    description: 'High-performance MidasGold 7.0 OLED screen for Galaxy S25+. Advanced color technology with enhanced brightness.',
    short_description: 'Enhanced OLED screen for Galaxy S25+',
    price: 349.99,
    original_price: 399.99,
    discount_percentage: 12.5,
    stock_quantity: 25,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'samsung-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-s25-plus-screen.jpg'],
    thumbnail_url: '/images/products/mg-s25-plus-screen-thumb.jpg'
  },
  {
    name: 'Galaxy S25 MidasGold 7.0 OLED Screen',
    slug: 'galaxy-s25-midasgold-7-0-oled-screen',
    sku: 'MG-GS25-OLED-70',
    description: 'Premium MidasGold 7.0 OLED replacement for Galaxy S25. Superior display quality with enhanced durability.',
    short_description: 'Premium OLED screen for Galaxy S25',
    price: 299.99,
    original_price: 349.99,
    discount_percentage: 14.29,
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'samsung-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-s25-screen.jpg'],
    thumbnail_url: '/images/products/mg-s25-screen-thumb.jpg'
  },

  // Galaxy A56 2025 Series
  {
    name: 'Galaxy A56 2025 MidasGold 7.0 LCD Screen',
    slug: 'galaxy-a56-2025-midasgold-7-0-lcd-screen',
    sku: 'MG-GA562025-LCD-70',
    description: 'Professional MidasGold 7.0 LCD screen for Samsung Galaxy A56 2025. Enhanced clarity and touch responsiveness.',
    short_description: 'Premium LCD screen for Galaxy A56 2025',
    price: 149.99,
    original_price: 179.99,
    discount_percentage: 16.67,
    stock_quantity: 45,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'samsung-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-a56-2025-screen.jpg'],
    thumbnail_url: '/images/products/mg-a56-2025-screen-thumb.jpg'
  },

  // Pixel 9 Series
  {
    name: 'Pixel 9 Pro XL MidasGold 7.0 OLED Screen',
    slug: 'pixel-9-pro-xl-midasgold-7-0-oled-screen',
    sku: 'MG-P9PXL-OLED-70',
    description: 'Premium MidasGold 7.0 OLED screen for Google Pixel 9 Pro XL. Superior display quality with enhanced color accuracy.',
    short_description: 'Pro XL OLED screen with premium technology',
    price: 299.99,
    original_price: 349.99,
    discount_percentage: 14.29,
    stock_quantity: 25,
    is_active: true,
    is_featured: true,
    is_new: true,
    category_slug: 'replacement-parts',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-pixel-9-pro-xl-screen.jpg'],
    thumbnail_url: '/images/products/mg-pixel-9-pro-xl-screen-thumb.jpg'
  },

  // iPhone Batteries
  {
    name: 'iPhone 16 Pro Max Original Battery',
    slug: 'iphone-16-pro-max-original-battery',
    sku: 'IP16PM-BAT-ORIG',
    description: 'Genuine Apple battery replacement for iPhone 16 Pro Max. Maintains optimal performance and battery life.',
    short_description: 'Original Apple battery for iPhone 16 Pro Max',
    price: 89.99,
    original_price: 99.99,
    discount_percentage: 10,
    stock_quantity: 50,
    is_active: true,
    is_featured: false,
    is_new: true,
    category_slug: 'batteries',
    brand_slug: 'apple',
    images: ['/images/products/iphone-16-pm-battery.jpg'],
    thumbnail_url: '/images/products/iphone-16-pm-battery-thumb.jpg'
  },

  // Professional Toolkits
  {
    name: 'Midas Precision Repair Toolkit Pro',
    slug: 'midas-precision-repair-toolkit-pro',
    sku: 'MIDAS-TOOLKIT-PRO',
    description: 'Complete professional repair toolkit featuring precision screwdrivers, opening tools, suction cups, and specialized repair equipment.',
    short_description: 'Professional-grade repair toolkit',
    price: 199.99,
    original_price: 249.99,
    discount_percentage: 20,
    stock_quantity: 15,
    is_active: true,
    is_featured: true,
    is_new: false,
    category_slug: 'tools-supplies',
    brand_slug: 'midasgold',
    images: ['/images/products/midas-toolkit-pro.jpg'],
    thumbnail_url: '/images/products/midas-toolkit-pro-thumb.jpg'
  },
  {
    name: 'MidasGold 7.0 Adhesive Kit',
    slug: 'midasgold-7-0-adhesive-kit',
    sku: 'MG-ADHESIVE-KIT-70',
    description: 'Professional adhesive kit with MidasGold 7.0 technology for screen replacements. Includes precision applicators and curing equipment.',
    short_description: 'Advanced adhesive kit for professional repairs',
    price: 79.99,
    original_price: 99.99,
    discount_percentage: 20,
    stock_quantity: 30,
    is_active: true,
    is_featured: false,
    is_new: false,
    category_slug: 'tools-supplies',
    brand_slug: 'midasgold',
    images: ['/images/products/mg-adhesive-kit.jpg'],
    thumbnail_url: '/images/products/mg-adhesive-kit-thumb.jpg'
  }
];

// Generate additional products programmatically
function generateAdditionalProducts() {
  const additionalProducts = [];

  // Generate iPhone 15/14 series screens
  const iphoneModels = ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14'];
  iphoneModels.forEach((model, index) => {
    const basePrice = 400 - (index * 25); // Decreasing prices
    additionalProducts.push({
      name: `${model} MidasGold 7.0 OLED Screen`,
      slug: `${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-midasgold-7-0-oled-screen`,
      sku: `MG-${model.replace(/\s+/g, '').toUpperCase()}-OLED-70`,
      description: `Premium MidasGold 7.0 OLED screen replacement for ${model}. Features advanced color accuracy and enhanced durability.`,
      short_description: `Premium OLED screen for ${model}`,
      price: basePrice * 0.85, // 15% discount
      original_price: basePrice,
      discount_percentage: 15,
      stock_quantity: Math.floor(Math.random() * 50) + 20,
      is_active: true,
      is_featured: index < 4,
      is_new: index < 4,
      category_slug: 'iphone-parts',
      brand_slug: 'midasgold',
      images: [`/images/products/mg-${model.toLowerCase().replace(/\s+/g, '-')}-screen.jpg`],
      thumbnail_url: `/images/products/mg-${model.toLowerCase().replace(/\s+/g, '-')}-screen-thumb.jpg`
    });
  });

  // Generate Samsung Galaxy A series
  const samsungAModels = ['Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A52', 'Galaxy A51'];
  samsungAModels.forEach((model, index) => {
    const basePrice = 180 - (index * 15);
    additionalProducts.push({
      name: `${model} MidasGold 7.0 LCD Screen`,
      slug: `${model.toLowerCase().replace(/\s+/g, '-')}-midasgold-7-0-lcd-screen`,
      sku: `MG-${model.replace(/\s+/g, '').toUpperCase()}-LCD-70`,
      description: `High-quality MidasGold 7.0 LCD screen for ${model}. Enhanced clarity and touch performance.`,
      short_description: `Premium LCD screen for ${model}`,
      price: basePrice * 0.8,
      original_price: basePrice,
      discount_percentage: 20,
      stock_quantity: Math.floor(Math.random() * 60) + 30,
      is_active: true,
      is_featured: index < 3,
      is_new: index < 2,
      category_slug: 'samsung-parts',
      brand_slug: 'midasgold',
      images: [`/images/products/mg-${model.toLowerCase().replace(/\s+/g, '-')}-screen.jpg`],
      thumbnail_url: `/images/products/mg-${model.toLowerCase().replace(/\s+/g, '-')}-screen-thumb.jpg`
    });
  });

  // Generate tool products
  const tools = [
    { name: 'Precision Screwdriver Set', price: 49.99, desc: 'Complete set of precision screwdrivers for electronics repair' },
    { name: 'Professional Heat Gun', price: 89.99, desc: 'Variable temperature heat gun for screen removal' },
    { name: 'Opening Tool Kit', price: 34.99, desc: 'Plastic opening tools and pry bars' },
    { name: 'Soldering Station', price: 149.99, desc: 'Professional soldering equipment' },
    { name: 'Screen Separator Machine', price: 299.99, desc: 'Automated screen separation device' },
    { name: 'LCD Testing Kit', price: 79.99, desc: 'Professional LCD testing equipment' }
  ];

  tools.forEach((tool, index) => {
    additionalProducts.push({
      name: `Midas ${tool.name}`,
      slug: `midas-${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      sku: `MIDAS-${tool.name.replace(/\s+/g, '').toUpperCase()}`,
      description: `Professional-grade ${tool.name.toLowerCase()} for electronics repair. ${tool.desc}.`,
      short_description: tool.desc,
      price: tool.price,
      original_price: tool.price * 1.2,
      discount_percentage: 16.67,
      stock_quantity: Math.floor(Math.random() * 40) + 10,
      is_active: true,
      is_featured: index < 3,
      is_new: index < 2,
      category_slug: 'tools-supplies',
      brand_slug: 'midasgold',
      images: [`/images/products/midas-${tool.name.toLowerCase().replace(/\s+/g, '-')}.jpg`],
      thumbnail_url: `/images/products/midas-${tool.name.toLowerCase().replace(/\s+/g, '-')}-thumb.jpg`
    });
  });

  // Generate battery products
  const batteries = [
    { device: 'iPhone 15 Pro Max', price: 79.99 },
    { device: 'iPhone 15 Pro', price: 74.99 },
    { device: 'iPhone 15 Plus', price: 69.99 },
    { device: 'iPhone 15', price: 64.99 },
    { device: 'Samsung Galaxy S24 Ultra', price: 89.99 },
    { device: 'Samsung Galaxy S24+', price: 79.99 },
    { device: 'Samsung Galaxy S24', price: 69.99 }
  ];

  batteries.forEach((battery, index) => {
    additionalProducts.push({
      name: `${battery.device} Original Battery`,
      slug: `${battery.device.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-original-battery`,
      sku: `${battery.device.replace(/\s+/g, '').toUpperCase()}-BAT-ORIG`,
      description: `Genuine original battery replacement for ${battery.device}. Maintains optimal performance and battery life.`,
      short_description: `Original battery for ${battery.device}`,
      price: battery.price,
      original_price: battery.price * 1.15,
      discount_percentage: 13.04,
      stock_quantity: Math.floor(Math.random() * 70) + 30,
      is_active: true,
      is_featured: index < 4,
      is_new: false,
      category_slug: 'batteries',
      brand_slug: battery.device.includes('iPhone') ? 'apple' : 'samsung',
      images: [`/images/products/${battery.device.toLowerCase().replace(/\s+/g, '-')}-battery.jpg`],
      thumbnail_url: `/images/products/${battery.device.toLowerCase().replace(/\s+/g, '-')}-battery-thumb.jpg`
    });
  });

  return additionalProducts;
}

// =============================================================================
// Seeding Functions
// =============================================================================

async function ensureCategoriesAndBrands() {
  console.log('🔧 Ensuring categories and brands exist...');

  // Insert categories
  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert({
        name: category.name,
        slug: category.slug,
        is_active: true
      }, {
        onConflict: 'slug'
      });

    if (error && !error.message.includes('duplicate key')) {
      console.error(`Error upserting category ${category.name}:`, error);
    }
  }

  // Insert brands
  for (const brand of brands) {
    const { error } = await supabase
      .from('brands')
      .upsert({
        name: brand.name,
        slug: brand.slug,
        is_active: true
      }, {
        onConflict: 'slug'
      });

    if (error && !error.message.includes('duplicate key')) {
      console.error(`Error upserting brand ${brand.name}:`, error);
    }
  }

  console.log('✅ Categories and brands ready');
}

async function seedProducts() {
  console.log('🚀 Starting comprehensive product seeding...\n');

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

    // Ensure categories and brands exist
    await ensureCategoriesAndBrands();

    // Get category and brand IDs
    const { data: categoriesData } = await supabase.from('categories').select('id, slug');
    const { data: brandsData } = await supabase.from('brands').select('id, slug');

    const categoryMap = Object.fromEntries(categoriesData.map(c => [c.slug, c.id]));
    const brandMap = Object.fromEntries(brandsData.map(b => [b.slug, b.id]));

    // Combine manual and generated products
    const allProducts = [...productsData, ...generateAdditionalProducts()];
    console.log(`📝 Preparing ${allProducts.length} products...\n`);

    // Transform products for database insertion
    const dbProducts = allProducts.map(product => ({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      short_description: product.short_description,
      price: product.price,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_new: product.is_new,
      category_id: categoryMap[product.category_slug],
      brand_id: brandMap[product.brand_slug],
      images: product.images,
      thumbnail_url: product.thumbnail_url
    }));

    // Skip clearing existing products to avoid issues
    console.log('⏭️  Skipping product clearing to preserve existing data...');

    // Insert products in batches to avoid timeout
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, i + batchSize);
      console.log(`📥 Inserting products ${i + 1}-${Math.min(i + batchSize, dbProducts.length)}...`);

      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`❌ Failed to insert batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        continue;
      }

      totalInserted += data?.length || 0;
      console.log(`✅ Inserted ${data?.length || 0} products in batch ${Math.floor(i/batchSize) + 1}`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PRODUCT SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`📦 Total products prepared: ${allProducts.length}`);
    console.log(`✅ Products successfully inserted: ${totalInserted}`);
    console.log(`⚠️  Failed insertions: ${allProducts.length - totalInserted}`);
    console.log('🎉 Product seeding completed!');

    // Feature counts
    const featuredCount = allProducts.filter(p => p.is_featured).length;
    const newCount = allProducts.filter(p => p.is_new).length;
    console.log(`⭐ Featured products: ${featuredCount}`);
    console.log(`🆕 New products: ${newCount}`);

  } catch (error) {
    console.error('💥 Unexpected error during seeding:');
    console.error(error);
    process.exit(1);
  }
}

// =============================================================================
// Script Execution
// =============================================================================

console.log('🏭 Midas Technical Solutions - Product Seeding Script\n');
seedProducts().catch(error => {
  console.error('💥 Script execution failed:', error);
  process.exit(1);
});
