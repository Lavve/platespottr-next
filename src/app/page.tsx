'use client'

import { BarChart, EmojiEvents, Help, People, Settings } from '@mui/icons-material'
import { Badge, Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import CompleteDialog from '@/components/dialogs/CompleteDialog'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import FriendsDialog from '@/components/dialogs/FriendsDialog'
import InstallPromptDialog from '@/components/dialogs/InstallPromptDialog'
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
import { generateSlug } from '@/utils/generateSlug'
import { vibrate } from '@/utils/vibrate'

export default function HomePage() {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { settings, saveSettings } = useSettings()
  const { friends, friendList, friendRequests, addFriend } = useFriends()
  const [friendSlug, setFriendSlug] = useState<string | null>(null)
  const [isFriendsDialogOpen, setIsFriendsDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false)
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false)
  const [isTopListDialogOpen, setIsTopListDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false)
  const [isAddPlateDialogOpen, setIsAddPlateDialogOpen] = useState(false)
  const initialRuleTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      const addFriendHash = hash.match(/^#add-friend=([\w-]+)$/)
      const addPlateHash = hash.match(/^#add-plate$/)

      if (addFriendHash) {
        setFriendSlug(addFriendHash[1])
        setIsAddFriendDialogOpen(true)
      } else if (addPlateHash) {
        setIsAddPlateDialogOpen(true)
      } else {
        setFriendSlug(null)
        setIsAddFriendDialogOpen(false)
        setIsAddPlateDialogOpen(false)
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => {
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

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

  useEffect(() => {
    if (user?.plates.length === 999) {
      setIsCompleteDialogOpen(true)
    }
  }, [user?.plates])

  const handleAddPlate = () => {
    vibrate()
    window.history.replaceState({}, '', '/')
    if (!user) return
    saveUser({ ...user, plates: [...user.plates, Date.now()] })
    setIsAddPlateDialogOpen(false)
  }

  const handleAddFriend = () => {
    vibrate()
    window.history.replaceState({}, '', '/')
    setIsAddFriendDialogOpen(false)
    if (!friendSlug) return
    const friend = friends.find(f => f.slug === friendSlug)
    if (friend) return
    addFriend({ name: 'Stina', slug: generateSlug(), plates: [Date.now() - 1000 * 60 * 60 * 24 * 27] })
  }

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        height: '100vh',
      }}
    >
      <Paper
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, p: 2, borderRadius: 2 }}
        elevation={5}
      >
        <Logo size={50} />
        <Typography
          component='h1'
          variant='h5'
          sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100, textTransform: 'uppercase' }}
        >
          latespottr
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FindPlate />
        <Streak />
      </Box>

      <Grid container rowSpacing={1} columnSpacing={1} sx={{ mt: 2 }}>
        <Grid size={4}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            fullWidth
            disabled={user?.plates.length === 0}
            startIcon={<BarChart />}
            onClick={() => {
              vibrate()
              setIsStatisticsDialogOpen(true)
            }}
          >
            {t('app.statistics')}
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
            onClick={() => {
              vibrate()
              setIsFriendsDialogOpen(true)
            }}
          >
            <Badge badgeContent={friendRequests.length} color='secondary'>
              {t('app.friends')}
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
            onClick={() => {
              vibrate()
              setIsTopListDialogOpen(true)
            }}
          >
            {t('app.toplist')}
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            variant='outlined'
            color='primary'
            size='large'
            fullWidth
            startIcon={<Help />}
            onClick={() => {
              vibrate()
              setIsRulesDialogOpen(true)
            }}
          >
            {t('app.rules')}
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            variant='outlined'
            color='primary'
            size='large'
            fullWidth
            startIcon={<Settings />}
            onClick={() => {
              vibrate()
              setIsSettingsDialogOpen(true)
            }}
          >
            {t('app.settings')}
          </Button>
        </Grid>
      </Grid>

      <ConfirmDialog
        title={t('app.add_plate')}
        content={friendList.length > 0 ? t('app.add_plate_description') : t('app.add_plate_description_no_friends')}
        onConfirm={handleAddPlate}
        open={isAddPlateDialogOpen}
        onClose={() => {
          vibrate()
          window.history.replaceState({}, '', '/')
          setIsAddPlateDialogOpen(false)
        }}
      />
      <ConfirmDialog
        title={t('app.add_friend')}
        content={t('app.add_friend_description', { friendSlug: friendSlug || '' })}
        onConfirm={handleAddFriend}
        open={isAddFriendDialogOpen}
        onClose={() => {
          vibrate()
          window.history.replaceState({}, '', '/')
          setIsAddFriendDialogOpen(false)
        }}
      />
      <StatisticsDialog
        open={isStatisticsDialogOpen}
        onClose={() => {
          vibrate()
          setIsStatisticsDialogOpen(false)
        }}
      />
      <FriendsDialog
        open={isFriendsDialogOpen}
        onClose={() => {
          vibrate()
          setIsFriendsDialogOpen(false)
        }}
      />
      <TopListDialog
        open={isTopListDialogOpen}
        onClose={() => {
          vibrate()
          setIsTopListDialogOpen(false)
        }}
      />
      <RulesDialog
        open={isRulesDialogOpen}
        onClose={() => {
          vibrate()
          onCloseRulesDialog()
        }}
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => {
          vibrate()
          setIsSettingsDialogOpen(false)
        }}
      />
      <InstallPromptDialog />
      <CompleteDialog
        open={isCompleteDialogOpen}
        onClose={() => {
          vibrate()
          setIsCompleteDialogOpen(false)
        }}
      />
    </Container>
  )
}
