// frontend\src\api\request.ts

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token")
  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: HeadersInit
  skipAuth?: boolean
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers,
    skipAuth = false
  } = options

  const url = `${API_URL}${endpoint}`

  const requestHeaders: Record<string, string> = {}

  if (!skipAuth) {
    const authHeaders = getAuthHeaders()
    Object.assign(requestHeaders, authHeaders)
  }

  if (headers) {
    Object.assign(requestHeaders, headers)
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    if (body instanceof URLSearchParams) {
      fetchOptions.body = body
      if (!requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    } else {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
      if (!requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json'
      }
    }
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`

      try {
        const errorData = await response.json()
        if (errorData.detail) {
          errorMessage = errorData.detail
        }
      } catch {
      }

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error')
  }
}

export async function requestWithFallback<T>(
  endpoint: string,
  options: RequestOptions = {},
  fallbackValue: T
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: options.skipAuth ? {} : getAuthHeaders(),
      body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
    })

    if (response.status === 401) return fallbackValue
    if (!response.ok) {
      console.warn(`API Error: ${response.status} ${response.statusText}`)
      return fallbackValue
    }

    return await response.json()
  } catch (error) {
    console.error('Network Error:', error)
    return fallbackValue
  }
}
