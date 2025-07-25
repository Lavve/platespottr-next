'use client'

import { Button, ButtonGroup } from '@mui/material'
import { useSettings } from '@/providers/settingsProvider'

export const ThemeToggle = () => {
  const { settings, setThemeChoice } = useSettings()

  return (
    <ButtonGroup variant='outlined' size='small' fullWidth>
      <Button
        onClick={() => setThemeChoice('light')}
        variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
      >
        Ljust
      </Button>
      <Button
        onClick={() => setThemeChoice('dark')}
        variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
      >
        Mörkt
      </Button>
      <Button
        onClick={() => setThemeChoice('system')}
        variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
      >
        System
      </Button>
    </ButtonGroup>
  )
}
