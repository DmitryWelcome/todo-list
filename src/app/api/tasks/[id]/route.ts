import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT /api/tasks/[id] - Starting request');
    const body = await request.json();
    const { title, description, completed } = body;

    const { id } = await params;
    console.log('PUT /api/tasks/[id] - Updating task:', id);

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed,
      },
    });

    console.log('PUT /api/tasks/[id] - Success, updated task:', task.id);
    return NextResponse.json(task);
  } catch (error) {
    console.error('PUT /api/tasks/[id] - Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE /api/tasks/[id] - Starting request');
    const { id } = await params;
    console.log('DELETE /api/tasks/[id] - Deleting task:', id);

    await prisma.task.delete({
      where: { id },
    });

    console.log('DELETE /api/tasks/[id] - Success, deleted task:', id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] - Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
