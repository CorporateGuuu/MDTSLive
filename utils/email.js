const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For development, we'll use a simple console logger
  // In production, configure with actual SMTP settings
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development mode - log to console
    return {
      sendMail: async (mailOptions) => {
        console.log('📧 [DEV MODE] Email would be sent:');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('HTML:', mailOptions.html);
        console.log('---');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }
};

const transporter = createTransporter();

// Send welcome email to new users
const sendWelcomeEmail = async (user) => {
  try {
    const { email, first_name, last_name } = user;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nexustechhub.ae',
      to: email,
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
              <h2>Hello ${first_name} ${last_name}!</h2>
              <p>Thank you for joining Nexus TechHub, your trusted source for premium repair parts and tools.</p>

              <p>Here's what you can do with your new account:</p>
              <ul>
                <li>Browse our extensive catalog of MacBook parts and repair tools</li>
                <li>Track your orders and repair history</li>
                <li>Access exclusive deals and promotions</li>
                <li>Get expert repair advice and support</li>
              </ul>

              <p>Ready to get started? Explore our products and find everything you need for your repair projects.</p>

              <a href="${process.env.APP_URL || 'https://nexustechhub.ae'}/products" class="button">Start Shopping</a>

              <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@nexustechhub.ae">support@nexustechhub.ae</a></p>

              <p>Happy repairing!<br>The Nexus TechHub Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you didn't create an account, please ignore this email.</p>
              <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.APP_URL || 'https://nexustechhub.ae'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nexustechhub.ae',
      to: email,
      subject: 'Password Reset - Nexus TechHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>You requested a password reset for your Nexus TechHub account.</p>

              <p>Please click the button below to reset your password:</p>

              <a href="${resetUrl}" class="button">Reset Password</a>

              <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
              </div>

              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>

              <p>If you have any questions, contact our support team at <a href="mailto:support@nexustechhub.ae">support@nexustechhub.ae</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const { email, first_name, last_name } = user;
    const { id: orderId, total_amount, items } = order;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nexustechhub.ae',
      to: email,
      subject: `Order Confirmation #${orderId} - Nexus TechHub`,
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
              <h2>Hello ${first_name} ${last_name}!</h2>
              <p>Thank you for your order! Your order #${orderId} has been successfully placed.</p>

              <div class="order-details">
                <h3>Order Details</h3>
                ${items.map(item => `
                  <div class="item">
                    <strong>${item.name}</strong> - Quantity: ${item.quantity} - $${item.price.toFixed(2)}
                  </div>
                `).join('')}
                <div class="total">
                  Total: $${total_amount.toFixed(2)}
                </div>
              </div>

              <p>You can track your order status in your account dashboard.</p>

              <p>If you have any questions about your order, please contact us at <a href="mailto:support@nexustechhub.ae">support@nexustechhub.ae</a></p>

              <p>Thank you for choosing Nexus TechHub!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Nexus TechHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};
