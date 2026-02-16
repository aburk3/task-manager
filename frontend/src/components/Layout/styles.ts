import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const Main = styled.main`
  max-width: 1080px;
  margin: clamp(0.75rem, 2.5vw, 2rem) auto;
  padding: 2rem 1rem 3rem;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  font-size: 1.9rem;
  margin: 0;
  letter-spacing: -0.02em;
`
