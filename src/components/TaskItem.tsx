'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { taskApi } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async (apiCall: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await apiCall();
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = () => handleApiCall(async () => {
    await taskApi.update(task.id, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    });
    onTaskUpdated();
  });

  const handleSave = () => {
    if (!title.trim()) return;
    handleApiCall(async () => {
      await taskApi.update(task.id, {
        title: title.trim(),
        description: description.trim(),
        completed: task.completed,
      });
      setIsEditing(false);
      onTaskUpdated();
    });
  };

  const handleDelete = () => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    handleApiCall(async () => {
      await taskApi.delete(task.id);
      onTaskDeleted();
    });
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md border-l-4 ${
      task.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
    }`}>
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
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Создатель: {task.user.name || task.user.email}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
