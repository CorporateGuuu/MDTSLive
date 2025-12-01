import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';
import { cookies } from 'next/headers';
import { validateData, addToCartSchema } from '../../../lib/validate';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify the session using the service role client
    const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(token);

    if (sessionError || !user) {
      console.error('Session verification error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get user's cart items with product details
    const { data: cartItems, error: cartError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          name,
          price,
          discount_percentage,
          images,
          thumbnail_url
        )
      `)
      .eq('user_id', user.id);

    if (cartError) {
      console.error('Cart fetch error:', cartError);
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      );
    }

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    const items = cartItems.map(item => {
      const product = item.products;
      const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
      const itemTotal = discountedPrice * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPercentage: product.discount_percentage || 0,
        discountedPrice: discountedPrice,
        quantity: item.quantity,
        image: product.thumbnail_url || (product.images && product.images[0]) || null,
        total: itemTotal,
      };
    });

    return NextResponse.json(
      {
        items,
        subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
        itemCount: items.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store', // User-specific data, no caching
        },
      }
    );

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify the session using the service role client
    const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(token);

    if (sessionError || !user) {
      console.error('Session verification error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = validateData(addToCartSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { productId, quantity } = validationResult.data;

    // Verify product exists
    const { data: product, error: productError } = await (supabaseAdmin as any)
      .from('products')
      .select('id, stock_quantity')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const { data: existingCartItem, error: cartCheckError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    const currentQuantity = existingCartItem?.quantity || 0;
    const newQuantity = currentQuantity + quantity;

    // Check stock availability
    if (product.stock_quantity < newQuantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Insert or update cart item
    const { data: cartItem, error: upsertError } = await (supabaseAdmin as any)
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity: newQuantity,
        },
        {
          onConflict: 'user_id,product_id',
        }
      )
      .select(`
        quantity,
        products (
          id,
          name,
          price,
          discount_percentage,
          images,
          thumbnail_url
        )
      `)
      .single();

    if (upsertError) {
      console.error('Cart upsert error:', upsertError);
      return NextResponse.json(
        { error: 'Failed to add item to cart' },
        { status: 500 }
      );
    }

    // Get full updated cart
    const { data: cartItems, error: cartError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          name,
          price,
          discount_percentage,
          images,
          thumbnail_url
        )
      `)
      .eq('user_id', user.id);

    if (cartError) {
      console.error('Cart fetch error:', cartError);
      return NextResponse.json(
        { error: 'Failed to fetch updated cart' },
        { status: 500 }
      );
    }

    // Calculate subtotal for full cart
    let subtotal = 0;
    const items = cartItems.map((item: any) => {
      const product = item.products;
      const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
      const itemTotal = discountedPrice * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPercentage: product.discount_percentage || 0,
        discountedPrice: discountedPrice,
        quantity: item.quantity,
        image: product.thumbnail_url || (product.images && product.images[0]) || null,
        total: itemTotal,
      };
    });

    return NextResponse.json(
      {
        items,
        subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
        itemCount: items.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store', // User-specific data, no caching
        },
      }
    );

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify the session using the service role client
    const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(token);

    if (sessionError || !user) {
      console.error('Session verification error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Clear all cart items for the user
    const { error: deleteError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Cart clear error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Cart cleared successfully',
      items: [],
      subtotal: 0,
      itemCount: 0,
    });

  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
