import styled from 'styled-components'

export const Section = styled.section`
  margin-bottom: 1rem;
`

export const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TabsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const TabButton = styled.button<{ $active?: boolean }>`
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font: inherit;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.buttonText : theme.colors.textPrimary)};
  background: ${({ theme, $active }) =>
    $active
      ? 'linear-gradient(140deg, rgba(57, 119, 255, 0.9) 0%, rgba(43, 99, 222, 0.9) 100%)'
      : theme.colors.surfaceSecondary};
  cursor: pointer;
`

export const FilterBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: inherit;
`

export const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.55rem 2.3rem 0.55rem 0.75rem;
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

export const InlineMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const PaginationRow = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PaginationButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
  font: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: transform 120ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
