import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('GET /api/tasks - Starting request');
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('GET /api/tasks - Success, found', tasks.length, 'tasks');
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('GET /api/tasks - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/tasks - Starting request');
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
      },
    });

    console.log('POST /api/tasks - Success, created task:', task.id);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
