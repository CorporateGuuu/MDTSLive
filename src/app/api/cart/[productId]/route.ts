import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';
import { cookies } from 'next/headers';
import { validateData, updateCartItemSchema } from '../../../../lib/validate';

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
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

    const { productId } = params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = validateData(updateCartItemSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { quantity } = validationResult.data;

    // Check if item exists in user's cart
    const { data: existingItem, error: checkError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError || !existingItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // If quantity is 0 or less, delete the item
    if (quantity <= 0) {
      const { error: deleteError } = await (supabaseAdmin as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (deleteError) {
        console.error('Cart item delete error:', deleteError);
        return NextResponse.json(
          { error: 'Failed to remove item from cart' },
          { status: 500 }
        );
      }
    } else {
      // Update the quantity
      const { error: updateError } = await (supabaseAdmin as any)
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (updateError) {
        console.error('Cart item update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update item quantity' },
          { status: 500 }
        );
      }
    }

    // Get updated cart
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
    console.error('Cart item PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
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

    const { productId } = params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if item exists in user's cart (ownership check)
    const { data: existingItem, error: checkError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError || !existingItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Delete the specific cart item
    const { error: deleteError } = await (supabaseAdmin as any)
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Cart item delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove item from cart' },
        { status: 500 }
      );
    }

    // Get updated cart
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
    console.error('Cart item DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
