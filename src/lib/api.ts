import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types'

const API_BASE = '/api/tasks'

export const taskApi = {
  // Получить все задачи
  async getAll(): Promise<Task[]> {
    const response = await fetch(API_BASE)
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  },

  // Создать новую задачу
  async create(task: CreateTaskRequest): Promise<Task> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (!response.ok) {
      throw new Error('Failed to create task')
    }
    return response.json()
  },

  // Обновить задачу
  async update(id: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (!response.ok) {
      throw new Error('Failed to update task')
    }
    return response.json()
  },

  // Удалить задачу
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
  },
} 