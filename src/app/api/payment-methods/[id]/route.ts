import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

// DELETE /api/payment-methods/[id] - Remove a payment method
export async function DELETE(
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
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const paymentMethodId = params.id;

    // First, verify the payment method belongs to the user
    const { data: existingPaymentMethod, error: fetchError } = await (supabaseAdmin as any)
      .from('payment_methods')
      .select('id, user_id, braintree_token')
      .eq('id', paymentMethodId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingPaymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Here you would typically:
    // 1. Delete the payment method from Braintree using the token
    // 2. Then delete from your database

    // For demo purposes, we'll just delete from the database
    const { error: deleteError } = await (supabaseAdmin as any)
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting payment method:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete payment method' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
