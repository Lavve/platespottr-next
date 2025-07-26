'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ISettings, ISettingsContext, Language, ThemeMode } from '@/types/settings'
import { generateSlug } from '@/utils/generateSlug'

const defaultSettings: ISettings = {
  theme: 'light',
  themeChoice: 'system',
  language: 'sv',
  initialRulesDialogOpen: true,
  slug: generateSlug(),
}

const SettingsContext = createContext<ISettingsContext | undefined>(undefined)

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ISettings>(defaultSettings)

  const saveSettings = useCallback((newSettings: ISettings) => {
    setSettings(newSettings)
    localStorage.setItem('PS_settings', JSON.stringify(newSettings))
  }, [])

  const setTheme = useCallback((choice: ThemeMode) => {
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
    } else {
      localStorage.setItem('PS_settings', JSON.stringify(initialSettings))
    }

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

  const value = useMemo(() => ({ settings, saveSettings, setTheme }), [settings, saveSettings, setTheme])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default SettingsProvider
