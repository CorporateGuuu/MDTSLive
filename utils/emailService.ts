import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Email service configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend'; // 'resend' or 'supabase'
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize services
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Email templates
const templates = {
  welcome: (user: { first_name: string; last_name: string; email: string }) => ({
    subject: 'Welcome to Nexus TechHub!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Nexus TechHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Nexus TechHub!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name}!</h2>
            <p>Thank you for joining Nexus TechHub, your trusted source for premium repair parts and tools.</p>

            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Browse our extensive catalog of MacBook parts and repair tools</li>
              <li>Track your orders and repair history</li>
              <li>Access exclusive deals and promotions</li>
              <li>Get expert repair advice and support</li>
            </ul>

            <p>Ready to get started? Explore our products and find everything you need for your repair projects.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com'}/products" class="button">Start Shopping</a>

            <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@nexustechhub.com">support@nexustechhub.com</a></p>

            <p>Happy repairing!<br>The Nexus TechHub Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${user.email}. If you didn't create an account, please ignore this email.</p>
            <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order: any, user: { first_name: string; last_name: string; email: string }) => ({
    subject: `Order Confirmation #${order.order_number} - Nexus TechHub`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name}!</h2>
            <p>Thank you for your order! Your order #${order.order_number} has been successfully placed.</p>

            <div class="order-details">
              <h3>Order Details</h3>
              ${order.items.map((item: any) => `
                <div class="item">
                  <strong>${item.product_name || item.name}</strong> - Quantity: ${item.quantity} - $${item.total_price?.toFixed(2) || item.price?.toFixed(2)}
                </div>
              `).join('')}
              <div class="total">
                Total: $${order.total_amount?.toFixed(2) || order.total?.toFixed(2)}
              </div>
            </div>

            <p>You can track your order status in your account dashboard.</p>

            <p>If you have any questions about your order, please contact us at <a href="mailto:support@nexustechhub.com">support@nexustechhub.com</a></p>

            <p>Thank you for choosing Nexus TechHub!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  wholesaleApproval: (request: any, user: { first_name: string; last_name: string; email: string }) => ({
    subject: 'Wholesale Application Approved - Nexus TechHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Wholesale Application Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Approved!</h1>
          </div>
          <div class="content">
            <h2>Congratulations ${user.first_name} ${user.last_name}!</h2>
            <p>Your wholesale application for <strong>${request.business_name}</strong> has been approved!</p>

            <p>You now have access to:</p>
            <ul>
              <li>Wholesale pricing on all products</li>
              <li>Bulk order discounts</li>
              <li>Priority customer support</li>
              <li>Dedicated account manager</li>
            </ul>

            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com'}/account" class="button">Access Your Account</a>

            <p>If you have any questions about your wholesale account, please contact us at <a href="mailto:wholesale@nexustechhub.com">wholesale@nexustechhub.com</a></p>

            <p>Welcome to the Nexus TechHub wholesale family!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  wholesaleRejection: (request: any, user: { first_name: string; last_name: string; email: string }) => ({
    subject: 'Wholesale Application Update - Nexus TechHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Wholesale Application Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name},</h2>
            <p>Thank you for your interest in our wholesale program. After careful review of your application for <strong>${request.business_name}</strong>, we regret to inform you that we are unable to approve your wholesale account at this time.</p>

            <p>You can still shop with us as a retail customer and enjoy all our products at standard pricing.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexustechhub.com'}/products" class="button">Continue Shopping</a>

            <p>If you have any questions or would like to reapply in the future, please contact us at <a href="mailto:wholesale@nexustechhub.com">wholesale@nexustechhub.com</a></p>

            <p>Thank you for your understanding.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderStatusUpdate: (order: any, user: { first_name: string; last_name: string; email: string }) => ({
    subject: `Order Status Update #${order.order_number} - Nexus TechHub`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.first_name} ${user.last_name}!</h2>
            <p>Your order #${order.order_number} status has been updated.</p>

            <div class="status">
              <h3>Current Status</h3>
              <span class="status-badge" style="background: ${
                order.status === 'confirmed' ? '#28a745' :
                order.status === 'processing' ? '#ffc107' :
                order.status === 'shipped' ? '#17a2b8' :
                order.status === 'delivered' ? '#28a745' :
                order.status === 'cancelled' ? '#dc3545' : '#6c757d'
              }; color: white;">${order.status}</span>
            </div>

            <p>You can track your order status in your account dashboard.</p>

            <p>If you have any questions about your order, please contact us at <a href="mailto:support@nexustechhub.com">support@nexustechhub.com</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Email service class
class EmailService {
  private provider: string;

  constructor() {
    this.provider = EMAIL_PROVIDER;
  }

  async sendEmail(to: string, template: keyof typeof templates, data: any) {
    const emailTemplate = templates[template](data);

    try {
      if (this.provider === 'resend' && RESEND_API_KEY) {
        const resend = new Resend(RESEND_API_KEY);
        const result = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@nexustechhub.com',
          to: [to],
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
        console.log('Email sent via Resend:', result.data?.id);
        return result;
      } else if (this.provider === 'supabase' && supabaseAdmin) {
        // Use Supabase Edge Functions
        const { data, error } = await supabaseAdmin.functions.invoke('send-email', {
          body: {
            to,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          },
        });

        if (error) {
          console.error('Supabase email error:', error);
          throw error;
        }

        console.log('Email sent via Supabase Edge Function');
        return data;
      } else {
        // Fallback to console logging (development)
        console.log('📧 [DEV MODE] Email would be sent:');
        console.log('To:', to);
        console.log('Subject:', emailTemplate.subject);
        console.log('HTML:', emailTemplate.html.substring(0, 200) + '...');
        console.log('---');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Convenience methods for specific email types
  async sendWelcomeEmail(user: { first_name: string; last_name: string; email: string }) {
    return this.sendEmail(user.email, 'welcome', user);
  }

  async sendOrderConfirmationEmail(order: any, user: { first_name: string; last_name: string; email: string }) {
    return this.sendEmail(user.email, 'orderConfirmation', { order, user });
  }

  async sendWholesaleApprovalEmail(request: any, user: { first_name: string; last_name: string; email: string }) {
    return this.sendEmail(user.email, 'wholesaleApproval', { request, user });
  }

  async sendWholesaleRejectionEmail(request: any, user: { first_name: string; last_name: string; email: string }) {
    return this.sendEmail(user.email, 'wholesaleRejection', { request, user });
  }

  async sendOrderStatusUpdateEmail(order: any, user: { first_name: string; last_name: string; email: string }) {
    return this.sendEmail(user.email, 'orderStatusUpdate', { order, user });
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
