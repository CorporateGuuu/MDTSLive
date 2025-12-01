import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';
import { getUserFromCookie, requireAdmin } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 100);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          email
        ),
        order_items (
          quantity,
          unit_price,
          discount_percentage,
          total_price,
          products (
            name,
            sku
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,profiles.email.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

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

    response.headers.set('X-Total-Count', (count || 0).toString());
    return response;

  } catch (error) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

    const { orderId, status, payment_status } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    // Update order
    const updateData: {
      updated_at: string;
      status?: string;
      payment_status?: string;
    } = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;

    const { data: order, error } = await (supabaseAdmin as any)
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          email
        ),
        order_items (
          quantity,
          unit_price,
          discount_percentage,
          total_price,
          products (
            name,
            sku
          )
        )
      `)
      .single();

    if (error) {
      console.error('Order update error:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Admin orders PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
