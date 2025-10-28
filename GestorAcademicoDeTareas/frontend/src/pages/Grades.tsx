import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, TrendingUp, User } from 'lucide-react'
import { gradesApi, usersApi, tasksApi, Grade, CreateGradeDto, User, Task } from '../services/api'

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [formData, setFormData] = useState<CreateGradeDto>({
    studentId: 0,
    taskId: 0,
    score: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [gradesRes, usersRes, tasksRes] = await Promise.all([
        gradesApi.getAll(),
        usersApi.getAll(),
        tasksApi.getAll()
      ])
      setGrades(gradesRes.data)
      setUsers(usersRes.data)
      setTasks(tasksRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingGrade) {
        await gradesApi.update(editingGrade.id, formData)
      } else {
        await gradesApi.create(formData)
      }
      setShowModal(false)
      setEditingGrade(null)
      setFormData({ studentId: 0, taskId: 0, score: 0 })
      fetchData()
    } catch (error) {
      console.error('Error saving grade:', error)
    }
  }

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade)
    setFormData({
      studentId: grade.studentId,
      taskId: grade.taskId,
      score: grade.score
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradesApi.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting grade:', error)
      }
    }
  }

  const openModal = () => {
    setEditingGrade(null)
    setFormData({ studentId: 0, taskId: 0, score: 0 })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingGrade(null)
    setFormData({ studentId: 0, taskId: 0, score: 0 })
  }

  const getStudentName = (studentId: number) => {
    const user = users.find(u => u.id === studentId)
    return user ? `${user.firstName} ${user.lastName}` : `Student #${studentId}`
  }

  const getTaskTitle = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    return task ? task.title : `Task #${taskId}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100'
    if (score >= 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const students = users.filter(user => user.role === 'Student')

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
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student grades and track academic performance
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Grade
        </button>
      </div>

      {/* Student Performance Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Performance Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => {
            const studentGrades = grades.filter(g => g.studentId === student.id)
            const average = studentGrades.length > 0 
              ? studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length 
              : 0
            
            return (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {studentGrades.length} grades
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Average:</span>
                    <span className={`text-lg font-semibold ${getScoreColor(Math.round(average * 100) / 100)} px-2 py-1 rounded`}>
                      {average > 0 ? average.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Grades</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Complete list of student grades
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {grades.length > 0 ? (
            grades.map((grade) => (
              <li key={grade.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getTaskTitle(grade.taskId)}
                        </h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(grade.score)}`}>
                          {grade.score}/5
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Student: {getStudentName(grade.studentId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Graded on: {new Date(grade.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(grade.id)}
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
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No grades</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new grade.</p>
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
                {editingGrade ? 'Edit Grade' : 'Add New Grade'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Student
                  </label>
                  <select
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: parseInt(e.target.value) })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value={0}>Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task
                  </label>
                  <select
                    required
                    value={formData.taskId}
                    onChange={(e) => setFormData({ ...formData, taskId: parseInt(e.target.value) })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value={0}>Select a task</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Score (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
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
                    {editingGrade ? 'Update' : 'Create'}
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

export default Grades
