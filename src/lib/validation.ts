import { z } from 'zod';

// Base schema for tasks
const taskBaseSchema = {
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').trim(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
};

// Schema for creating a task
export const createTaskSchema = z.object(taskBaseSchema);

// Schema for updating a task
export const updateTaskSchema = z.object({
  ...taskBaseSchema,
  completed: z.boolean(),
});

// Function for HTML sanitization
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Function for ID validation
export function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 50;
} 