import styled from 'styled-components'
import type { TaskStatus } from '@/types/api'

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
`

export const Card = styled.li<{ $status: TaskStatus }>`
  border: 1px solid
    ${({ theme, $status }) => ($status === 'Completed' ? 'rgba(22, 162, 107, 0.4)' : theme.colors.border)};
  border-left-width: ${({ $status }) => ($status === 'Completed' ? '5px' : '1px')};
  border-radius: 14px;
  background: ${({ theme, $status }) =>
    $status === 'Completed' ? 'linear-gradient(150deg, rgba(22, 162, 107, 0.12) 0%, rgba(255, 255, 255, 0.64) 60%)' : theme.colors.surface};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const CardTitle = styled.h3<{ $status: TaskStatus }>`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme, $status }) => ($status === 'Completed' ? theme.colors.textMuted : theme.colors.textPrimary)};
  text-decoration: ${({ $status }) => ($status === 'Completed' ? 'line-through' : 'none')};
`

export const CardMeta = styled.p<{ $status: TaskStatus }>`
  margin: 0.3rem 0 0;
  color: ${({ theme, $status }) => ($status === 'Completed' ? theme.colors.textSecondary : theme.colors.textMuted)};
  font-size: 0.9rem;
`

export const Description = styled.p<{ $status: TaskStatus }>`
  margin: 0.75rem 0 0;
  color: ${({ theme, $status }) => ($status === 'Completed' ? theme.colors.textMuted : theme.colors.textSecondary)};
`

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ActionButton = styled.button<{ $variant?: 'neutral' | 'danger' }>`
  border: 1px solid
    ${({ theme, $variant }) => ($variant === 'danger' ? 'rgba(225, 70, 95, 0.35)' : theme.colors.border)};
  border-radius: 10px;
  padding: 0.35rem 0.65rem;
  font: inherit;
  font-weight: 500;
  background: ${({ theme, $variant }) =>
    $variant === 'danger'
      ? 'linear-gradient(140deg, rgba(225, 70, 95, 0.92) 0%, rgba(197, 45, 70, 0.92) 100%)'
      : theme.colors.surfaceSecondary};
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.buttonText : theme.colors.textPrimary)};
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.98);
  }
`

export const StatusChip = styled.span<{ $status: TaskStatus }>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.18rem 0.5rem;
  margin-right: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${({ theme, $status }) =>
    $status === 'Completed' || $status === 'InProgress' ? theme.colors.buttonText : theme.colors.textPrimary};
  background: ${({ theme, $status }) => {
    if ($status === 'Completed') {
      return 'linear-gradient(140deg, rgba(22, 162, 107, 0.92) 0%, rgba(23, 141, 99, 0.92) 100%)'
    }
    if ($status === 'InProgress') {
      return 'linear-gradient(140deg, rgba(57, 119, 255, 0.86) 0%, rgba(43, 99, 222, 0.86) 100%)'
    }
    return theme.colors.surfaceSecondary
  }};
`
