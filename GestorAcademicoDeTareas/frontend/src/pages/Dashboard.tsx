import React, { useState, useEffect } from 'react'
import { CheckSquare, GraduationCap, Users, TrendingUp } from 'lucide-react'
import { tasksApi, gradesApi, usersApi, Task, Grade, User } from '../services/api'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalGrades: 0,
    totalUsers: 0,
    averageGrade: 0
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [recentGrades, setRecentGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksRes, gradesRes, usersRes] = await Promise.all([
          tasksApi.getAll(),
          gradesApi.getAll(),
          usersApi.getAll()
        ])

        const tasks = tasksRes.data
        const grades = gradesRes.data
        const users = usersRes.data

        const completedTasks = tasks.filter(task => task.isCompleted).length
        const averageGrade = grades.length > 0 
          ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length 
          : 0

        setStats({
          totalTasks: tasks.length,
          completedTasks,
          totalGrades: grades.length,
          totalUsers: users.length,
          averageGrade: Math.round(averageGrade * 100) / 100
        })

        setRecentTasks(tasks.slice(0, 5))
        setRecentGrades(grades.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      name: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-blue-500',
      change: `${stats.completedTasks} completed`
    },
    {
      name: 'Total Grades',
      value: stats.totalGrades,
      icon: GraduationCap,
      color: 'bg-green-500',
      change: `Avg: ${stats.averageGrade}`
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: 'Active users'
    },
    {
      name: 'Completion Rate',
      value: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '% completed'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your academic task management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                    <dd className="text-sm text-gray-500">
                      {stat.change}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks
            </h3>
            <div className="mt-5">
              <div className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          task.isCompleted ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tasks available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Grades
            </h3>
            <div className="mt-5">
              <div className="space-y-3">
                {recentGrades.length > 0 ? (
                  recentGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Task #{grade.taskId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Student #{grade.studentId}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        grade.score >= 4 
                          ? 'bg-green-100 text-green-800'
                          : grade.score >= 3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {grade.score}/5
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No grades available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
