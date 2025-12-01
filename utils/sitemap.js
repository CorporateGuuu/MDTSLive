// Sitemap generation utility for Nexus TechHub
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nexustechhub.netlify.app';

// Static pages configuration
const staticPages = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString()
  },
  {
    url: '/iphone-parts',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/samsung-parts',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/ipad-parts',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString()
  },
  {
    url: '/repair-tools',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/lcd-buyback',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString()
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString()
  },
  {
    url: '/search',
    changefreq: 'weekly',
    priority: 0.5,
    lastmod: new Date().toISOString()
  }
];

// Product categories for dynamic pages
const productCategories = [
  'iphone-screens',
  'iphone-batteries',
  'iphone-cameras',
  'iphone-speakers',
  'samsung-screens',
  'samsung-batteries',
  'samsung-cameras',
  'ipad-screens',
  'ipad-batteries',
  'repair-tools-basic',
  'repair-tools-advanced',
  'lcd-buyback-iphone',
  'lcd-buyback-samsung'
];

// Generate sitemap XML
export function generateSitemap(products = []) {
  const urls = [];
  
  // Add static pages
  staticPages.forEach(page => {
    urls.push(createUrlEntry(page.url, page.lastmod, page.changefreq, page.priority));
  });
  
  // Add product category pages
  productCategories.forEach(category => {
    urls.push(createUrlEntry(
      `/category/${category}`,
      new Date().toISOString(),
      'weekly',
      0.8
    ));
  });
  
  // Add individual product pages
  products.forEach(product => {
    if (product.sku) {
      urls.push(createUrlEntry(
        `/products/${product.sku}`,
        product.updatedAt || new Date().toISOString(),
        'weekly',
        0.7
      ));
    }
  });
  
  // Add search result pages for popular terms
  const popularSearchTerms = [
    'iphone-screen',
    'samsung-battery',
    'ipad-parts',
    'repair-tools',
    'lcd-buyback'
  ];
  
  popularSearchTerms.forEach(term => {
    urls.push(createUrlEntry(
      `/search?q=${term}`,
      new Date().toISOString(),
      'weekly',
      0.4
    ));
  });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`;
  
  return sitemap;
}

// Create individual URL entry
function createUrlEntry(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Generate robots.txt
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /
Allow: /iphone-parts
Allow: /samsung-parts
Allow: /ipad-parts
Allow: /repair-tools
Allow: /lcd-buyback
Allow: /contact
Allow: /search

# Block specific file types
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.txt$

# UAE-specific crawling instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /`;
}

// Generate manifest.json for PWA
export function generateManifest() {
  return {
    name: "Nexus TechHub - Mobile Repair Parts UAE",
    short_name: "Nexus TechHub",
    description: "Professional mobile device repair parts and services in UAE",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en-AE",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any"
      }
    ],
    categories: ["business", "shopping", "utilities"],
    shortcuts: [
      {
        name: "iPhone Parts",
        short_name: "iPhone",
        description: "Browse iPhone repair parts",
        url: "/iphone-parts",
        icons: [{ src: "/icons/iphone-shortcut.png", sizes: "96x96" }]
      },
      {
        name: "Samsung Parts",
        short_name: "Samsung",
        description: "Browse Samsung repair parts",
        url: "/samsung-parts",
        icons: [{ src: "/icons/samsung-shortcut.png", sizes: "96x96" }]
      },
      {
        name: "Contact Us",
        short_name: "Contact",
        description: "Get in touch with Nexus TechHub",
        url: "/contact",
        icons: [{ src: "/icons/contact-shortcut.png", sizes: "96x96" }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  };
}

// Write sitemap to public directory
export async function writeSitemap(products = []) {
  try {
    const sitemap = generateSitemap(products);
    const publicDir = path.join(process.cwd(), 'public');
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write sitemap.xml
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    
    // Write robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    
    // Write manifest.json
    const manifest = generateManifest();
    fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    
    console.log('✅ Sitemap, robots.txt, and manifest.json generated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return false;
  }
}

// Get last modification date for dynamic content
export function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}
