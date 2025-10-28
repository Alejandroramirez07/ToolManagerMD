import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Task {
  id: number
  title: string
  description: string
  dueDate?: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Grade {
  id: number
  studentId: number
  taskId: number
  score: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'Professor' | 'Student'
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description: string
  dueDate?: string
  isCompleted?: boolean
}

export interface CreateGradeDto {
  studentId: number
  taskId: number
  score: number
}

export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  password: string
  role?: 'Professor' | 'Student'
}

// Tasks API
export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks'),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<CreateTaskDto>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
}

// Grades API
export const gradesApi = {
  getAll: () => api.get<Grade[]>('/grades'),
  getById: (id: number) => api.get<Grade>(`/grades/${id}`),
  create: (data: CreateGradeDto) => api.post<Grade>('/grades', data),
  update: (id: number, data: Partial<CreateGradeDto>) => api.patch<Grade>(`/grades/${id}`, data),
  delete: (id: number) => api.delete(`/grades/${id}`),
  getByStudent: (studentId: number) => api.get<Grade[]>(`/grades/student/${studentId}`),
  getStudentAverage: (studentId: number) => api.get<{ average: number }>(`/grades/student/${studentId}/average`),
}

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => api.post<User>('/users', data),
  update: (id: number, data: Partial<CreateUserDto>) => api.patch<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
}

export default api
