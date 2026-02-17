import { getSessionFromCookies, SessionData } from './auth';

// Rate limiting store (in-memory, resets on serverless function restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Rate limiter - returns true if rate limit exceeded
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

// Clean up expired rate limit entries
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Auth middleware - extract session from request
export function requireAuth(request: Request): SessionData {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookies(cookieHeader);

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

// CORS headers
export function getCorsHeaders(origin?: string): HeadersInit {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const requestOrigin = origin || '';
  
  const allowOrigin = 
    allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin)
      ? requestOrigin || '*'
      : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle OPTIONS preflight requests
export function handleOptions(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin') || undefined),
  });
}

// Standard error response
export function errorResponse(
  message: string,
  status: number = 400,
  origin?: string
): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin),
      },
    }
  );
}

// Standard success response
export function successResponse(
  data: any,
  status: number = 200,
  origin?: string,
  extraHeaders: HeadersInit = {}
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin),
        ...extraHeaders,
      },
    }
  );
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}
