import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createTaskSchema, sanitizeHtml } from '@/lib/validation';
import {
  rateLimit,
  getClientIP,
  safeLog,
  createErrorResponse,
} from '@/lib/security';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 60000)) {
      return createErrorResponse('Too many requests', 429);
    }

    safeLog('GET /api/tasks - Starting request');

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    safeLog(`GET /api/tasks - Success, found ${tasks.length} tasks`);
    return NextResponse.json(tasks);
  } catch (error) {
    safeLog('GET /api/tasks - Error:', error);
    return createErrorResponse('Failed to fetch tasks');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 60000)) {
      // Более строгий лимит для POST
      return createErrorResponse('Too many requests', 429);
    }

    safeLog('POST /api/tasks - Starting request');

    const body = await request.json();

    // Валидация входных данных
    const validationResult = createTaskSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description } = validationResult.data;

    // Санитизация данных
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = description
      ? sanitizeHtml(description)
      : undefined;

    const task = await prisma.task.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    safeLog(`POST /api/tasks - Success, created task: ${task.id}`);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    safeLog('POST /api/tasks - Error:', error);
    return createErrorResponse('Failed to create task');
  }
}
