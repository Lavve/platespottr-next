'use client'

import { BarChart, EmojiEvents, Help, People, Settings } from '@mui/icons-material'
import { Button, Container, CssBaseline, Grid } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import RulesDialog from '@/components/dialogs/RulesDialog'
import SettingsDialog from '@/components/dialogs/SettingsDialog'
import FindPlate from '@/components/FindPlate'
import GameProvider from '@/providers/gameProvider'
import { useSettings } from '@/providers/settingsProvider'
import theme, { darkTheme } from '@/style/theme'

export default function Home() {
  const { settings, saveSettings } = useSettings()
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(settings.initialRulesDialogOpen ?? false)
  const currentTheme = useMemo(() => (settings.theme === 'dark' ? darkTheme : theme), [settings.theme])

  // Update isRulesDialogOpen when settings change
  useEffect(() => {
    setIsRulesDialogOpen(settings.initialRulesDialogOpen ?? false)
  }, [settings.initialRulesDialogOpen])

  const onCloseRulesDialog = () => {
    saveSettings({ ...settings, initialRulesDialogOpen: false })
    setIsRulesDialogOpen(false)
  }

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GameProvider>
        <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ textAlign: 'center', margin: 0, padding: 0 }}>Platespottr</h1>
          <FindPlate />

          <Grid container rowSpacing={1} columnSpacing={1}>
            <Grid size={6}>
              <Button variant='contained' color='primary' size='large' fullWidth startIcon={<BarChart />}>
                Statistik
              </Button>
            </Grid>
            <Grid size={6}>
              <Button variant='contained' color='primary' size='large' fullWidth startIcon={<People />}>
                Vänner
              </Button>
            </Grid>
            <Grid size={6}>
              <Button variant='contained' color='primary' size='large' fullWidth startIcon={<EmojiEvents />}>
                Topplista
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth
                startIcon={<Help />}
                onClick={() => setIsRulesDialogOpen(true)}
              >
                Regler
              </Button>
            </Grid>
            <Grid size={12}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth
                startIcon={<Settings />}
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                Inställningar
              </Button>
            </Grid>
          </Grid>

          <RulesDialog open={isRulesDialogOpen} onClose={onCloseRulesDialog} />
          <SettingsDialog open={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)} />

          {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Roadsign text='Roadsign' />
            <Roadsign number='22' text='Roadsign' />
          </Box> */}
        </Container>
      </GameProvider>
    </MuiThemeProvider>
  )
}
