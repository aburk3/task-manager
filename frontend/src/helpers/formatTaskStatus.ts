import { TaskStatus } from '@/types/api'
import type { TaskStatus as TaskStatusType } from '@/types/api'

export const formatTaskStatus = (status: TaskStatusType): string => {
  switch (status) {
    case TaskStatus.Todo:
      return 'Todo'
    case TaskStatus.InProgress:
      return 'In Progress'
    case TaskStatus.Completed:
      return 'Completed'
  }
}
