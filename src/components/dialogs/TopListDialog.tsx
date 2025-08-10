'use client'

import { EmojiEvents, KeyboardDoubleArrowRight, Numbers, Percent } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, Tab, Tabs, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import User from '@/components/user/User'
import { useStatistics } from '@/hooks/useStatistics'
import { useVibration } from '@/hooks/useVibration'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'
import theme from '@/style/theme'
import type { ISortBy } from '@/types/common'

const TopListDialog = () => {
  const t = useTranslations()
  const { user } = useUser()
  const { friendList } = useFriends()
  const { handleClick } = useVibration()
  const { calculateMaxStreak, calculateFindsPerDay } = useStatistics()
  const [sortBy, setSortBy] = useState<ISortBy>('plates')
  const [dialogOpen, setDialogOpen] = useState(false)

  const toplist = useMemo(() => {
    const myUser = user ? [user] : []
    const userList = [...friendList, ...myUser]

    const sortedList = userList.sort((a, b) => {
      const aPlates = a.numbers || []
      const bPlates = b.numbers || []

      if (sortBy === 'plates') {
        return bPlates.length - aPlates.length
      } else if (sortBy === 'streak') {
        const aStreak = calculateMaxStreak(aPlates)
        const bStreak = calculateMaxStreak(bPlates)
        return bStreak - aStreak
      } else if (sortBy === 'percentage') {
        const aFindsPerDay = calculateFindsPerDay(aPlates)
        const bFindsPerDay = calculateFindsPerDay(bPlates)
        return bFindsPerDay.perday - aFindsPerDay.perday
      }
      return 0
    })
    return sortedList
  }, [friendList, user, sortBy, calculateMaxStreak, calculateFindsPerDay])

  const subHeader = useMemo(() => {
    if (sortBy === 'plates') {
      return 'toplist.number_description'
    } else if (sortBy === 'streak') {
      return 'toplist.streak_description'
    } else if (sortBy === 'percentage') {
      return 'toplist.percentage_description'
    }
    return ''
  }, [sortBy])

  const myPlace = useMemo(() => {
    return toplist.findIndex(friend => friend.slug === user?.slug) + 1
  }, [toplist, user])

  const handleTabChange = (e: React.SyntheticEvent, value: ISortBy) => {
    e.preventDefault()
    setSortBy(value)
    handleClick()
  }

  const handleCloseDialog = () => {
    handleClick()
    setSortBy('plates')
    setDialogOpen(false)
  }

  const isPlatesDisabled = useMemo(() => {
    const myUser = user ? [user] : []
    return [...friendList, ...myUser].every(f => !f.numbers?.length)
  }, [friendList, user])

  const isStreakDisabled = useMemo(() => {
    const myUser = user ? [user] : []
    return [...friendList, ...myUser].every(f => calculateMaxStreak(f.numbers ?? []) < 2)
  }, [friendList, user, calculateMaxStreak])

  const isPercentageDisabled = useMemo(() => {
    const myUser = user ? [user] : []
    return [...friendList, ...myUser].every(f => calculateFindsPerDay(f.numbers ?? []).perday === 0)
  }, [friendList, user, calculateFindsPerDay])

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        disabled={friendList.length === 0 || isPlatesDisabled}
        fullWidth
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          border: `1px solid ${theme.palette.roadsign.contrastText}`,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <EmojiEvents />
        {t('app.toplist')}
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.toplist')} number={myPlace} />

          <DialogContent>
            <Tabs value={sortBy} variant='fullWidth' onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label={<Numbers />} value='plates' disabled={isPlatesDisabled} />
              <Tab label={<KeyboardDoubleArrowRight />} value='streak' disabled={isStreakDisabled} />
              <Tab label={<Percent />} value='percentage' disabled={isPercentageDisabled} />
            </Tabs>

            <Typography variant='h6'>{t(subHeader)}</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              {toplist.map((friend, place) => (
                <User key={friend.name} friend={friend} place={place + 1} />
              ))}
            </Box>

            <Typography sx={{ textAlign: 'center', mt: 2, textWrap: 'pretty' }}>
              {t('toplist.toplist_tagline')}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button variant='outlined' size='large' color='primary' onClick={handleCloseDialog}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default TopListDialog
