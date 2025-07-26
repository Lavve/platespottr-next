import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import Roadsign from '@/components/Roadsign'
import User from '@/components/User'
import { useStatistics } from '@/hooks/useStatistics'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'
import { getDaysBetween } from '@/utils/dates'

const TopListDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [sortBy, setSortBy] = useState<'plates' | 'streak' | 'percentage'>('plates')
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

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text='Topplista' />
      </DialogTitle>
      <DialogContent>
        <ButtonGroup fullWidth variant='outlined' sx={{ mb: 2 }}>
          <Button
            variant={sortBy === 'plates' ? 'contained' : 'outlined'}
            color={sortBy === 'plates' ? 'primary' : 'secondary'}
            onClick={() => setSortBy('plates')}
          >
            Nummer
          </Button>
          <Button
            variant={sortBy === 'streak' ? 'contained' : 'outlined'}
            color={sortBy === 'streak' ? 'primary' : 'secondary'}
            onClick={() => setSortBy('streak')}
          >
            Streak
          </Button>
          {/* <Button
            variant={sortBy === 'percentage' ? 'contained' : 'outlined'}
            color={sortBy === 'percentage' ? 'primary' : 'secondary'}
            onClick={() => setSortBy('percentage')}
          >
            Procent
          </Button> */}
        </ButtonGroup>
        <Typography variant='h6' sx={{ textAlign: 'center' }}>
          {sortBy === 'plates'
            ? 'Totalt antal hittade nummer'
            : sortBy === 'streak'
              ? 'Flest streaks'
              : 'Nummer per dag'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {toplist.map((friend, place) => (
            <User key={friend.name} friend={friend} place={place + 1} />
          ))}
        </Box>
        <Typography variant='body1' sx={{ textAlign: 'center', mt: 2, textWrap: 'pretty' }}>
          Lyckas du komma i topp innan du kommer till mål?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={onClose}>
          Stäng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TopListDialog
