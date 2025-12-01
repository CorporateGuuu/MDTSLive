import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, uploadFileToStorage } from '../../../lib/supabase/admin';
import { cookies } from 'next/headers';
import { success, apiError, handleApiError, createPaginationMeta } from '../../../lib/api';
import { getUserFromCookie, requireAdmin } from '../../../lib/auth';
import { validateData, createProductSchema, updateProductSchema, productImageFileSchema } from '../../../lib/validate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 100);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const inStock = searchParams.get('in_stock');

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build optimized Supabase query with selective field selection
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        discount_percentage,
        stock_quantity,
        image_url,
        created_at,
        updated_at,
        category_id,
        brand_id,
        categories!inner (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .eq('is_active', true); // Only active products

    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category);
    }

    if (brand) {
      query = query.eq('brands.slug', brand);
    }

    if (search) {
      query = query.ilike('name', search);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      query = query.gt('stock_quantity', 0);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Create response with total count in headers
    const response = NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1,
      }
    });

    // Add total count to headers
    response.headers.set('X-Total-Count', (count || 0).toString());

    // Add cache control for 60 seconds
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;

  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

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
    const validationResult = createProductSchema.safeParse(productData);
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

    const finalProductData = validationResult.data;

    // Check if slug is unique
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', finalProductData.slug)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    // Upload image if provided
    if (imageFile) {
      try {
        const imageUrl = await uploadFileToStorage(imageFile, 'products');
        finalProductData.image_url = imageUrl;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create product
    const { data: product, error: createError } = await supabaseAdmin
      .from('products')
      .insert(finalProductData as any)
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

    if (createError) {
      console.error('Product creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
