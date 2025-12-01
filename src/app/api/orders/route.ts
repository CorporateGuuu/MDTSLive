import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';
import { cookies } from 'next/headers';
import { validateData, createOrderSchema } from '../../../lib/validate';

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 50);
    const status = searchParams.get('status');

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query for user's orders
    let query = (supabaseAdmin as any)
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url,
            price
          )
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Create response with total count in headers
    const response = NextResponse.json({
      orders: orders || [],
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

    // Add cache control for 60 seconds (1 minute)
    response.headers.set('Cache-Control', 'private, s-maxage=60, stale-while-revalidate=120');

    return response;

  } catch (error) {
    console.error('Orders GET error:', error);
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
    const validationResult = validateData(createOrderSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { shippingAddress, paymentMethod } = validationResult.data;

    // Fetch user's cart items with product details
    const { data: cartItems, error: cartError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select(`
        quantity,
        products (
          id,
          name,
          price,
          discount_percentage,
          stock_quantity
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
        { status: 400 }
      );
    }

    // Validate stock availability for all items
    for (const item of cartItems) {
      const product = item.products;
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
          },
          { status: 400 }
        );
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cartItems.map((item: any) => {
      const product = item.products;
      const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
      const itemTotal = discountedPrice * item.quantity;
      totalAmount += itemTotal;

      return {
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        discount_percentage: product.discount_percentage || 0,
        total_price: Math.round(itemTotal * 100) / 100, // Round to 2 decimal places
      };
    });

    // Round total amount to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabaseAdmin
      .rpc('generate_order_number');

    if (orderNumberError || !orderNumberData) {
      console.error('Order number generation error:', orderNumberError);
      return NextResponse.json(
        { error: 'Failed to generate order number' },
        { status: 500 }
      );
    }

    const orderNumber = orderNumberData;

    // Start transaction-like operations (Supabase doesn't have explicit transactions in this context)
    // We'll perform operations in sequence and rollback on error

    let orderId: string | undefined;
    let createdOrderItems: any[] = [];

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await (supabaseAdmin as any)
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totalAmount,
          shipping_full_name: shippingAddress.fullName,
          shipping_phone: shippingAddress.phone,
          shipping_address_line1: shippingAddress.addressLine1,
          shipping_address_line2: shippingAddress.addressLine2,
          shipping_city: shippingAddress.city,
          shipping_state: shippingAddress.state,
          shipping_postal_code: shippingAddress.postalCode,
          shipping_country: shippingAddress.country,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        })
        .select('id')
        .single();

      if (orderError || !order) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order');
      }

      orderId = order.id;

      // 2. Create order items
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: orderId,
      }));

      const { data: insertedOrderItems, error: orderItemsError } = await (supabaseAdmin as any)
        .from('order_items')
        .insert(orderItemsWithOrderId)
        .select(`
          id,
          product_id,
          quantity,
          unit_price,
          discount_percentage,
          total_price,
          products (
            id,
            name,
            price,
            discount_percentage
          )
        `);

      if (orderItemsError || !insertedOrderItems) {
        console.error('Order items creation error:', orderItemsError);
        throw new Error('Failed to create order items');
      }

      createdOrderItems = insertedOrderItems;

      // 3. Clear the cart
      const { error: clearCartError } = await (supabaseAdmin as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) {
        console.error('Cart clear error:', clearCartError);
        throw new Error('Failed to clear cart');
      }

      // 4. Reduce product stock
      for (const item of cartItems) {
        const product = (item as any).products;
        const newStockQuantity = product.stock_quantity - item.quantity;

        const { error: stockUpdateError } = await (supabaseAdmin as any)
          .from('products')
          .update({ stock_quantity: newStockQuantity })
          .eq('id', product.id);

        if (stockUpdateError) {
          console.error(`Stock update error for product ${product.id}:`, stockUpdateError);
          throw new Error(`Failed to update stock for ${product.name}`);
        }
      }

      // Success! Return the order with items
      const orderResponse = {
        id: orderId,
        order_number: orderNumber,
        status: 'pending',
        total_amount: totalAmount,
        shipping_address: {
          full_name: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address_line1: shippingAddress.addressLine1,
          address_line2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        items: createdOrderItems.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.products?.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_percentage: item.discount_percentage,
          total_price: item.total_price,
        })),
        created_at: new Date().toISOString(),
      };

      return NextResponse.json(orderResponse, { status: 201 });

    } catch (error) {
      // Rollback operations (this is a simplified rollback since Supabase doesn't have explicit transactions)
      console.error('Order creation failed, attempting rollback:', error);

      // Try to delete the order if it was created
      if (orderId) {
        try {
          await (supabaseAdmin as any)
            .from('orders')
            .delete()
            .eq('id', orderId);
          console.log('Order rolled back successfully');
        } catch (rollbackError) {
          console.error('Failed to rollback order:', rollbackError);
        }
      }

      // Try to restore cart items
      if (cartItems && cartItems.length > 0) {
        try {
          const cartRestoreData = cartItems.map((item: any) => ({
            user_id: user.id,
            product_id: item.products.id,
            quantity: item.quantity,
          }));

          await (supabaseAdmin as any)
            .from('cart_items')
            .insert(cartRestoreData);
          console.log('Cart items restored successfully');
        } catch (cartRestoreError) {
          console.error('Failed to restore cart items:', cartRestoreError);
        }
      }

      // Try to restore product stock
      if (cartItems && cartItems.length > 0) {
        for (const item of cartItems) {
          try {
            const product = (item as any).products;
            const restoredStock = product.stock_quantity; // Original stock was already fetched

            await (supabaseAdmin as any)
              .from('products')
              .update({ stock_quantity: restoredStock })
              .eq('id', product.id);
          } catch (stockRestoreError) {
            console.error(`Failed to restore stock for product ${(item as any).products.id}:`, stockRestoreError);
          }
        }
      }

      return NextResponse.json(
        { error: 'Order creation failed. All changes have been rolled back.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
