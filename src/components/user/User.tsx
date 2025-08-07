'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useMemo } from 'react'
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

  const scale = useMemo(() => {
    return Math.min(1.5, 1 + 0.15 * maxStreak)
  }, [maxStreak])

  return (
    <Paper
      sx={{
        px: { xs: 1, sm: 2 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        border: '3px solid',
        borderColor: isSelf ? 'primary.main' : 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'row' },
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {place ? (
            <Box sx={{ width: 40 }}>
              <UserPlaceDisplay place={place} />
            </Box>
          ) : (
            <UserAvatar friend={friend} />
          )}
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column' }, alignItems: 'flex-start', gap: 0.5 }}
        >
          <Typography variant='h6'>{friend.name}</Typography>
          <UserInfo friend={friend} place={place} />
        </Box>
      </Box>

      {place && (
        <UserStatsDisplay friend={friend} maxStreak={maxStreak} findsPerDay={findsPerDay} scale={scale} place={place} />
      )}

      {!place && <UserRequestActions friend={friend} onAddFriend={onAddFriend} onRemoveFriend={onRemoveFriend} />}
    </Paper>
  )
}

export default User
