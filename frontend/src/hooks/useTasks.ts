import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/lib/api/client'
import type { CreateTaskRequest, TaskItem, TaskPriority, TaskStatus, UpdateTaskRequest } from '@/types/api'

type Filters = {
  search: string
  status?: TaskStatus
  priority?: TaskPriority
}

type SortState = {
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title'
  sortDirection: 'asc' | 'desc'
}

const INITIAL_FILTERS: Filters = {
  search: '',
}

const INITIAL_SORT: SortState = {
  sortBy: 'createdAt',
  sortDirection: 'desc',
}

const PAGE_SIZE = 10

export const useTasks = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [sortState, setSortState] = useState<SortState>(INITIAL_SORT)
  const [page, setPage] = useState(1)

  const queryKey = useMemo(
    () => ['tasks', filters, sortState, page] as const,
    [filters, sortState, page],
  )

  const query = useQuery({
    queryKey,
    queryFn: () =>
      taskApi.getTasks({
        search: filters.search || undefined,
        status: filters.status,
        priority: filters.priority,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskRequest) => taskApi.createTask(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskRequest }) =>
      taskApi.updateTask(taskId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (current: { items?: TaskItem[] } | undefined) => {
        if (!current?.items) {
          return current
        }

        return {
          ...current,
          items: current.items.map((task) => (task.id === taskId ? { ...task, status } : task)),
        }
      })

      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.totalCount / query.data.pageSize)) : 1

  return {
    tasks: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    page,
    totalPages,
    filters,
    sortState,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    isMutating:
      createTaskMutation.isPending ||
      updateTaskMutation.isPending ||
      updateTaskStatusMutation.isPending ||
      deleteTaskMutation.isPending,
    setFilters,
    setSortState,
    setPage,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    updateTaskStatus: updateTaskStatusMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  }
}
