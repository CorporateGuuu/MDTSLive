import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create server Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch categories from Supabase
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (categoriesError) {
      console.error('Error fetching categories for sitemap:', categoriesError);
    }

    // Fetch products from Supabase (limit to prevent huge sitemap)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(2000); // Reasonable limit for sitemap size

    if (productsError) {
      console.error('Error fetching products for sitemap:', productsError);
    }

    // Get current date for homepage and fallback
    const currentDate = new Date().toISOString();
    const baseUrl = 'https://midastechnicalsolutions.com';

    // Build XML sitemap
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage - highest priority
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${baseUrl}/</loc>\n`;
    xmlContent += '    <changefreq>daily</changefreq>\n';
    xmlContent += '    <priority>1.0</priority>\n';
    xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
    xmlContent += '  </url>\n';

    // Static pages
    const staticPages = [
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/quality-standards', priority: '0.6', changefreq: 'monthly' },
      { path: '/support', priority: '0.6', changefreq: 'monthly' },
      { path: '/bulk-orders', priority: '0.5', changefreq: 'monthly' },
      { path: '/trade-in', priority: '0.5', changefreq: 'monthly' },
      { path: '/technical-support', priority: '0.5', changefreq: 'monthly' },
      { path: '/warranty', priority: '0.5', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      xmlContent += '  <url>\n';
      xmlContent += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xmlContent += `    <priority>${page.priority}</priority>\n`;
      xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
      xmlContent += '  </url>\n';
    });

    // Dynamic categories
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const lastmod = category.updated_at || currentDate;
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.8</priority>\n';
        xmlContent += `    <lastmod>${lastmod}</lastmod>\n`;
        xmlContent += '  </url>\n';
      });
    } else {
      // Fallback static categories if Supabase fails
      const fallbackCategories = ['iphone-parts', 'samsung-parts', 'tools-supplies'];
      fallbackCategories.forEach(categorySlug => {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${baseUrl}/category/${categorySlug}</loc>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.8</priority>\n';
        xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
        xmlContent += '  </url>\n';
      });
    }

    // Dynamic products
    if (products && products.length > 0) {
      products.forEach(product => {
        const lastmod = product.updated_at || currentDate;
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${baseUrl}/product/${product.slug}</loc>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.6</priority>\n';
        xmlContent += `    <lastmod>${lastmod}</lastmod>\n`;
        xmlContent += '  </url>\n';
      });
    } else {
      // Fallback static products if Supabase fails
      const fallbackProducts = [
        'midas-precision-repair-toolkit-pro',
        'iphone-16-pro-max-midasgold-7-0-oled-screen',
        'galaxy-s25-ultra-midasgold-7-0-oled-screen',
        'midasgold-7-0-adhesive-kit'
      ];
      fallbackProducts.forEach(productSlug => {
        xmlContent += '  <url>\n';
        xmlContent += `    <loc>${baseUrl}/product/${productSlug}</loc>\n`;
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.6</priority>\n';
        xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
        xmlContent += '  </url>\n';
      });
    }

    xmlContent += '</urlset>';

    // Return XML response
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);

    // Fallback static sitemap
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://midastechnicalsolutions.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://midastechnicalsolutions.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://midastechnicalsolutions.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://midastechnicalsolutions.com/category/iphone-parts</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://midastechnicalsolutions.com/category/samsung-parts</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://midastechnicalsolutions.com/product/midas-precision-repair-toolkit-pro</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}
