'use client'

import { BarChart, EmojiEvents, Help, People, Settings } from '@mui/icons-material'
import { Badge, Box, Button, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import FriendsDialog from '@/components/dialogs/FriendsDialog'
import RulesDialog from '@/components/dialogs/RulesDialog'
import SettingsDialog from '@/components/dialogs/SettingsDialog'
import StatisticsDialog from '@/components/dialogs/StatisticsDialog'
import TopListDialog from '@/components/dialogs/TopListDialog'
import FindPlate from '@/components/FindPlate'
import Logo from '@/components/Logo'
import Streak from '@/components/Streak'
import { useFriends } from '@/providers/friendsProvider'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import theme, { darkTheme } from '@/style/theme'

export default function Home() {
  const { user } = useUser()
  const { settings, saveSettings } = useSettings()
  const { friendList, friendRequests } = useFriends()
  const [isFriendsDialogOpen, setIsFriendsDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false)
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isTopListDialogOpen, setIsTopListDialogOpen] = useState(false)
  const currentTheme = useMemo(() => (settings.theme === 'dark' ? darkTheme : theme), [settings.theme])
  const initialRuleTimer = useRef<NodeJS.Timeout | null>(null)

  // Update isRulesDialogOpen when settings change
  useEffect(() => {
    if (initialRuleTimer.current) {
      clearTimeout(initialRuleTimer.current)
    }

    initialRuleTimer.current = setTimeout(() => {
      setIsRulesDialogOpen(settings.initialRulesDialogOpen ?? false)
    }, 500)

    return () => {
      if (initialRuleTimer.current) {
        clearTimeout(initialRuleTimer.current)
      }
    }
  }, [settings.initialRulesDialogOpen])

  const onCloseRulesDialog = () => {
    saveSettings({ ...settings, initialRulesDialogOpen: false })
    setIsRulesDialogOpen(false)
  }

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
        <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, p: 2, borderRadius: 2 }}>
          <Logo size={50} />
          <Typography component='h1' variant='h4' sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100 }}>
            latespottr
          </Typography>
        </Paper>

        <FindPlate />

        <Streak />

        <Grid container rowSpacing={1} columnSpacing={1} sx={{ mt: 2 }}>
          <Grid size={4}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              fullWidth
              disabled={user?.plates.length === 1}
              startIcon={<BarChart />}
              onClick={() => setIsStatisticsDialogOpen(true)}
            >
              Statistik
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              fullWidth
              startIcon={<People />}
              disabled={friendList.length + friendRequests.length === 0}
              onClick={() => setIsFriendsDialogOpen(true)}
            >
              <Badge badgeContent={friendRequests.length} color='secondary'>
                Vänner
              </Badge>
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              disabled={friendList.length === 0}
              fullWidth
              startIcon={<EmojiEvents />}
              onClick={() => setIsTopListDialogOpen(true)}
            >
              Topplista
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              fullWidth
              startIcon={<Help />}
              onClick={() => setIsRulesDialogOpen(true)}
            >
              Regler
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              variant='outlined'
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

        <FriendsDialog open={isFriendsDialogOpen} onClose={() => setIsFriendsDialogOpen(false)} />
        <StatisticsDialog open={isStatisticsDialogOpen} onClose={() => setIsStatisticsDialogOpen(false)} />
        <RulesDialog open={isRulesDialogOpen} onClose={onCloseRulesDialog} />
        <SettingsDialog open={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)} />
        <TopListDialog open={isTopListDialogOpen} onClose={() => setIsTopListDialogOpen(false)} />
      </Container>
    </MuiThemeProvider>
  )
}
