import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, CheckCircle, Circle } from 'lucide-react'
import { tasksApi, Task, CreateTaskDto } from '../services/api'

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    dueDate: '',
    isCompleted: false
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, formData)
      } else {
        await tasksApi.create(formData)
      }
      setShowModal(false)
      setEditingTask(null)
      setFormData({ title: '', description: '', dueDate: '', isCompleted: false })
      fetchTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      isCompleted: task.isCompleted
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(id)
        fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const toggleComplete = async (task: Task) => {
    try {
      await tasksApi.update(task.id, { ...task, isCompleted: !task.isCompleted })
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const openModal = () => {
    setEditingTask(null)
    setFormData({ title: '', description: '', dueDate: '', isCompleted: false })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTask(null)
    setFormData({ title: '', description: '', dueDate: '', isCompleted: false })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your academic tasks and assignments
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleComplete(task)}
                      className="mr-4 text-gray-400 hover:text-gray-600"
                    >
                      {task.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`text-lg font-medium ${
                          task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      <p className={`mt-1 text-sm ${
                        task.isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                      {task.dueDate && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-12 text-center">
              <p className="text-gray-500">No tasks available. Create your first task!</p>
            </li>
          )}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isCompleted}
                    onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Completed
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
