import type { ReactNode } from 'react'

export interface ThemeProviderProps {
  children: ReactNode
}

export interface ThemeContextType {
  themeMode: 'light' | 'dark' | 'system'
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark' | 'system') => void
}
