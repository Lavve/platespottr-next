'use client'

import { Box, Fade, Paper, Slide, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import Logo from '@/components/Logo'
import { GOOGLE_PLAY_URL, SUPPRESS_INSTALL_DURATION_DAYS, VIBRATE_ALERT } from '@/constants/app'
import useInstallPrompt from '@/hooks/useInstallPrompt'
import { useSettings } from '@/providers/settingsProvider'
import { vibrate } from '@/utils/vibrate'

const InstallPromptDialog = () => {
  const t = useTranslations()
  const { type: installType, promptEvent: installPrompt } = useInstallPrompt()
  const { settings, saveSettings } = useSettings()
  const [isVisible, setIsVisible] = useState(false)

  const shouldShowInstallPrompt = useCallback((): boolean => {
    if (!settings?.supressedInstallAt) return true

    try {
      const ageInMs = Date.now() - (settings.supressedInstallAt ?? 0)
      const maxAge = 1000 * 60 * 60 * 24 * SUPPRESS_INSTALL_DURATION_DAYS
      return ageInMs > maxAge
    } catch {
      return true
    }
  }, [settings])

  const handleInstall = async () => {
    if (installType === 'pwa' && installPrompt) {
      installPrompt.prompt()
      const result = await installPrompt.userChoice
      console.log('Användarval:', result.outcome)
    } else if (installType === 'google-play') {
      // Open Google Play Store
      window.open(GOOGLE_PLAY_URL, '_blank')
    }
    setIsVisible(false)
  }

  const handleDismiss = () => {
    saveSettings({ ...settings, supressedInstallAt: Date.now() })
    setIsVisible(false)
  }

  useEffect(() => {
    const checkInstallation = () => {
      const suppressed = !shouldShowInstallPrompt()

      if (installType && !suppressed) {
        vibrate(VIBRATE_ALERT)
        setIsVisible(true)
      }
    }

    const timer = setTimeout(checkInstallation, 8000)

    return () => clearTimeout(timer)
  }, [installType, shouldShowInstallPrompt])

  if (!isVisible) return null

  const getInstallButtonText = () => {
    if (installType === 'google-play') {
      return t('install_prompt.install_google_play')
    } else if (installType === 'pwa-to-play') {
      return t('install_prompt.install_google_play_better')
    }
    return t('install_prompt.install')
  }

  const getDescription = () => {
    if (installType === 'google-play') {
      return t('install_prompt.description_google_play')
    } else if (installType === 'pwa-to-play') {
      return t('install_prompt.description_pwa_to_play')
    }
    return t('install_prompt.description')
  }

  return (
    <Slide appear={true} direction='up' in={isVisible}>
      <Fade appear={false} in={isVisible}>
        <Paper
          role='dialog'
          aria-modal='false'
          square
          variant='outlined'
          tabIndex={-1}
          sx={{
            position: 'fixed',
            zIndex: 1000,
            bottom: 0,
            left: 0,
            right: 0,
            m: 0,
            p: 2,
            borderWidth: 0,
            borderTopWidth: 1,
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ flexShrink: 0 }}>
                <Logo size={60} />
              </Box>
              <Box sx={{ flexShrink: 1, alignSelf: { xs: 'flex-start', md: 'center' } }}>
                <Typography variant='h6'>{t('install_prompt.title')}</Typography>
                <Typography variant='body1'>{getDescription()}</Typography>
              </Box>
            </Box>
            <Stack
              direction='row'
              sx={{
                gap: 2,
                flexShrink: 0,
                alignSelf: { xs: 'flex-end', md: 'center' },
              }}
            >
              <VibrateButton onClick={handleDismiss} variant='outlined' color='primary'>
                {t('install_prompt.dismiss')}
              </VibrateButton>
              <VibrateButton onClick={handleInstall} variant='contained' color='primary' size='large'>
                {getInstallButtonText()}
              </VibrateButton>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </Slide>
  )
}

export default InstallPromptDialog
