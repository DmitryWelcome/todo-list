import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateTaskSchema, sanitizeHtml, isValidId } from '@/lib/validation';
import {
  rateLimit,
  getClientIP,
  safeLog,
  createErrorResponse,
} from '@/lib/security';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 60000)) {
      return createErrorResponse('Too many requests', 429);
    }

    const { id } = await params;
    
    // Валидация ID
    if (!isValidId(id)) {
      return createErrorResponse('Invalid task ID', 400);
    }

    safeLog('PUT /api/tasks/[id] - Starting request');
    
    const body = await request.json();
    
    // Валидация входных данных
    const validationResult = updateTaskSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, completed } = validationResult.data;

    // Санитизация данных
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = description
      ? sanitizeHtml(description)
      : undefined;

    safeLog(`PUT /api/tasks/[id] - Updating task: ${id}`);

    // Проверяем, что задача принадлежит пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingTask) {
      return createErrorResponse('Task not found', 404);
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        completed,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });

    safeLog(`PUT /api/tasks/[id] - Success, updated task: ${task.id}`);
    return NextResponse.json(task);
  } catch (error) {
    safeLog('PUT /api/tasks/[id] - Error:', error);
    return createErrorResponse('Failed to update task');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 20, 60000)) {
      // Более строгий лимит для DELETE
      return createErrorResponse('Too many requests', 429);
    }

    const { id } = await params;
    
    // Валидация ID
    if (!isValidId(id)) {
      return createErrorResponse('Invalid task ID', 400);
    }

    safeLog('DELETE /api/tasks/[id] - Starting request');
    safeLog(`DELETE /api/tasks/[id] - Deleting task: ${id}`);

    // Проверяем, что задача принадлежит пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingTask) {
      return createErrorResponse('Task not found', 404);
    }

    await prisma.task.delete({
      where: { id },
    });

    safeLog(`DELETE /api/tasks/[id] - Success, deleted task: ${id}`);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    safeLog('DELETE /api/tasks/[id] - Error:', error);
    return createErrorResponse('Failed to delete task');
  }
}
