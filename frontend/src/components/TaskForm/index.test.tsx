import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { TaskForm } from '.'
import { renderWithProviders } from '@/test/test-utils'

describe('TaskForm', () => {
  it('shows required validation when title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<TaskForm onSubmit={onSubmit} isSubmitting={false} />)
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('prevents whitespace-only title submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<TaskForm onSubmit={onSubmit} isSubmitting={false} />)
    await user.type(screen.getByLabelText(/title/i), '   ')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits entered values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    renderWithProviders(<TaskForm onSubmit={onSubmit} isSubmitting={false} />)

    await user.type(screen.getByLabelText(/title/i), 'Ship MVP')
    await user.type(screen.getByLabelText(/description/i), 'Finish take-home')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Ship MVP',
        description: 'Finish take-home',
      }),
    )
  })
})
