import { useMemo } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { Header, Main, Page, Title } from '@/components/Layout/styles'
import { useTasks } from '@/hooks/useTasks'
import { TaskStatus } from '@/types/api'
import type { TaskPriority } from '@/types/api'
import { PRIORITY_OPTIONS, TASKS_PAGE_COPY } from './constants'
import {
  FilterBar,
  InlineMessage,
  Input,
  PaginationButton,
  PaginationRow,
  Section,
  Select,
  Subtitle,
  TabButton,
  TabsRow,
} from './styles'

const Tasks = () => {
  const {
    tasks,
    totalCount,
    page,
    totalPages,
    filters,
    sortState,
    isLoading,
    isError,
    errorMessage,
    isMutating,
    setFilters,
    setSortState,
    setPage,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks()

  const isCompletedTab = filters.status === TaskStatus.Completed

  const visibleTasks = useMemo(() => {
    if (filters.status === TaskStatus.Completed) {
      return tasks
    }
    return tasks.filter((task) => task.status !== TaskStatus.Completed)
  }, [filters.status, tasks])

  const showingText = useMemo(() => {
    if (isLoading) {
      return TASKS_PAGE_COPY.loading
    }
    if (isError) {
      return `${TASKS_PAGE_COPY.errorPrefix} ${errorMessage ?? 'Unknown error'}`
    }
    if (!visibleTasks.length) {
      return TASKS_PAGE_COPY.empty
    }
    return `Showing ${visibleTasks.length} of ${totalCount} tasks`
  }, [errorMessage, isError, isLoading, totalCount, visibleTasks.length])

  return (
    <Page>
      <Main>
        <Header>
          <div>
            <Title>{TASKS_PAGE_COPY.title}</Title>
            <Subtitle>{TASKS_PAGE_COPY.subtitle}</Subtitle>
          </div>
        </Header>

        <Section>
          <TaskForm
            isSubmitting={isMutating}
            onSubmit={async (values) => {
              await createTask({
                title: values.title,
                description: values.description || undefined,
                priority: values.priority,
                dueDate: values.dueDate || undefined,
              })
            }}
          />
        </Section>

        <Section>
          <TabsRow>
            <TabButton
              type="button"
              $active={!isCompletedTab}
              onClick={() => {
                setPage(1)
                setFilters((current) => ({
                  ...current,
                  status: undefined,
                }))
              }}
            >
              {TASKS_PAGE_COPY.allTab}
            </TabButton>
            <TabButton
              type="button"
              $active={isCompletedTab}
              onClick={() => {
                setPage(1)
                setFilters((current) => ({
                  ...current,
                  status: TaskStatus.Completed,
                }))
              }}
            >
              {TASKS_PAGE_COPY.completedTab}
            </TabButton>
          </TabsRow>

          <FilterBar>
            <Input
              aria-label="Search"
              value={filters.search}
              placeholder="Search tasks"
              onChange={(event) => {
                setPage(1)
                setFilters((current) => ({ ...current, search: event.target.value }))
              }}
            />

            <Select
              aria-label="Priority filter"
              value={filters.priority ?? ''}
              onChange={(event) => {
                setPage(1)
                setFilters((current) => ({
                  ...current,
                  priority: (event.target.value || undefined) as TaskPriority | undefined,
                }))
              }}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              aria-label="Sort order"
              value={`${sortState.sortBy}:${sortState.sortDirection}`}
              onChange={(event) => {
                const [sortBy, sortDirection] = event.target.value.split(':')
                setSortState({
                  sortBy: sortBy as typeof sortState.sortBy,
                  sortDirection: sortDirection as typeof sortState.sortDirection,
                })
              }}
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="dueDate:asc">Due date soonest</option>
              <option value="priority:desc">Priority high to low</option>
            </Select>
          </FilterBar>
        </Section>

        <Section>
          <InlineMessage>{showingText}</InlineMessage>
        </Section>

        {!isLoading && !isError && visibleTasks.length > 0 ? (
          <TaskList
            tasks={visibleTasks}
            onToggleStatus={async (task) => {
              const status =
                  task.status === TaskStatus.Todo
                    ? TaskStatus.InProgress
                    : task.status === TaskStatus.InProgress
                      ? TaskStatus.Completed
                      : TaskStatus.Todo
              await updateTaskStatus({ taskId: task.id, status })
            }}
            onDelete={async (taskId) => {
              await deleteTask(taskId)
            }}
          />
        ) : null}

        <PaginationRow>
          <PaginationButton type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </PaginationButton>
          <InlineMessage>
            Page {page} of {totalPages}
          </InlineMessage>
          <PaginationButton type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </PaginationButton>
        </PaginationRow>
      </Main>
    </Page>
  )
}

export default Tasks
