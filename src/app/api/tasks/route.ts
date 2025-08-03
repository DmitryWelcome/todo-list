import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createTaskSchema, sanitizeHtml } from '@/lib/validation';
import { withAuth, withRateLimit, logApiCall, logApiSuccess, logApiError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    return await withAuth(request, async (session) => {
      return await withRateLimit(request, 100, async () => {
        logApiCall('GET', '/api/tasks');
        
        const tasks = await prisma.task.findMany({
          where: { userId: session.user.id },
          include: {
            user: { select: { id: true, email: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        });

        logApiSuccess('GET', '/api/tasks', { count: tasks.length });
        return NextResponse.json(tasks);
      });
    });
  } catch (error) {
    logApiError('GET', '/api/tasks', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (session) => {
      return await withRateLimit(request, 10, async () => {
        logApiCall('POST', '/api/tasks');
        
        const body = await request.json();
        const validationResult = createTaskSchema.safeParse(body);
        
        if (!validationResult.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validationResult.error.issues },
            { status: 400 }
          );
        }

        const { title, description } = validationResult.data;
        const task = await prisma.task.create({
          data: {
            title: sanitizeHtml(title),
            description: description ? sanitizeHtml(description) : undefined,
            userId: session.user.id,
          },
          include: {
            user: { select: { id: true, email: true, name: true } }
          }
        });

        logApiSuccess('POST', '/api/tasks', { taskId: task.id });
        return NextResponse.json(task, { status: 201 });
      });
    });
  } catch (error) {
    logApiError('POST', '/api/tasks', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
