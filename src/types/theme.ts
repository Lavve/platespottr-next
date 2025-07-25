import type { ReactNode } from 'react'

export interface ThemeProviderProps {
  children: ReactNode
}

export interface ThemeContextType {
  isDarkMode: boolean
  setTheme: (mode: 'light' | 'dark' | 'system') => void
}
