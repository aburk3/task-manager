import { formatTaskStatus } from '@/helpers/formatTaskStatus'
import type { TaskStatus } from '@/types/api'

export const TASK_LIST_COPY = {
  noDueDate: 'No due date',
  overdue: 'Overdue',
  deleteButton: 'Delete',
  noDescription: 'No description provided.',
} as const

export const getMoveToLabel = (status: TaskStatus) => `Move to ${formatTaskStatus(status)}`

export const getDeletePrompt = (title: string) => `Delete "${title}"? This action cannot be undone.`
