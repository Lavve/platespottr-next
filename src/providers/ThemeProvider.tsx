'use client'

import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import theme, { darkTheme } from '@/style/theme'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  themeMode: ThemeMode
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detektera systemets preferred color scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDarkMode(e.matches)
      }
    }

    // Sätt initial värde
    if (themeMode === 'system') {
      setIsDarkMode(mediaQuery.matches)
    }

    // Lyssna på ändringar
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // Uppdatera tema baserat på mode
  useEffect(() => {
    switch (themeMode) {
      case 'light':
        setIsDarkMode(false)
        break
      case 'dark':
        setIsDarkMode(true)
        break
      case 'system':
        // Låt systemet bestämma (hanteras av första useEffect)
        break
    }
  }, [themeMode])

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  // Välj rätt tema baserat på isDarkMode
  const currentTheme = isDarkMode ? darkTheme : theme

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
