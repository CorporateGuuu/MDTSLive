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
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const wholesale_approved = searchParams.get('wholesale_approved');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('profiles')
      .select(`
        *,
        wholesale_requests (
          status,
          applied_at,
          business_name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }

    if (wholesale_approved !== null) {
      query = query.eq('wholesale_approved', wholesale_approved === 'true');
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Users fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      users: users || [],
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
    console.error('Admin users GET error:', error);
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

    const { userId, role, wholesale_approved } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate role values
    const validRoles = ['admin', 'wholesale', 'retail'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Update user profile
    const updateData: {
      role?: string;
      wholesale_approved?: boolean;
    } = {};

    if (role) updateData.role = role;
    if (wholesale_approved !== undefined) updateData.wholesale_approved = wholesale_approved;

    const { data: profile, error } = await (supabaseAdmin as any)
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select(`
        *,
        wholesale_requests (
          status,
          applied_at,
          business_name
        )
      `)
      .single();

    if (error) {
      console.error('User update error:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
