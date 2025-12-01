import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

// =============================================================================
// Midas Technical Solutions - Brands API Route
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get brands with product count
    // Since Supabase doesn't support COUNT with GROUP BY in a simple way,
    // we'll get all brands and then count products for each
    const { data: brands, error: brandsError } = await supabaseAdmin
      .from('brands')
      .select('id, name, logo_url')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (brandsError) {
      console.error('Brands fetch error:', brandsError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (!brands || brands.length === 0) {
      const response = NextResponse.json({ brands: [] });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return response;
    }

    // Get product counts for each brand
    const brandIds = brands.map(brand => brand.id);
    const { data: productCounts, error: countError } = await supabaseAdmin
      .from('products')
      .select('brand_id')
      .in('brand_id', brandIds)
      .eq('is_active', true);

    if (countError) {
      console.error('Product count error:', countError);
      // Continue without counts rather than failing
    }

    // Count products per brand
    const countMap = new Map<string, number>();
    if (productCounts) {
      productCounts.forEach(product => {
        if (product.brand_id) {
          countMap.set(product.brand_id, (countMap.get(product.brand_id) || 0) + 1);
        }
      });
    }

    // Combine brands with product counts
    const brandsWithCounts = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      logo_url: brand.logo_url,
      product_count: countMap.get(brand.id) || 0,
    }));

    const response = NextResponse.json({
      brands: brandsWithCounts
    });

    // Cache for 1 hour (3600 seconds)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

    return response;

  } catch (error) {
    console.error('Brands GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
