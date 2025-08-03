import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const API_BASE = '/api/tasks';

export const taskApi = {
  // Получить все задачи
  async getAll(): Promise<Task[]> {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(
          `Failed to fetch tasks: ${response.status} ${errorText}`
        );
      }
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Создать новую задачу
  async create(task: CreateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(
          `Failed to create task: ${response.status} ${errorText}`
        );
      }
      return response.json();
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  },

  // Обновить задачу
  async update(id: string, task: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(
          `Failed to update task: ${response.status} ${errorText}`
        );
      }
      return response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  // Удалить задачу
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(
          `Failed to delete task: ${response.status} ${errorText}`
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
};
