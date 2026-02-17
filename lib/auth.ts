import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const COOKIE_NAME = 'stanza_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export interface SessionData {
  userId: string;
  email: string;
  username: string;
}

// Generate JWT token
export function generateToken(data: SessionData): string {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): SessionData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Create session cookie
export function createSessionCookie(token: string): string {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

// Clear session cookie
export function clearSessionCookie(): string {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Parse session from cookies
export function getSessionFromCookies(cookieHeader?: string): SessionData | null {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const token = cookies[COOKIE_NAME];

  if (!token) return null;

  return verifyToken(token);
}

// Get client IP address from request headers
export function getClientIp(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    undefined
  );
}
