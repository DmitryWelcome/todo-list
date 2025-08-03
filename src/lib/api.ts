import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const API_BASE = '/api/tasks';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }

  return response.json();
}

export const taskApi = {
  getAll: () => apiCall<Task[]>(''),
  
  create: (data: CreateTaskRequest) => 
    apiCall<Task>('', { method: 'POST', body: JSON.stringify(data) }),
  
  update: (id: string, data: UpdateTaskRequest) => 
    apiCall<Task>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  delete: (id: string) => 
    apiCall<void>(`/${id}`, { method: 'DELETE' }),
};
