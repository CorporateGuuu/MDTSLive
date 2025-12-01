import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, uploadFileToStorage } from '../../../../lib/supabase/admin';
import { getUserFromCookie, requireAdmin } from '../../../../lib/auth';
import { updateProductSchema, productImageFileSchema } from '../../../../lib/validate';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product with category, brand, and reviews joins
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          name
        ),
        brands (
          name
        ),
        product_reviews (
          rating
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Product fetch error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Calculate average rating and review count
    const reviews = product.product_reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    // Remove reviews from response and add aggregated data
    const { product_reviews, ...productData } = product;

    const response = NextResponse.json({
      ...productData,
      reviews: {
        count: reviewCount,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      }
    });

    // Add cache control for 300 seconds (5 minutes)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;

  } catch (error) {
    console.error('Products GET [id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Parse FormData
    const formData = await request.formData();

    // Extract product data from form
    const productData: Record<string, any> = {};
    let imageFile: File | null = null;

    // Parse form fields
    const formEntries = Array.from(formData.entries());
    for (const [key, value] of formEntries) {
      if (key === 'imageFile' && value instanceof File) {
        imageFile = value;
      } else if (key === 'price' || key === 'discount_percentage' || key === 'stock_quantity') {
        productData[key] = parseFloat(value as string);
      } else if (key === 'is_active') {
        productData[key] = value === 'true';
      } else {
        productData[key] = value;
      }
    }

    // Validate product data
    const validationResult = updateProductSchema.safeParse(productData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Validate image file if provided
    if (imageFile) {
      const fileValidation = productImageFileSchema.safeParse({ imageFile });
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: 'File validation error', details: fileValidation.error.issues },
          { status: 400 }
        );
      }
    }

    const updateData = validationResult.data;

    // Check if slug is unique (if being updated)
    if (updateData.slug) {
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single();

      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Upload image if provided
    if (imageFile) {
      try {
        const imageUrl = await uploadFileToStorage(imageFile, 'products');
        updateData.image_url = imageUrl;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Update product
    const { data: product, error: updateError } = await supabaseAdmin
      .from('products')
      .update(updateData as any)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `)
      .single();

    if (updateError) {
      console.error('Product update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Products PUT [id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (soft delete by setting is_active to false)
    const { error: deleteError } = await (supabaseAdmin as any)
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (deleteError) {
      console.error('Product delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      id
    });

  } catch (error) {
    console.error('Products DELETE [id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
