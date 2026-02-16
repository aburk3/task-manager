const TASK_FORM_COPY = {
  titleLabel: 'Title',
  descriptionLabel: 'Description',
  priorityLabel: 'Priority',
  dueDateLabel: 'Due Date',
  titlePlaceholder: 'Add a task title',
  descriptionPlaceholder: 'Optional details',
  submitIdle: 'Add Task',
  submitPending: 'Saving...',
  submitErrorFallback: 'Unable to save task.',
} as const

const TASK_FORM_VALIDATION_MESSAGES = {
  titleRequired: 'Title is required.',
  titleMaxLength: 'Title must be 120 characters or fewer.',
  descriptionMaxLength: 'Description must be 1000 characters or fewer.',
  dueDateInvalid: 'Due Date must be a valid date.',
} as const

export { TASK_FORM_COPY, TASK_FORM_VALIDATION_MESSAGES }
