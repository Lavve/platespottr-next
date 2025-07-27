import { Box, Paper } from '@mui/material'
import { useMemo } from 'react'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import type { IUserProps } from '@/types/user'
import UserAvatar from './user/UserAvatar'
import UserInfo from './user/UserInfo'
import UserPlaceDisplay from './user/UserPlaceDisplay'
import UserRemoveButton from './user/UserRemoveButton'
import UserRequestActions from './user/UserRequestActions'
import UserStatsDisplay from './user/UserStatsDisplay'

const User = ({ friend, place, onAddFriend, onRemoveFriend }: IUserProps) => {
  const { user } = useUser()
  const { maxStreak } = useStatistics(friend.plates)
  const isSelf = user?.name === friend.name

  const scale = useMemo(() => {
    return Math.min(1.5, 1 + 0.15 * maxStreak)
  }, [maxStreak])

  return (
    <Paper
      key={friend.name}
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
        <UserInfo friend={friend} isSelf={isSelf} place={place} />
      </Box>

      {!friend.requesting && <UserStatsDisplay friend={friend} maxStreak={maxStreak} scale={scale} place={place} />}

      {friend.requesting ? (
        <UserRequestActions friend={friend} onAddFriend={onAddFriend} onRemoveFriend={onRemoveFriend} />
      ) : (
        !place && <UserRemoveButton friend={friend} onRemoveFriend={onRemoveFriend} />
      )}
    </Paper>
  )
}

export default User
