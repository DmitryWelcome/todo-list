import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth-utils';
import { rateLimit, getClientIP, safeLog, createErrorResponse } from '@/lib/security';

// Common helpers for API routes
export async function withAuth(
  request: NextRequest,
  handler: (session: { user: { id: string; email: string; name?: string } }) => Promise<NextResponse>
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401);
  }
  return handler(session);
}

export async function withRateLimit(
  request: NextRequest,
  limit: number,
  handler: () => Promise<NextResponse>
) {
  const clientIP = getClientIP(request);
  if (!rateLimit(clientIP, limit, 60000)) {
    return createErrorResponse('Too many requests', 429);
  }
  return handler();
}

export function logApiCall(method: string, endpoint: string, data?: unknown) {
  safeLog(`${method} ${endpoint} - Starting request`, data);
}

export function logApiSuccess(method: string, endpoint: string, result?: unknown) {
  safeLog(`${method} ${endpoint} - Success`, result);
}

export function logApiError(method: string, endpoint: string, error: unknown) {
  safeLog(`${method} ${endpoint} - Error:`, error);
} 