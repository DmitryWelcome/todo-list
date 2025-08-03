'use client'

import { useState } from 'react'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Список задач
          </h1>
          <p className="text-gray-600">
            Организуйте свои задачи и повышайте продуктивность
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AddTaskForm onTaskAdded={handleTaskAdded} />
          </div>
          
          <div className="lg:col-span-2">
            <TaskList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  )
}
