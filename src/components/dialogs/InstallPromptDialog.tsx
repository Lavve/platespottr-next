'use client'

import { Box, Button, Fade, Paper, Slide, Stack, Typography } from '@mui/material'
import TrapFocus from '@mui/material/Unstable_TrapFocus'
import { useCallback, useEffect, useState } from 'react'
import { SUPPRESS_INSTALL_DURATION_DAYS } from '@/constants/app'
import useInstallPrompt from '@/hooks/useInstallPrompt'
import { useSettings } from '@/providers/settingsProvider'
import { vibrate } from '@/utils/vibrate'
import Logo from '../Logo'

export default function InstallPromptDialog() {
  const installPrompt = useInstallPrompt()
  const { settings, saveSettings } = useSettings()
  const [open, setOpen] = useState(false)

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
    if (!installPrompt) return
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    console.log('Användarval:', result.outcome)
    setOpen(false)
  }

  const handleDismiss = () => {
    saveSettings({ ...settings, supressedInstallAt: Date.now() })
    vibrate()
    setOpen(false)
  }

  useEffect(() => {
    const checkInstallation = () => {
      const suppressed = !shouldShowInstallPrompt()

      if (installPrompt && !suppressed) {
        vibrate([20, 100, 20, 100, 20])
        setOpen(true)
      }
    }

    const timer = setTimeout(checkInstallation, 8000)

    return () => clearTimeout(timer)
  }, [installPrompt, shouldShowInstallPrompt])

  if (!open) return null

  return (
    <TrapFocus open disableAutoFocus disableEnforceFocus>
      <Slide appear={true} direction='up' in={open}>
        <Fade appear={false} in={open}>
          <Paper
            role='dialog'
            aria-modal='false'
            square
            variant='outlined'
            tabIndex={-1}
            sx={{
              position: 'fixed',
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
                  <Typography variant='h6'>Installera Platespottr</Typography>
                  <Typography variant='body1'>
                    Installera Platespottr som en app! Då får du snabbare åtkomst, smidigare upplevelse, helskärmsläge
                    och dessutom offline-stöd.
                  </Typography>
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
                <Button onClick={handleDismiss} variant='outlined' color='primary'>
                  Nej tack
                </Button>
                <Button onClick={handleInstall} variant='contained' color='primary' size='large'>
                  Installera
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </Slide>
    </TrapFocus>
  )
}
