import { TaskPriority, TaskStatus } from '@/types/api'
import { formatTaskStatus } from '@/helpers/formatTaskStatus'

export const TASKS_PAGE_COPY = {
  title: 'Task Manager',
  subtitle: 'Track work with filtering, sorting, and status updates.',
  allTab: 'Active',
  completedTab: 'Completed',
  loading: 'Loading tasks...',
  empty: 'No tasks match the current filters.',
  errorPrefix: 'Unable to load tasks:',
} as const

export const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  ...Object.values(TaskStatus).map((status) => ({ label: formatTaskStatus(status), value: status })),
] as const

export const PRIORITY_OPTIONS = [
  { label: 'All priorities', value: '' },
  ...Object.values(TaskPriority).map((priority) => ({ label: priority, value: priority })),
] as const
