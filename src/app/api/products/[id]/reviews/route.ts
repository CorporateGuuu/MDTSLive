import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabaseClient';
import { getUserFromCookie } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 50);
    const sort = searchParams.get('sort') || 'newest'; // newest, oldest, highest, lowest

    const offset = (page - 1) * limit;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Build query based on sort option
    let orderBy = 'created_at';
    let ascending = false;

    switch (sort) {
      case 'oldest':
        ascending = true;
        break;
      case 'highest':
        orderBy = 'rating';
        ascending = false;
        break;
      case 'lowest':
        orderBy = 'rating';
        ascending = true;
        break;
      case 'newest':
      default:
        orderBy = 'created_at';
        ascending = false;
        break;
    }

    const { data: reviews, error, count } = await (supabaseAdmin as any)
      .from('product_reviews')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name
        ),
        review_images (
          image_url
        )
      `, { count: 'exact' })
      .eq('product_id', id)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Reviews fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Calculate average rating and rating distribution
    const { data: ratingStats } = await supabaseAdmin
      .from('product_reviews')
      .select('rating')
      .eq('product_id', id);

    let averageRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (ratingStats && ratingStats.length > 0) {
      const totalRating = ratingStats.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Math.round((totalRating / ratingStats.length) * 10) / 10;

      ratingStats.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });
    }

    const response = NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1,
      },
      stats: {
        totalReviews: count || 0,
        averageRating,
        ratingDistribution,
      }
    });

    response.headers.set('X-Total-Count', (count || 0).toString());
    return response;

  } catch (error) {
    console.error('Product reviews GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromCookie();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { rating, title, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabaseAdmin
      .from('product_reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Check if user has purchased this product (for verified purchase)
    const { data: purchaseCheck } = await supabaseAdmin
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .eq('orders.user_id', user.id)
      .single();

    const isVerifiedPurchase = !!purchaseCheck;

    // Insert review
    const { data: review, error } = await supabaseAdmin
      .from('product_reviews')
      .insert({
        user_id: user.id,
        product_id: id,
        rating,
        title,
        comment,
        is_verified_purchase: isVerifiedPurchase,
      })
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name
        )
      `)
      .single();

    if (error) {
      console.error('Review creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    return NextResponse.json(review, { status: 201 });

  } catch (error) {
    console.error('Product reviews POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
