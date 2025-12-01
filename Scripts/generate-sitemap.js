const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateSitemap() {
  try {
    console.log('Generating sitemap.xml...');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com';

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'weekly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/cart', priority: '0.7', changefreq: 'weekly' },
      { url: '/checkout', priority: '0.7', changefreq: 'weekly' },
      { url: '/account', priority: '0.7', changefreq: 'weekly' },
      { url: '/login', priority: '0.7', changefreq: 'weekly' },
      { url: '/register', priority: '0.7', changefreq: 'weekly' },
      { url: '/search', priority: '0.7', changefreq: 'weekly' },
      { url: '/faq', priority: '0.7', changefreq: 'weekly' },
      { url: '/shipping', priority: '0.7', changefreq: 'weekly' },
      { url: '/returns', priority: '0.7', changefreq: 'weekly' },
      { url: '/privacy', priority: '0.7', changefreq: 'weekly' },
      { url: '/terms', priority: '0.7', changefreq: 'weekly' },
      { url: '/sitemap', priority: '0.7', changefreq: 'weekly' },
    ];

    // Get active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    // Get active categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }

    // Get active brands
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (brandsError) {
      console.error('Error fetching brands:', brandsError);
      return;
    }

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `<url>
<loc>${baseUrl}${page.url}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>${page.changefreq}</changefreq>
<priority>${page.priority}</priority>
</url>
`;
    });

    // Add product pages
    if (products) {
      products.forEach(product => {
        sitemap += `<url>
<loc>${baseUrl}/products/${product.slug}</loc>
<lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
`;
      });
    }

    // Add category pages
    if (categories) {
      categories.forEach(category => {
        sitemap += `<url>
<loc>${baseUrl}/categories/${category.slug}</loc>
<lastmod>${new Date(category.updated_at).toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
`;
      });
    }

    // Add brand pages
    if (brands) {
      brands.forEach(brand => {
        sitemap += `<url>
<loc>${baseUrl}/brands/${brand.slug}</loc>
<lastmod>${new Date(brand.updated_at).toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
`;
      });
    }

    sitemap += '</urlset>';

    // Write to public/sitemap.xml
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);

    console.log(`Sitemap generated successfully with ${staticPages.length + (products?.length || 0) + (categories?.length || 0) + (brands?.length || 0)} URLs`);
    console.log(`Sitemap saved to: ${sitemapPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();
