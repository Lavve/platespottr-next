import { EmojiEvents } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import Roadsign from '@/components/Roadsign'
import User from '@/components/User'
import { useStatistics } from '@/hooks/useStatistics'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'
import { getDaysBetween } from '@/utils/dates'
import { vibrate } from '@/utils/vibrate'

const TopListDialog = () => {
  const t = useTranslations()
  const [sortBy, setSortBy] = useState<'plates' | 'streak' | 'percentage'>('plates')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { friendList } = useFriends()
  const { calculateMaxStreak } = useStatistics()
  const { user } = useUser()

  const toplist = useMemo(() => {
    const myUser = user ? [user] : []
    const userList = [...friendList, ...myUser]

    const sortedList = userList.sort((a, b) => {
      const aPlates = a.plates
      const bPlates = b.plates

      if (sortBy === 'plates') {
        return bPlates.length - aPlates.length
      } else if (sortBy === 'streak') {
        const aStreak = calculateMaxStreak(aPlates)
        const bStreak = calculateMaxStreak(bPlates)
        return bStreak - aStreak
      } else if (sortBy === 'percentage') {
        const aPercentage = (aPlates.length / getDaysBetween(new Date(aPlates[0]))) * 100
        const bPercentage = (bPlates.length / getDaysBetween(new Date(bPlates[0]))) * 100
        return bPercentage - aPercentage
      }
      return 0
    })
    return sortedList
  }, [friendList, user, sortBy, calculateMaxStreak])

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        size='large'
        disabled={friendList.length === 0}
        fullWidth
        startIcon={<EmojiEvents />}
        onClick={() => {
          vibrate()
          setDialogOpen(true)
        }}
      >
        {t('app.toplist')}
      </Button>
      <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          <Roadsign text={t('toplist.title')} />
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={sortBy}
            variant='fullWidth'
            onChange={(_, value) => {
              setSortBy(value)
              vibrate()
            }}
            sx={{ mb: 2 }}
          >
            <Tab label={t('toplist.number')} value='plates' />
            <Tab label={t('toplist.streak')} value='streak' />
            {/* <Tab label='Procent' value='percentage' /> */}
          </Tabs>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>
            {sortBy === 'plates'
              ? t('toplist.number_description')
              : sortBy === 'streak'
                ? t('toplist.streak_description')
                : t('toplist.percentage_description')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            {toplist.map((friend, place) => (
              <User key={friend.name} friend={friend} place={place + 1} />
            ))}
          </Box>
          <Typography variant='body1' sx={{ textAlign: 'center', mt: 2, textWrap: 'pretty' }}>
            {t('toplist.toplist_tagline')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={() => setDialogOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TopListDialog
