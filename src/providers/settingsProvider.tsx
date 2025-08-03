'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SETTINGS_KEY } from '@/constants/app'
import { defaultSettings } from '@/constants/settings'
import type { IProviderProps } from '@/types/common'
import type { ISettings, ISettingsContext, ThemeMode } from '@/types/settings'

const SettingsContext = createContext<ISettingsContext | undefined>(undefined)

const SettingsProvider = ({ children }: IProviderProps) => {
  const [settings, setSettings] = useState<ISettings>(defaultSettings)

  const saveSettings = useCallback((newSettings: ISettings) => {
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
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
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings))
      setSettings(updatedSettings)
      return updatedSettings
    })
  }, [])

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    let initialSettings = { ...defaultSettings }

    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings)
      initialSettings = { ...defaultSettings, ...parsedSettings }
    } else {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(initialSettings))
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

  const resetSettings = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const newSettings = {
      ...defaultSettings,
      initialRulesDialogOpen: false,
      theme: mediaQuery.matches ? 'dark' : 'light',
      themeChoice: 'system',
    }
    setSettings(newSettings as ISettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }, [])

  const removeSettings = useCallback(() => {
    localStorage.removeItem(SETTINGS_KEY)
    setSettings(defaultSettings)
  }, [])

  const value = useMemo(
    () => ({ settings, saveSettings, setTheme, resetSettings, removeSettings }),
    [settings, saveSettings, setTheme, resetSettings, removeSettings]
  )

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
