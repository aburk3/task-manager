import { TaskPriority, TaskStatus } from '@/types/api'
import { formatTaskStatus } from '@/helpers/formatTaskStatus'

export const TASKS_PAGE_COPY = {
  title: 'Task Manager',
  subtitle: 'Track work with filtering, sorting, and status updates.',
  allTab: 'Active',
  completedTab: 'Completed',
  searchPlaceholder: 'Search tasks',
  loading: 'Loading tasks...',
  empty: 'No tasks match the current filters.',
  errorPrefix: 'Unable to load tasks:',
  unknownError: 'Unknown error',
  showingPrefix: 'Showing',
  showingSuffix: 'tasks',
  previousPage: 'Previous',
  nextPage: 'Next',
  pagePrefix: 'Page',
  pageSeparator: 'of',
} as const

export const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  ...Object.values(TaskStatus).map((status) => ({ label: formatTaskStatus(status), value: status })),
] as const

export const PRIORITY_OPTIONS = [
  { label: 'All priorities', value: '' },
  ...Object.values(TaskPriority).map((priority) => ({ label: priority, value: priority })),
] as const

export const SORT_OPTIONS = [
  { label: 'Newest first', value: 'createdAt:desc' },
  { label: 'Oldest first', value: 'createdAt:asc' },
  { label: 'Due date soonest', value: 'dueDate:asc' },
  { label: 'Priority high to low', value: 'priority:desc' },
] as const
