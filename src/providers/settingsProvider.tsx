'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ISettings, ISettingsContext, ThemeMode } from '@/types/settings'

const defaultSettings: ISettings = {
  theme: 'light',
  themeChoice: 'system',
  initialRulesDialogOpen: true,
}

const SettingsContext = createContext<ISettingsContext>({
  settings: defaultSettings,
  saveSettings: () => {},
  setThemeChoice: () => {},
})

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ISettings>(defaultSettings)

  const saveSettings = useCallback((newSettings: ISettings) => {
    setSettings(newSettings)
    localStorage.setItem('PS_settings', JSON.stringify(newSettings))
  }, [])

  const setThemeChoice = useCallback((choice: ThemeMode) => {
    setSettings(prev => {
      let newTheme = choice

      // If choice is 'system', determine the actual theme
      if (choice === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        newTheme = mediaQuery.matches ? 'dark' : 'light'
      }

      const updatedSettings = { ...prev, themeChoice: choice, theme: newTheme }
      localStorage.setItem('PS_settings', JSON.stringify(updatedSettings))
      setSettings(updatedSettings)
      return updatedSettings
    })
  }, [])

  useEffect(() => {
    const storedSettings = localStorage.getItem('PS_settings')
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    let initialSettings = { ...defaultSettings }

    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings)
      initialSettings = { ...defaultSettings, ...parsedSettings }
    }

    // If themeChoice is 'system', determine the actual theme based on system preference
    if (initialSettings.themeChoice === 'system') {
      initialSettings.theme = mediaQuery.matches ? 'dark' : 'light'
    }

    setSettings(initialSettings)

    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => {
        if (prev.themeChoice === 'system') {
          return { ...prev, theme: e.matches ? 'dark' : 'light' }
        }
        return prev
      })
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value = useMemo(() => ({ settings, saveSettings, setThemeChoice }), [settings, saveSettings, setThemeChoice])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  return useContext(SettingsContext)
}

export default SettingsContext
