/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://midastechnicalsolutions.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/auth/*',
    '/admin/*',
    '/dashboard/*',
    '/api/*',
    '/checkout',
    '/checkout/*',
    '/account',
    '/account/*',
    '/success',
    '/success/*',
    '/404',
    '/500',
    '/unauthorized',
    '/_next/*',
    '/static/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/admin/',
          '/dashboard/',
          '/api/',
          '/checkout/',
          '/account/',
          '/_next/',
          '/static/'
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://midastechnicalsolutions.com'}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://midastechnicalsolutions.com'}/server-sitemap.xml`
    ]
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    };

    // Homepage - highest priority
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    }
    // Category pages - high priority
    else if (path.startsWith('/category/')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'weekly';
    }
    // Product pages - medium-high priority
    else if (path.startsWith('/product/')) {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'weekly';
    }
    // Static pages - medium priority
    else if (path === '/about' || path === '/contact' || path === '/quality-standards' || path === '/support') {
      customConfig.priority = 0.7;
      customConfig.changefreq = 'monthly';
    }
    // Service pages - lower priority
    else if (path === '/bulk-orders' || path === '/trade-in' || path === '/technical-support' || path === '/warranty') {
      customConfig.priority = 0.6;
      customConfig.changefreq = 'monthly';
    }

    return customConfig;
  },
  // Additional paths that might not be statically generated
  additionalPaths: async (config) => {
    const result = [];

    try {
      // Import Supabase client for dynamic paths
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Add category pages dynamically
      const { data: categories } = await supabase
        .from('categories')
        .select('slug')
        .eq('is_active', true);

      if (categories) {
        categories.forEach(category => {
          result.push({
            loc: `/category/${category.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString()
          });
        });
      }

      // Add product pages dynamically (limit to prevent huge sitemap)
      const { data: products } = await supabase
        .from('products')
        .select('slug')
        .eq('is_active', true)
        .limit(100); // Limit to first 100 products

      if (products) {
        products.forEach(product => {
          result.push({
            loc: `/product/${product.slug}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date().toISOString()
          });
        });
      }

    } catch (error) {
      console.warn('Could not fetch dynamic paths for sitemap:', error);
    }

    return result;
  }
};
