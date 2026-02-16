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
import { TASK_FORM_COPY, TASK_FORM_VALIDATION_MESSAGES } from './constants'

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
    .min(1, TASK_FORM_VALIDATION_MESSAGES.titleRequired)
    .max(120, TASK_FORM_VALIDATION_MESSAGES.titleMaxLength),
  description: z.string().max(1000, TASK_FORM_VALIDATION_MESSAGES.descriptionMaxLength),
  priority: z.enum([TaskPriority.Low, TaskPriority.Medium, TaskPriority.High]),
  dueDate: z
    .string()
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), TASK_FORM_VALIDATION_MESSAGES.dueDateInvalid),
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
      setFormError(error instanceof Error ? error.message : TASK_FORM_COPY.submitErrorFallback)
    }
  })

  return (
    <Form onSubmit={onFormSubmit}>
      <FormRow>
        <Label htmlFor="task-title">
          {TASK_FORM_COPY.titleLabel}
          <RequiredMark aria-hidden="true">*</RequiredMark>
        </Label>
        <Input
          id="task-title"
          $hasError={Boolean(errors.title)}
          aria-invalid={Boolean(errors.title)}
          {...register('title')}
          maxLength={120}
          placeholder={TASK_FORM_COPY.titlePlaceholder}
        />
        {errors.title ? <FieldError>{errors.title.message}</FieldError> : null}
      </FormRow>

      <FormRow>
        <Label htmlFor="task-description">{TASK_FORM_COPY.descriptionLabel}</Label>
        <TextArea
          id="task-description"
          $hasError={Boolean(errors.description)}
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
          maxLength={1000}
          placeholder={TASK_FORM_COPY.descriptionPlaceholder}
        />
        {errors.description ? <FieldError>{errors.description.message}</FieldError> : null}
      </FormRow>

      <FormRow>
        <Label htmlFor="task-priority">
          {TASK_FORM_COPY.priorityLabel}
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
        <Label htmlFor="task-dueDate">{TASK_FORM_COPY.dueDateLabel}</Label>
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
          {isSubmitting ? TASK_FORM_COPY.submitPending : TASK_FORM_COPY.submitIdle}
        </SubmitButton>
      </Actions>
    </Form>
  )
}
