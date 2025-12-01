/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/auth/*',
    '/admin/*',
    '/dashboard/*',
    '/api/*',
    '/404',
    '/500',
    '/unauthorized'
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
          '/unauthorized'
        ]
      }
    ],
    additionalSitemaps: [
      'https://nexustechhub.com/sitemap.xml'
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

    // Higher priority for main pages
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    } else if (path.includes('/iphone-parts') || path.includes('/samsung-parts')) {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'weekly';
    } else if (path.includes('/genuine-parts-program') || path.includes('/lcd-buyback')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'monthly';
    }

    return customConfig;
  }
};
