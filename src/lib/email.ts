import { Resend } from 'resend';

export interface WelcomeEmailData {
  email: string;
  name?: string;
  role: string;
}

export async function sendWelcomeEmail({ email, name, role }: WelcomeEmailData) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return { success: false, error: 'Missing API key' };
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Nexus Tech Hub <welcome@nexustechhub.com>',
      to: [email],
      subject: 'Welcome to Nexus Tech Hub - Your Wholesale Account is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Nexus Tech Hub</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Nexus Tech Hub</h1>
              <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px;">Your wholesale account is now active!</p>
            </div>

            <div style="background: white; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #0f172a; margin-top: 0;">Hello ${name || 'Valued Customer'}!</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for joining Nexus Tech Hub. Your ${role === 'wholesale' ? 'wholesale' : 'customer'} account has been successfully created and is ready to use.
              </p>

              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0f172a; margin-top: 0;">What's Next?</h3>
                <ul style="padding-left: 20px;">
                  <li><strong>Browse Products:</strong> Explore our extensive catalog of premium phone parts</li>
                  <li><strong>Wholesale Pricing:</strong> Access competitive pricing for bulk orders</li>
                  <li><strong>Fast Shipping:</strong> Quick delivery on all orders</li>
                  <li><strong>24/7 Support:</strong> Our team is here to help</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com'}/login"
                   style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Access Your Account
                </a>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                Questions? Contact our support team at <a href="mailto:support@nexustechhub.com" style="color: #06b6d4;">support@nexustechhub.com</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

              <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                Nexus Tech Hub - Official Apple, Samsung & Google Parts<br>
                Lifetime Warranty • Fast Shipping • Wholesale Pricing
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
