import { formatDistanceToNow, isBefore, parseISO } from 'date-fns'
import { formatTaskStatus } from '@/helpers/formatTaskStatus'
import type { TaskItem } from '@/types/api'
import { TaskStatus } from '@/types/api'
import { getDeletePrompt, getMoveToLabel, TASK_LIST_COPY } from './constants'
import {
  ActionButton,
  Actions,
  Card,
  CardHeader,
  CardMeta,
  CardTitle,
  Description,
  List,
  StatusChip,
} from './styles'

type TaskListProps = {
  tasks: TaskItem[]
  onToggleStatus: (task: TaskItem) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

const getNextStatus = (status: TaskStatus): TaskStatus => {
  switch (status) {
    case TaskStatus.Todo:
      return TaskStatus.InProgress
    case TaskStatus.InProgress:
      return TaskStatus.Completed
    case TaskStatus.Completed:
      return TaskStatus.Todo
  }
}

const getDueText = (dueDate: string | null) => {
  if (!dueDate) {
    return TASK_LIST_COPY.noDueDate
  }

  const parsedDate = parseISO(dueDate)
  if (isBefore(parsedDate, new Date())) {
    return TASK_LIST_COPY.overdue
  }

  return `Due ${formatDistanceToNow(parsedDate, { addSuffix: true })}`
}

export const TaskList = ({ tasks, onToggleStatus, onDelete }: TaskListProps) => {
  return (
    <List>
      {tasks.map((task) => (
        <Card key={task.id} $status={task.status}>
          <CardHeader>
            <div>
              <CardTitle $status={task.status}>{task.title}</CardTitle>
              <CardMeta $status={task.status}>
                <StatusChip $status={task.status}>{formatTaskStatus(task.status)}</StatusChip>
                {task.priority} Priority | {getDueText(task.dueDate)}
              </CardMeta>
            </div>

            <Actions>
              <ActionButton type="button" onClick={() => void onToggleStatus(task)}>
                {getMoveToLabel(getNextStatus(task.status))}
              </ActionButton>
              <ActionButton
                $variant="danger"
                type="button"
                onClick={() => {
                  const shouldDelete = window.confirm(getDeletePrompt(task.title))
                  if (shouldDelete) {
                    void onDelete(task.id)
                  }
                }}
              >
                {TASK_LIST_COPY.deleteButton}
              </ActionButton>
            </Actions>
          </CardHeader>

          <Description $status={task.status}>{task.description || TASK_LIST_COPY.noDescription}</Description>
        </Card>
      ))}
    </List>
  )
}

