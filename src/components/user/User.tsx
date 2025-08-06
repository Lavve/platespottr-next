import { Close } from '@mui/icons-material'
import { Box, Paper } from '@mui/material'
import { useMemo } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import UserAvatar from '@/components/user/UserAvatar'
import UserInfo from '@/components/user/UserInfo'
import UserPlaceDisplay from '@/components/user/UserPlaceDisplay'
import UserRequestActions from '@/components/user/UserRequestActions'
import UserStatsDisplay from '@/components/user/UserStatsDisplay'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import type { IUserProps } from '@/types/user'

const User = ({ friend, place, onAddFriend, onRemoveFriend }: IUserProps) => {
  const { user } = useUser()
  const { maxStreak, findsPerDay } = useStatistics(friend.numbers)
  const isSelf = user?.name === friend.name

  const friendAwaiting = useMemo(() => {
    return friend.awaiting
  }, [friend.awaiting])

  const scale = useMemo(() => {
    return Math.min(1.5, 1 + 0.15 * maxStreak)
  }, [maxStreak])

  return (
    <Paper
      sx={{
        px: { xs: 1, md: 2 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: '3px solid',
        borderColor: isSelf ? 'primary.main' : 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '65%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: 40, justifyContent: 'center' }}>
          {place ? <UserPlaceDisplay place={place} /> : <UserAvatar friend={friend} />}
        </Box>
        <UserInfo friend={friend} isSelf={isSelf} />
      </Box>

      {place && (
        <UserStatsDisplay friend={friend} maxStreak={maxStreak} findsPerDay={findsPerDay} scale={scale} place={place} />
      )}

      {friendAwaiting ? (
        <UserRequestActions friend={friend} onAddFriend={onAddFriend} onRemoveFriend={onRemoveFriend} />
      ) : (
        !place && (
          <VibrateButton
            variant='contained'
            color='error'
            size='small'
            sx={{ minWidth: 40, ml: 'auto' }}
            onClick={() => onRemoveFriend?.(friend)}
          >
            <Close />
          </VibrateButton>
        )
      )}
    </Paper>
  )
}

export default User
