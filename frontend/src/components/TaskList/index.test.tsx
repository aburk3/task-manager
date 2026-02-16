import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'
import { TaskList } from '.'
import { getDeletePrompt, getMoveToLabel, TASK_LIST_COPY } from './constants'
import { renderWithProviders } from '@/test/test-utils'
import { TaskPriority, TaskStatus, type TaskItem } from '@/types/api'

const buildTask = (overrides: Partial<TaskItem> = {}): TaskItem => ({
  id: 'task-1',
  title: 'Ship MVP',
  description: null,
  status: TaskStatus.Todo,
  priority: TaskPriority.Medium,
  dueDate: null,
  createdAtUtc: new Date().toISOString(),
  updatedAtUtc: new Date().toISOString(),
  completedAtUtc: null,
  ...overrides,
})

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders fallback copy for missing description and due date', () => {
    const onToggleStatus = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<TaskList tasks={[buildTask()]} onToggleStatus={onToggleStatus} onDelete={onDelete} />)
    const taskCard = screen.getByRole('listitem')

    expect(taskCard).toHaveTextContent(TASK_LIST_COPY.noDueDate)
    expect(screen.getByText(TASK_LIST_COPY.noDescription)).toBeInTheDocument()
  })

  it('renders overdue copy when due date is in the past', () => {
    const onToggleStatus = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const overdueTask = buildTask({
      id: 'task-overdue',
      dueDate: '2000-01-01',
    })

    renderWithProviders(<TaskList tasks={[overdueTask]} onToggleStatus={onToggleStatus} onDelete={onDelete} />)
    const taskCard = screen.getByRole('listitem')

    expect(taskCard).toHaveTextContent(TASK_LIST_COPY.overdue)
  })

  it('calls onToggleStatus with the selected task', async () => {
    const user = userEvent.setup()
    const onToggleStatus = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const task = buildTask({ status: TaskStatus.Todo })

    renderWithProviders(<TaskList tasks={[task]} onToggleStatus={onToggleStatus} onDelete={onDelete} />)

    const taskCard = screen.getByRole('listitem')
    await user.click(within(taskCard).getByRole('button', { name: getMoveToLabel(TaskStatus.InProgress) }))

    expect(onToggleStatus).toHaveBeenCalledWith(task)
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('calls onDelete after confirmation', async () => {
    const user = userEvent.setup()
    const onToggleStatus = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const task = buildTask({ id: 'task-delete' })
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithProviders(<TaskList tasks={[task]} onToggleStatus={onToggleStatus} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: TASK_LIST_COPY.deleteButton }))

    expect(confirmSpy).toHaveBeenCalledWith(getDeletePrompt(task.title))
    expect(onDelete).toHaveBeenCalledWith(task.id)
  })

  it('does not call onDelete when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const onToggleStatus = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    renderWithProviders(<TaskList tasks={[buildTask({ id: 'task-cancel' })]} onToggleStatus={onToggleStatus} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: TASK_LIST_COPY.deleteButton }))

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(onDelete).not.toHaveBeenCalled()
  })
})
