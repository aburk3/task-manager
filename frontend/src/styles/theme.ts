export const theme = {
  colors: {
    background: 'linear-gradient(150deg, #ecf4ff 0%, #d8e8ff 45%, #eef7ff 100%)',
    surface: 'rgba(255, 255, 255, 0.66)',
    surfaceSecondary: 'rgba(255, 255, 255, 0.52)',
    border: 'rgba(72, 111, 168, 0.25)',
    primary: '#3977ff',
    primaryHover: '#2b63de',
    success: '#16a26b',
    successHover: '#128659',
    danger: '#e1465f',
    dangerHover: '#c9354d',
    buttonText: '#ffffff',
    textPrimary: '#0d2038',
    textSecondary: '#385372',
    textMuted: '#5a6d86',
    focusRing: 'rgba(62, 124, 255, 0.4)',
    shadow: '0 20px 40px rgba(44, 79, 133, 0.15)',
  },
  media: {
    mobile: '768px',
  },
} as const

export type AppTheme = typeof theme
