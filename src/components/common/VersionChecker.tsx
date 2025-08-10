'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useSettings } from '@/providers/settingsProvider'
import packageJson from '../../../package.json'

const VersionChecker = () => {
  const { settings, saveSettings } = useSettings()
  const { showSuccess } = useSnackbar()
  const t = useTranslations('notifications')

  const currentVersion = useMemo(() => {
    return packageJson.version
  }, [])

  useEffect(() => {
    const installedVersion = settings.installedVersion

    if (installedVersion && installedVersion !== currentVersion) {
      saveSettings({ ...settings, installedVersion: currentVersion })
      showSuccess(t('app_updated', { version: currentVersion }))
    }
  }, [settings, currentVersion, showSuccess, t, saveSettings])

  return null
}

export default VersionChecker
