import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateTaskSchema, sanitizeHtml, isValidId } from '@/lib/validation';
import { withAuth, withRateLimit, logApiCall, logApiSuccess, logApiError } from '@/lib/api-helpers';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return await withAuth(request, async (session) => {
      return await withRateLimit(request, 50, async () => {
        const { id } = await params;
        
        if (!isValidId(id)) {
          return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
        }

        logApiCall('PUT', `/api/tasks/${id}`);
        
        const body = await request.json();
        const validationResult = updateTaskSchema.safeParse(body);
        
        if (!validationResult.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validationResult.error.issues },
            { status: 400 }
          );
        }

        const { title, description, completed } = validationResult.data;

        // Проверяем, что задача принадлежит пользователю
        const existingTask = await prisma.task.findFirst({
          where: { id, userId: session.user.id }
        });

        if (!existingTask) {
          return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = await prisma.task.update({
          where: { id },
          data: {
            title: sanitizeHtml(title),
            description: description ? sanitizeHtml(description) : undefined,
            completed,
          },
          include: {
            user: { select: { id: true, email: true, name: true } }
          }
        });

        logApiSuccess('PUT', `/api/tasks/${id}`, { taskId: task.id });
        return NextResponse.json(task);
      });
    });
  } catch (error) {
    logApiError('PUT', `/api/tasks/[id]`, error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return await withAuth(request, async (session) => {
      return await withRateLimit(request, 50, async () => {
        const { id } = await params;
        
        if (!isValidId(id)) {
          return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
        }

        logApiCall('DELETE', `/api/tasks/${id}`);

        // Проверяем, что задача принадлежит пользователю
        const existingTask = await prisma.task.findFirst({
          where: { id, userId: session.user.id }
        });

        if (!existingTask) {
          return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        await prisma.task.delete({ where: { id } });

        logApiSuccess('DELETE', `/api/tasks/${id}`, { taskId: id });
        return NextResponse.json({ message: 'Task deleted successfully' });
      });
    });
  } catch (error) {
    logApiError('DELETE', `/api/tasks/[id]`, error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
