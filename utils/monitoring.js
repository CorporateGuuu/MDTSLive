// Error monitoring and logging utilities for Nexus TechHub
import { analytics } from '../components/Analytics';

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error categories
export const ErrorCategory = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  PERMISSION: 'permission',
  BUSINESS_LOGIC: 'business_logic',
  SYSTEM: 'system',
  USER_INPUT: 'user_input',
  EXTERNAL_SERVICE: 'external_service'
};

// Logger class for structured logging
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.enableConsole = this.isDevelopment || process.env.NEXT_PUBLIC_DEBUG === 'true';
  }

  // Format log message
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context: {
        ...context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        environment: process.env.NODE_ENV,
        site: 'nexustechhub'
      }
    };

    return logEntry;
  }

  // Log info messages
  info(message, context = {}) {
    const logEntry = this.formatMessage('info', message, context);
    
    if (this.enableConsole) {
      console.log('ℹ️ [INFO]', message, context);
    }

    this.sendToMonitoring(logEntry);
  }

  // Log warning messages
  warn(message, context = {}) {
    const logEntry = this.formatMessage('warn', message, context);
    
    if (this.enableConsole) {
      console.warn('⚠️ [WARN]', message, context);
    }

    this.sendToMonitoring(logEntry);
  }

  // Log error messages
  error(message, error = null, context = {}) {
    const logEntry = this.formatMessage('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      } : null
    });
    
    if (this.enableConsole) {
      console.error('❌ [ERROR]', message, error, context);
    }

    this.sendToMonitoring(logEntry);
    
    // Track error in analytics
    if (typeof window !== 'undefined') {
      analytics.event({
        action: 'exception',
        category: 'error',
        label: message,
        custom_parameters: {
          error_type: error?.name || 'unknown',
          error_message: message,
          fatal: context.severity === ErrorSeverity.CRITICAL
        }
      });
    }
  }

  // Log debug messages (development only)
  debug(message, context = {}) {
    if (!this.isDevelopment) return;

    const logEntry = this.formatMessage('debug', message, context);
    
    if (this.enableConsole) {
      console.debug('🐛 [DEBUG]', message, context);
    }
  }

  // Send logs to monitoring service
  sendToMonitoring(logEntry) {
    if (!this.isProduction) return;

    try {
      // Send to external monitoring service (implement based on your choice)
      // Example: Sentry, LogRocket, DataDog, etc.
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.addBreadcrumb({
          message: logEntry.message,
          level: logEntry.level,
          data: logEntry.context
        });
      }

      // Send to custom logging endpoint
      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      }).catch(() => {
        // Silently fail to avoid infinite loops
      });
    } catch (error) {
      // Silently fail to avoid infinite loops
    }
  }
}

// Create logger instance
export const logger = new Logger();

// Error boundary helper
export function logError(error, errorInfo = {}, context = {}) {
  const errorContext = {
    ...context,
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.SYSTEM
  };

  logger.error('React Error Boundary caught an error', error, errorContext);
}

// API error handler
export function logApiError(endpoint, error, requestData = {}) {
  const context = {
    endpoint,
    requestData,
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.NETWORK
  };

  logger.error(`API Error: ${endpoint}`, error, context);
}

// User action logger
export function logUserAction(action, details = {}) {
  const context = {
    action,
    ...details,
    category: 'user_interaction',
    timestamp: new Date().toISOString()
  };

  logger.info(`User Action: ${action}`, context);

  // Track in analytics
  if (typeof window !== 'undefined') {
    analytics.trackEngagement(action, details);
  }
}

// Performance monitoring
export function logPerformance(metric, value, context = {}) {
  const performanceContext = {
    metric,
    value,
    ...context,
    category: 'performance'
  };

  logger.info(`Performance: ${metric}`, performanceContext);

  // Track in analytics
  if (typeof window !== 'undefined') {
    analytics.trackPerformance(metric, value);
  }
}

// Business event logger
export function logBusinessEvent(event, data = {}) {
  const context = {
    event,
    ...data,
    category: 'business',
    severity: ErrorSeverity.LOW
  };

  logger.info(`Business Event: ${event}`, context);
}

// Security event logger
export function logSecurityEvent(event, details = {}) {
  const context = {
    event,
    ...details,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH
  };

  logger.warn(`Security Event: ${event}`, context);
}

// Health check logger
export function logHealthCheck(service, status, details = {}) {
  const context = {
    service,
    status,
    ...details,
    category: 'health_check'
  };

  if (status === 'healthy') {
    logger.info(`Health Check: ${service} is healthy`, context);
  } else {
    logger.error(`Health Check: ${service} is unhealthy`, null, context);
  }
}

// Custom error classes
export class NexusError extends Error {
  constructor(message, category = ErrorCategory.SYSTEM, severity = ErrorSeverity.MEDIUM, context = {}) {
    super(message);
    this.name = 'NexusError';
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends NexusError {
  constructor(message, field = null, value = null) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, { field, value });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends NexusError {
  constructor(message, endpoint = null, statusCode = null) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, { endpoint, statusCode });
    this.name = 'NetworkError';
  }
}

// Error reporting utility
export function reportError(error, context = {}) {
  if (error instanceof NexusError) {
    logger.error(error.message, error, {
      ...error.context,
      ...context,
      category: error.category,
      severity: error.severity
    });
  } else {
    logger.error('Unexpected error occurred', error, {
      ...context,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.HIGH
    });
  }
}

// Initialize monitoring
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.addEventListener('error', (event) => {
    logger.error('Global JavaScript Error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.SYSTEM
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', event.reason, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.SYSTEM
    });
  });

  // Performance observer
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            logPerformance('page_load_time', entry.loadEventEnd - entry.loadEventStart);
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      logger.debug('Performance Observer not supported', { error: error.message });
    }
  }

  logger.info('Monitoring initialized for Nexus TechHub');
}
