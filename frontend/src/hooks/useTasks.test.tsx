import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useTasks } from './useTasks'
import { taskApi } from '@/lib/api/client'
import { TaskPriority, TaskStatus } from '@/types/api'

vi.mock('@/lib/api/client', () => ({
  taskApi: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    updateStatus: vi.fn(),
    deleteTask: vi.fn(),
  },
}))

describe('useTasks', () => {
  it('loads tasks from API query', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue({
      items: [
        {
          id: '1',
          title: 'Task from API',
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
      pageSize: 10,
    })

    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useTasks(), { wrapper })

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1)
    })
    expect(result.current.tasks[0].title).toBe('Task from API')
  })
})
