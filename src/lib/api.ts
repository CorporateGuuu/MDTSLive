import { NextResponse } from 'next/server';
import { AuthError, ValidationError, DatabaseError, NotFoundError, ForbiddenError } from './errors';

// =============================================================================
// Midas Technical Solutions - API Response Helpers
// =============================================================================

// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Standard API response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Success response helper
export function success<T = any>(
  data: T,
  status: number = 200,
  meta?: any
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return NextResponse.json(response, {
    status,
    headers: CORS_HEADERS,
  });
}

// Error response helper
export function apiError(
  code: string,
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    status,
    headers: CORS_HEADERS,
  });
}

// Handle different error types
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof AuthError) {
    return apiError(error.name, error.message, error.statusCode);
  }

  if (error instanceof ValidationError) {
    return apiError(error.name, error.message, 400, error.details);
  }

  if (error instanceof NotFoundError) {
    return apiError(error.name, error.message, 404);
  }

  if (error instanceof ForbiddenError) {
    return apiError(error.name, error.message, 403);
  }

  if (error instanceof DatabaseError) {
    return apiError(error.name, error.message, 500, error.originalError);
  }

  // Generic error
  const message = error instanceof Error ? error.message : 'Internal server error';
  return apiError('INTERNAL_ERROR', message, 500);
}

// CORS preflight handler
export function handleCors(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

// Pagination helper
export function createPaginationMeta(
  total: number,
  limit: number,
  offset: number
) {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    pages: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  };
}

// Request logging helper
export function logRequest(
  method: string,
  url: string,
  userId?: string,
  duration?: number
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method,
    url,
    userId: userId || 'anonymous',
    duration: duration ? `${duration}ms` : undefined,
  };

  console.log('API Request:', JSON.stringify(logEntry));
}

// Rate limiting store (simple in-memory)
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  check(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const key = identifier;
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count >= limit) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimitStore = new RateLimitStore();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimitStore.cleanup();
}, 5 * 60 * 1000);
