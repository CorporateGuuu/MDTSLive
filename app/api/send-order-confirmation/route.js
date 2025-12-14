import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { order_id, email, order_details } = await req.json();

    if (!order_id || !email || !order_details) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user profile for personalized email
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', order_details.user_id)
      .single();

    const customerName = profile ? `${profile.first_name} ${profile.last_name}` : 'Valued Customer';

    // Send order confirmation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Midas Technical Solutions <orders@midastechnical.com>',
      to: email,
      subject: `Order Confirmation #${order_id}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #FFD700); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .total { font-size: 18px; font-weight: bold; color: #D4AF37; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #D4AF37; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for choosing Midas Technical Solutions</p>
          </div>

          <div class="content">
            <p>Dear ${customerName},</p>

            <p>Your order has been successfully processed and confirmed. Here are the details:</p>

            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> #${order_id}</p>
              <p><strong>Order Date:</strong> ${new Date(order_details.created_at).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> <span class="total">$${order_details.total?.toFixed(2)}</span></p>
              <p><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">Paid</span></p>
            </div>

            <h3>What's Next?</h3>
            <ul>
              <li>📧 You'll receive shipping updates via email</li>
              <li>📦 Order processing: 1-2 business days</li>
              <li>🚚 Free shipping on all orders</li>
              <li>🔄 30-day return policy with lifetime warranty</li>
            </ul>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders" class="button">
                View Order Details
              </a>
            </p>

            <p>Questions about your order? Contact our support team at support@midastechnical.com</p>

            <p>Thank you for choosing Midas Technical Solutions!</p>
          </div>

          <div class="footer">
            <p>Midas Technical Solutions - Premium Mobile Parts & Accessories</p>
            <p>Questions? Visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact">contact page</a></p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true, emailId: emailData?.id });

  } catch (error) {
    console.error('Order confirmation email error:', error);
    return Response.json(
      { error: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}
