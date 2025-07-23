'use client'

import { Button, ButtonGroup } from '@mui/material'
import { useThemeContext } from '@/providers/ThemeProvider'

export const ThemeToggle = () => {
  const { themeMode, setTheme } = useThemeContext()

  return (
    <ButtonGroup variant='outlined' size='small'>
      <Button onClick={() => setTheme('light')} variant={themeMode === 'light' ? 'contained' : 'outlined'}>
        Ljust
      </Button>
      <Button onClick={() => setTheme('dark')} variant={themeMode === 'dark' ? 'contained' : 'outlined'}>
        Mörkt
      </Button>
      <Button onClick={() => setTheme('system')} variant={themeMode === 'system' ? 'contained' : 'outlined'}>
        System
      </Button>
    </ButtonGroup>
  )
}
