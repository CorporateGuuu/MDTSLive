import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

// =============================================================================
// Midas Technical Solutions - Categories API Route
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get categories with product count using a left join
    // Since Supabase doesn't support COUNT with GROUP BY in a simple way,
    // we'll get all categories and then count products for each
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, image_url')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (categoriesError) {
      console.error('Categories fetch error:', categoriesError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (!categories || categories.length === 0) {
      const response = NextResponse.json({ categories: [] });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return response;
    }

    // Get product counts for each category
    const categoryIds = categories.map(cat => cat.id);
    const { data: productCounts, error: countError } = await supabaseAdmin
      .from('products')
      .select('category_id')
      .in('category_id', categoryIds)
      .eq('is_active', true);

    if (countError) {
      console.error('Product count error:', countError);
      // Continue without counts rather than failing
    }

    // Count products per category
    const countMap = new Map<string, number>();
    if (productCounts) {
      productCounts.forEach(product => {
        if (product.category_id) {
          countMap.set(product.category_id, (countMap.get(product.category_id) || 0) + 1);
        }
      });
    }

    // Combine categories with product counts
    const categoriesWithCounts = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image_url,
      product_count: countMap.get(category.id) || 0,
    }));

    const response = NextResponse.json({
      categories: categoriesWithCounts
    });

    // Cache for 1 hour (3600 seconds)
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

    return response;

  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
