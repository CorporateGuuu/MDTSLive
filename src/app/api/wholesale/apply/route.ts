import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Insert wholesale request into Supabase
    const { data, error } = await supabase
      .from('wholesale_requests')
      .insert({
        user_id: body.userId,
        user_email: body.userEmail,
        user_name: body.userName,
        business_name: body.businessName,
        business_type: body.businessType,
        phone: body.phone,
        address: body.address,
        tax_id: body.taxId,
        status: 'pending',
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, requestId: data.id });
  } catch (error) {
    console.error('Error processing wholesale application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
