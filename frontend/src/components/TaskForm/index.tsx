import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Actions,
  FieldError,
  Form,
  FormError,
  FormRow,
  Input,
  Label,
  RequiredMark,
  Select,
  SubmitButton,
  TextArea,
} from './styles'
import { TaskPriority } from '@/types/api'

export type TaskFormValues = {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
}

type TaskFormProps = {
  onSubmit: (values: TaskFormValues) => Promise<void>
  isSubmitting: boolean
}

const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must be 120 characters or fewer.'),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer.'),
  priority: z.enum([TaskPriority.Low, TaskPriority.Medium, TaskPriority.High]),
  dueDate: z.string().refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Due Date must be a valid date.'),
})

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
  priority: TaskPriority.Medium,
  dueDate: '',
}

export const TaskForm = ({ onSubmit, isSubmitting }: TaskFormProps) => {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: INITIAL_VALUES,
    mode: 'onTouched',
  })

  const onFormSubmit = handleSubmit(async (values: TaskFormValues) => {
    setFormError(null)
    clearErrors()

    const parsed = taskFormSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field && typeof field === 'string') {
          setError(field as keyof TaskFormValues, {
            type: 'manual',
            message: issue.message,
          })
        }
      })
      return
    }

    try {
      await onSubmit(values)
      reset(INITIAL_VALUES)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save task.')
    }
  })

  return (
    <Form onSubmit={onFormSubmit}>
      <FormRow>
        <Label htmlFor="task-title">
          Title
          <RequiredMark aria-hidden="true">*</RequiredMark>
        </Label>
        <Input
          id="task-title"
          $hasError={Boolean(errors.title)}
          aria-invalid={Boolean(errors.title)}
          {...register('title')}
          maxLength={120}
          placeholder="Add a task title"
        />
        {errors.title ? <FieldError>{errors.title.message}</FieldError> : null}
      </FormRow>

      <FormRow>
        <Label htmlFor="task-description">Description</Label>
        <TextArea
          id="task-description"
          $hasError={Boolean(errors.description)}
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
          maxLength={1000}
          placeholder="Optional details"
        />
        {errors.description ? <FieldError>{errors.description.message}</FieldError> : null}
      </FormRow>

      <FormRow>
        <Label htmlFor="task-priority">
          Priority
          <RequiredMark aria-hidden="true">*</RequiredMark>
        </Label>
        <Select id="task-priority" $hasError={Boolean(errors.priority)} aria-invalid={Boolean(errors.priority)} {...register('priority')}>
          {Object.values(TaskPriority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
        {errors.priority ? <FieldError>{errors.priority.message}</FieldError> : null}
      </FormRow>

      <FormRow>
        <Label htmlFor="task-dueDate">Due Date</Label>
        <Input
          id="task-dueDate"
          type="date"
          $hasError={Boolean(errors.dueDate)}
          aria-invalid={Boolean(errors.dueDate)}
          {...register('dueDate')}
        />
        {errors.dueDate ? <FieldError>{errors.dueDate.message}</FieldError> : null}
      </FormRow>

      {formError ? <FormError role="alert">{formError}</FormError> : null}

      <Actions>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Task'}
        </SubmitButton>
      </Actions>
    </Form>
  )
}
