import { formatTaskStatus } from '@/helpers/formatTaskStatus'
import type { TaskStatus } from '@/types/api'

const TASK_LIST_COPY = {
  noDueDate: 'No due date',
  overdue: 'Overdue',
  deleteButton: 'Delete',
  noDescription: 'No description provided.',
} as const

const getMoveToLabel = (status: TaskStatus) => `Move to ${formatTaskStatus(status)}`

const getDeletePrompt = (title: string) => `Delete "${title}"? This action cannot be undone.`

export { TASK_LIST_COPY, getMoveToLabel, getDeletePrompt }
