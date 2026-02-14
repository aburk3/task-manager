import styled from 'styled-components'

export const Form = styled.form`
  display: grid;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`

export const FormRow = styled.div`
  display: grid;
  gap: 0.5rem;
`

export const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;
`

export const Input = styled.input<{ $hasError?: boolean }>`
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: inherit;

  &[type='date'] {
    padding-right: 2.4rem;
    min-height: 2.4rem;
  }

  &[type='date']::-webkit-calendar-picker-indicator {
    margin-left: 0;
    margin-right: 0.1rem;
    opacity: 0.78;
    cursor: pointer;
  }

  &[type='date']::-webkit-datetime-edit {
    padding-left: 0;
  }
`

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  min-height: 80px;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: inherit;
`

export const Select = styled.select<{ $hasError?: boolean }>`
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: 10px;
  padding: 0.6rem 2.3rem 0.6rem 0.75rem;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath d='M3 5.2L7 9l4-3.8' stroke='%23385372' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")
      no-repeat right 0.8rem center / 0.85rem,
    ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font: inherit;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const SubmitButton = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.buttonText};
  background: linear-gradient(140deg, ${({ theme }) => theme.colors.success} 0%, #1fb57b 100%);
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(21, 144, 96, 0.32);
  transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;

  &:hover:not(:disabled) {
    background: linear-gradient(140deg, ${({ theme }) => theme.colors.successHover} 0%, #1b9f6f 100%);
    transform: translateY(-1px);
    filter: saturate(1.04);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`

export const FieldError = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.danger};
`

export const FormError = styled.div`
  margin-top: 0.25rem;
  border: 1px solid rgba(225, 70, 95, 0.35);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  background: rgba(225, 70, 95, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
`
