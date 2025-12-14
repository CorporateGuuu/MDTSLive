import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

// Dynamic metadata for category pages with Supabase integration
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

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

    // Fetch category info
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!category) {
      return {
        title: 'Category Not Found - Midas Technical Solutions',
        description: 'Browse our premium wholesale phone parts and repair tools.',
      };
    }

    // Fetch product count for this category
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .eq('is_active', true);

    // Fetch featured product image for Open Graph
    const { data: featuredProduct } = await supabase
      .from('products')
      .select('images, thumbnail_url')
      .eq('category_id', category.id)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(1);

    const categoryImage = featuredProduct?.[0]?.images?.[0] ||
                          featuredProduct?.[0]?.thumbnail_url ||
                          '/logos/midas-category-og.jpg';

    // Dynamic title with category name
    const title = `${category.name} Parts Wholesale | Midas Technical Solutions`;

    // Dynamic description with category-specific keywords
    const description = `Bulk ${category.name.toLowerCase()} screens, batteries & tools – MidasGold 7.0 quality, lifetime warranty, fast shipping. ${productCount || 0}+ premium ${category.name.toLowerCase()} parts available. Authorized distributor with wholesale pricing.`;

    // Enhanced category-specific keywords
    const keywords = [
      `${category.name.toLowerCase()} parts wholesale`,
      `${category.name.toLowerCase()} bulk`,
      `wholesale ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} screens`,
      `${category.name.toLowerCase()} batteries`,
      `${category.name.toLowerCase()} repair tools`,
      'MidasGold 7.0',
      'lifetime warranty',
      'authorized distributor',
      'fast shipping',
      'bulk pricing',
      'premium quality',
      'phone repair parts',
      'mobile parts wholesale',
      `${category.name.toLowerCase()} replacement`,
      `${category.name.toLowerCase()} accessories`,
      `${category.name.toLowerCase()} components`
    ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://midastechnicalsolutions.com/category/${slug}`,
        siteName: 'Midas Technical Solutions',
        type: 'website',
        images: [
          {
            url: categoryImage,
            width: 1200,
            height: 630,
            alt: `${category.name} Parts Wholesale - Premium Phone Repair Components`,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [categoryImage],
        creator: '@MidasTechnical',
      },
      other: {
        'product:category': category.name,
        'product:retailer': 'Midas Technical Solutions',
        'product:retailer_title': 'Midas Technical Solutions Wholesale',
        'business:contact_data:locality': 'Miami',
        'business:contact_data:region': 'FL',
        'business:contact_data:country_name': 'United States',
      },
    };
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category - Midas Technical Solutions',
      description: 'Browse our premium wholesale phone parts and repair tools.',
    };
  }
}

// ISR configuration for fresh category data
export const revalidate = 3600; // Revalidate every hour
