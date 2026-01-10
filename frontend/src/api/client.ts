// frontend\src\api\client.ts

import { request, requestWithFallback } from './request'

export interface LoginResponse {
  access_token: string
  token_type: string
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Login failed')
  }

  return response.json()
}

export const registerUser = async (username: string, password: string) => {
  return request('/users/', {
    method: 'POST',
    body: { username, password },
    skipAuth: true
  })
}

export interface User {
  username: string
  display_name?: string
  avatar?: string
}

export const getCurrentUser = async (): Promise<User> => {
  return request<User>('/users/me')
}

export const updateUser = async (userUpdate: { display_name?: string, avatar?: string }) => {
  return request<User>('/users/me', {
    method: 'PUT',
    body: userUpdate
  })
}

export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  order: number
  priority?: string
  tags?: string[]
}

export const getTodos = async (): Promise<Todo[]> => {
  return requestWithFallback<Todo[]>('/todos/', {}, [])
}

export const createTodo = async (title: string) => {
  return request<Todo>('/todos/', {
    method: 'POST',
    body: { title, completed: false }
  })
}

export const updateTodo = async (id: number, todo: { title?: string, completed?: boolean, order?: number }) => {
  return request<Todo>(`/todos/${id}`, {
    method: 'PUT',
    body: todo
  })
}

export const deleteTodo = async (id: number) => {
  return request<{ ok: boolean }>(`/todos/${id}`, {
    method: 'DELETE'
  })
}

export const reorderTodos = async (todos: { id: number; order: number }[]) => {
  return request<{ ok: boolean }>('/todos/reorder', {
    method: 'PUT',
    body: todos
  })
}
