import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabaseClient';
import { getUserFromCookie, requireAdmin } from '../../../../../lib/auth';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Auth check: require admin role
    const user = await getUserFromCookie();
    await requireAdmin(user.id);

    const formData = await request.formData();
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user details before approval
    const { data: userData, error: fetchError } = await (supabaseAdmin as any)
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', userId)
      .single();

    if (fetchError || !userData) {
      console.error('User fetch error:', fetchError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role to approved
    const { error } = await (supabaseAdmin as any)
      .from('profiles')
      .update({ role: 'approved' })
      .eq('id', userId);

    if (error) {
      console.error('User approval error:', error);
      return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 });
    }

    // Send approval email
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.error('Missing RESEND_API_KEY environment variable');
        return NextResponse.redirect('/admin/users');
      }

      const resend = new Resend(apiKey);
      const templatePath = path.join(process.cwd(), 'emails', 'wholesale-approval.html');
      let template = fs.readFileSync(templatePath, 'utf8');

      // Replace placeholder with user's name
      const fullName = `${userData.first_name} ${userData.last_name}`.trim();
      template = template.replace('{{name}}', fullName);

      await resend.emails.send({
        from: 'Midas Technical Solutions <sales@midastechnical.com>',
        to: userData.email,
        subject: 'Welcome to Midas Technical Solutions – #1 Wholesale Parts Supplier\'s #1 Wholesale Parts Supplier',
        html: template,
      });

      console.log('Approval email sent to:', userData.email);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.redirect('/admin/users');
  } catch (error) {
    console.error('Admin user approval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
