import { NextRequest, NextResponse } from 'next/server';

// Простой in-memory rate limiter (в production лучше использовать Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Функция для получения IP адреса
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

// Функция для безопасного логирования (без чувствительных данных)
export function safeLog(message: string, data?: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    if (data !== undefined) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  } else {
    // В production логируем только безопасную информацию
    console.log(message);
  }
}

// Функция для создания безопасного ответа с ошибкой
export function createErrorResponse(message: string, status: number = 500): NextResponse {
  const errorMessage = process.env.NODE_ENV === 'development' ? message : 'Internal server error';
  
  return NextResponse.json(
    { error: errorMessage },
    { status }
  );
} 