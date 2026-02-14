export const TaskStatus = {
  Todo: 'Todo',
  InProgress: 'InProgress',
  Completed: 'Completed',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const TaskPriority = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]

export type TaskItem = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAtUtc: string
  updatedAtUtc: string
  completedAtUtc: string | null
}

export type PagedResponse<TItem> = {
  items: TItem[]
  totalCount: number
  page: number
  pageSize: number
}

export type TaskQuery = {
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title'
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type CreateTaskRequest = {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}

export type UpdateTaskRequest = {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
}
