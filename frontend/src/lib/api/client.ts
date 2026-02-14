import type {
  CreateTaskRequest,
  PagedResponse,
  TaskItem,
  TaskQuery,
  TaskStatus,
  UpdateTaskRequest,
} from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5215'

const buildUrl = (path: string) => `${API_BASE_URL}${path}`

const toQueryString = (query: TaskQuery) => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  })

  const raw = params.toString()
  return raw ? `?${raw}` : ''
}

const request = async <TResponse>(path: string, init?: RequestInit): Promise<TResponse> => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Request failed.'
    try {
      const data = (await response.json()) as { message?: string; errors?: string[] }
      if (data.message) {
        message = data.message
      }
      if (data.errors?.length) {
        message = `${message} ${data.errors.join(' ')}`
      }
    } catch {
      // Keep fallback message when response is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

export const taskApi = {
  getTasks: async (query: TaskQuery): Promise<PagedResponse<TaskItem>> => {
    return request<PagedResponse<TaskItem>>(`/api/tasks${toQueryString(query)}`)
  },

  createTask: async (payload: CreateTaskRequest): Promise<TaskItem> => {
    return request<TaskItem>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateTask: async (taskId: string, payload: UpdateTaskRequest): Promise<TaskItem> => {
    return request<TaskItem>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  updateStatus: async (taskId: string, status: TaskStatus): Promise<TaskItem> => {
    return request<TaskItem>(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await request<void>(`/api/tasks/${taskId}`, { method: 'DELETE' })
  },
}
