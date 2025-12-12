import { Resend } from 'resend';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Missing RESEND_API_KEY environment variable' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { email, name } = await req.json();

  try {
    await resend.emails.send({
      from: 'Midas Technical Solutions <welcome@midastechnical.com>',
      to: email,
      subject: 'Welcome to Midas Technical Solutions Wholesale',
      html: `
        <div style="font-family: Arial, sans-serif; color: white; background: #000; padding: 40px; text-align: center;">
          <h1 style="font-size: 48px; font-weight: 900; background: linear-gradient(to right, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Welcome ${name || ''}!
          </h1>
          <p style="font-size: 20px; color: #aaa; margin: 30px 0;">
            You're now part of the most exclusive iPhone parts wholesale network in the world.
          </p>
          <a href="https://yoursite.com/dashboard" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #3b82f6); color: white; padding: 20px 50px; border-radius: 50px; font-weight: bold; text-decoration: none; margin-top: 30px;">
            Access Your Dashboard
          </a>
          <p style="margin-top: 50px; color: #555;">
            — The Midas Technical Solutions Team
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
