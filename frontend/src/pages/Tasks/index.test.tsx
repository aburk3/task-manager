import { screen } from '@testing-library/react'
import Tasks from '.'
import { renderWithProviders } from '@/test/test-utils'
import { TaskPriority, TaskStatus } from '@/types/api'

const useTasksMock = vi.fn()

vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => useTasksMock(),
}))

describe('Tasks page', () => {
  beforeEach(() => {
    useTasksMock.mockReturnValue({
      tasks: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
      filters: { search: '' },
      sortState: { sortBy: 'createdAt', sortDirection: 'desc' },
      isLoading: false,
      isError: false,
      errorMessage: null,
      isMutating: false,
      setFilters: vi.fn(),
      setSortState: vi.fn(),
      setPage: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      updateTaskStatus: vi.fn(),
      deleteTask: vi.fn(),
    })
  })

  it('shows empty state message', () => {
    renderWithProviders(<Tasks />)
    expect(screen.getByText('No tasks match the current filters.')).toBeInTheDocument()
  })

  it('renders task title when tasks are present', () => {
    useTasksMock.mockReturnValue({
      tasks: [
        {
          id: '1',
          title: 'Task A',
          description: null,
          status: TaskStatus.Todo,
          priority: TaskPriority.Medium,
          dueDate: null,
          createdAtUtc: new Date().toISOString(),
          updatedAtUtc: new Date().toISOString(),
          completedAtUtc: null,
        },
      ],
      totalCount: 1,
      page: 1,
      totalPages: 1,
      filters: { search: '' },
      sortState: { sortBy: 'createdAt', sortDirection: 'desc' },
      isLoading: false,
      isError: false,
      errorMessage: null,
      isMutating: false,
      setFilters: vi.fn(),
      setSortState: vi.fn(),
      setPage: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      updateTaskStatus: vi.fn(),
      deleteTask: vi.fn(),
    })

    renderWithProviders(<Tasks />)
    expect(screen.getByText('Task A')).toBeInTheDocument()
  })
})
