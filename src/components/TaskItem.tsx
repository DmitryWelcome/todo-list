'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { taskApi } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await taskApi.update(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await taskApi.update(task.id, {
        title: title.trim(),
        description: description.trim(),
        completed: task.completed,
      });
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;

    setIsLoading(true);
    try {
      await taskApi.delete(task.id);
      onTaskDeleted();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-md border-l-4 ${
        task.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
      }`}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Название задачи"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Описание (необязательно)"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !title.trim()}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                className={`text-sm font-medium ${
                  task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 ${
                    task.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
              title="Редактировать"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
              title="Удалить"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
