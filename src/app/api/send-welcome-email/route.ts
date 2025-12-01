import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await sendWelcomeEmail({ email, name, role });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Welcome email sent successfully' });
    } else {
      console.error('Failed to send welcome email:', result.error);
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send-welcome-email API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
