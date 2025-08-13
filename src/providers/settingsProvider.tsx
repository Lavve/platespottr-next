'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SETTINGS_KEY } from '@/constants/app'
import { defaultSettings } from '@/constants/settings'
import { useGetSettings, useSaveSettings } from '@/hooks/useApi'
import type { IProviderProps } from '@/types/common'
import type { ISettings, ISettingsContext, ThemeMode } from '@/types/settings'
import { useSnackbar } from './SnackbarProvider'
import { useUser } from './userProvider'

const SettingsContext = createContext<ISettingsContext | undefined>(undefined)

const SettingsProvider = ({ children }: IProviderProps) => {
  const { user } = useUser()
  const { showWarning } = useSnackbar()
  const [settings, setSettings] = useState<ISettings>(defaultSettings)
  const [pendingChanges, setPendingChanges] = useState<Partial<ISettings>>({})

  const saveSettingsMutation = useSaveSettings()
  const { data: apiSettings, isLoading: isLoadingSettings } = useGetSettings(user?.id || '', !!user?.id)

  const saveSettings = useCallback(
    (newSettings: ISettings) => {
      setSettings(newSettings)
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))

      if (user?.id) {
        setPendingChanges(prev => ({ ...prev, ...newSettings }))
      }
    },
    [user?.id]
  )

  const syncSettingsToApi = useCallback(async () => {
    if (user?.id && Object.keys(pendingChanges).length > 0 && !saveSettingsMutation.isPending) {
      try {
        await saveSettingsMutation.mutateAsync({
          userId: user.id,
          settings: JSON.stringify(settings),
        })
        setPendingChanges({})
      } catch (error) {
        console.error('Failed to sync settings to API:', error)
        showWarning('Failed to save settings to API, saving local storage only')
        // Could add retry logic or user notification here
      }
    }
  }, [user?.id, pendingChanges, settings, saveSettingsMutation, showWarning])

  useEffect(() => {
    if (apiSettings?.success && apiSettings.settings) {
      try {
        const mergedSettings = { ...defaultSettings, ...apiSettings.settings }
        setSettings(mergedSettings)
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(mergedSettings))
      } catch (error) {
        console.error('Failed to parse API settings:', error)
      }
    }
  }, [apiSettings])

  const setTheme = useCallback(
    (choice: ThemeMode) => {
      if (settings.themeChoice !== choice) {
        let newTheme = choice

        if (choice === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          newTheme = mediaQuery.matches ? 'dark' : 'light'
        }

        const updatedSettings = { ...settings, themeChoice: choice, theme: newTheme }

        setSettings(updatedSettings)
        return updatedSettings
      }

      return settings
    },
    [settings]
  )

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
      setSettings((prev: ISettings) => {
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
    () => ({ settings, isLoadingSettings, saveSettings, setTheme, resetSettings, removeSettings, syncSettingsToApi }),
    [settings, isLoadingSettings, saveSettings, setTheme, resetSettings, removeSettings, syncSettingsToApi]
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
