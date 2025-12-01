// Security utilities and headers for Nexus TechHub
import { logger } from './monitoring';

// Security headers configuration
export const securityHeaders = [
  // Prevent XSS attacks
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Referrer policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Permissions policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self)'
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://api.nexustechhub.ae",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

// HTTPS redirect headers for Netlify
export const httpsRedirectHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }
];

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.url === '/api/health';
  }
};

// Input validation utilities
export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (UAE format)
  isValidUAEPhone: (phone) => {
    const phoneRegex = /^(\+971|00971|971)?[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  // SKU validation
  isValidSKU: (sku) => {
    const skuRegex = /^NTH-[A-Z]+-[A-Z]+-\d{3}$/;
    return skuRegex.test(sku);
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  },

  // Validate and sanitize contact form data
  validateContactForm: (data) => {
    const errors = [];
    const sanitized = {};

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else {
      sanitized.name = validation.sanitizeInput(data.name);
    }

    // Email validation
    if (!data.email || !validation.isValidEmail(data.email)) {
      errors.push('Please provide a valid email address');
    } else {
      sanitized.email = data.email.toLowerCase().trim();
    }

    // Phone validation (optional)
    if (data.phone && !validation.isValidUAEPhone(data.phone)) {
      errors.push('Please provide a valid UAE phone number');
    } else if (data.phone) {
      sanitized.phone = data.phone.replace(/\s+/g, '');
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    } else {
      sanitized.message = validation.sanitizeInput(data.message);
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: sanitized
    };
  }
};

// CSRF protection
export function generateCSRFToken() {
  if (typeof window === 'undefined') {
    // Server-side token generation
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  } else {
    // Client-side token generation
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Security middleware for API routes
export function securityMiddleware(req, res, next) {
  // Add security headers
  securityHeaders.forEach(header => {
    res.setHeader(header.key, header.value);
  });

  // HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }

  // Log security events
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    referer: req.headers.referer
  });

  next();
}

// Content validation
export const contentSecurity = {
  // Validate file uploads
  validateFileUpload: (file, allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf']) => {
    const errors = [];
    
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      errors.push(`File type .${fileExtension} is not allowed`);
    }

    // Check MIME type
    const allowedMimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf'
    };

    if (allowedMimeTypes[fileExtension] && file.type !== allowedMimeTypes[fileExtension]) {
      errors.push('File type does not match file extension');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Scan content for malicious patterns
  scanContent: (content) => {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi
    ];

    const threats = [];
    maliciousPatterns.forEach((pattern, index) => {
      if (pattern.test(content)) {
        threats.push(`Potential XSS pattern detected (${index + 1})`);
      }
    });

    return {
      isSafe: threats.length === 0,
      threats
    };
  }
};

// API security helpers
export const apiSecurity = {
  // Validate API key
  validateApiKey: (apiKey) => {
    const validApiKey = process.env.API_SECRET_KEY;
    return apiKey && apiKey === validApiKey;
  },

  // Rate limiting check
  checkRateLimit: (ip, endpoint) => {
    // Implement rate limiting logic
    // This is a simplified version - use Redis or similar in production
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const window = 15 * 60 * 1000; // 15 minutes
    const limit = 100;

    // In production, use a proper rate limiting solution
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + window
    };
  },

  // Validate request origin
  validateOrigin: (origin) => {
    const allowedOrigins = [
      'https://nexustechhub.netlify.app',
      'https://nexustechhub.ae',
      'http://localhost:3006' // Development only
    ];

    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
    }

    return allowedOrigins.includes(origin);
  }
};

// Initialize security measures
export function initializeSecurity() {
  if (typeof window === 'undefined') return;

  // Disable right-click in production (optional)
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK === 'true') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // Disable F12 and other dev tools shortcuts in production (optional)
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DISABLE_DEV_TOOLS === 'true') {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    });
  }

  // Monitor for suspicious activity
  let suspiciousActivity = 0;
  const maxSuspiciousActivity = 5;

  document.addEventListener('keydown', (e) => {
    // Detect potential automated scripts
    if (e.isTrusted === false) {
      suspiciousActivity++;
      if (suspiciousActivity >= maxSuspiciousActivity) {
        logger.warn('Suspicious activity detected', {
          type: 'automated_script',
          count: suspiciousActivity
        });
      }
    }
  });

  logger.info('Security measures initialized for Nexus TechHub');
}
