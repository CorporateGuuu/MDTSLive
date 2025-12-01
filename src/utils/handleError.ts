// utils/handleError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): {
  message: string;
  code?: string;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    // Stripe errors
    if ('type' in error && typeof (error as any).code === 'string') {
      const stripeError = error as any;
      const messages: Record<string, string> = {
        card_declined: 'Your card was declined. Please try another card.',
        insufficient_funds: 'Your card has insufficient funds.',
        expired_card: 'Your card has expired.',
        incorrect_cvc: 'Invalid security code.',
        processing_error: 'Payment processing failed. Try again.',
      };
      return {
        message: messages[stripeError.code] || 'Payment failed. Please try again.',
        code: stripeError.code,
        statusCode: 402,
      };
    }

    // Supabase auth errors
    if (error.message.includes('Invalid login credentials')) {
      return { message: 'Invalid email or password', statusCode: 401 };
    }
    if (error.message.includes('Email not confirmed')) {
      return { message: 'Please check your email and confirm your account', statusCode: 403 };
    }
  }

  return {
    message: 'An unexpected error occurred. Our team has been notified.',
    statusCode: 500,
  };
}
