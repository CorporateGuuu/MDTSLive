import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with full join
    const { data: order, error: orderError } = await (supabaseAdmin as any)
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            *,
            categories (
              name
            )
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)  // Ownership check
      .single();

    if (orderError || !order) {
      console.error('Order fetch error:', orderError);
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Calculate total from items (as verification)
    let calculatedTotal = 0;
    const processedItems = order.order_items.map((item: any) => {
      const discountedPrice = item.unit_price * (1 - (item.discount_percentage || 0) / 100);
      const itemTotal = discountedPrice * item.quantity;
      calculatedTotal += itemTotal;

      return {
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name,
        product_image: item.products?.image_url,
        category_name: item.products?.categories?.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        total_price: Math.round(itemTotal * 100) / 100,
      };
    });

    // Round calculated total to 2 decimal places
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // Verify total matches (optional - for data integrity)
    if (Math.abs(order.total_amount - calculatedTotal) > 0.01) {
      console.warn(`Order total mismatch: stored=${order.total_amount}, calculated=${calculatedTotal}`);
    }

    // Format shipping address
    const shippingAddress = {
      full_name: order.shipping_full_name,
      phone: order.shipping_phone,
      address_line1: order.shipping_address_line1,
      address_line2: order.shipping_address_line2,
      city: order.shipping_city,
      state: order.shipping_state,
      postal_code: order.shipping_postal_code,
      country: order.shipping_country,
    };

    // Return formatted order data
    const orderResponse = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_amount: order.total_amount,
      shipping_address: shippingAddress,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      items: processedItems,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    return NextResponse.json(orderResponse, {
      headers: {
        'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600', // 5 min cache
      },
    });

  } catch (error) {
    console.error('Order detail fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
