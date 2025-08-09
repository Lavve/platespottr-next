'use client'

import { LocalFireDepartment } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { IUserStatsDisplay } from '@/types/user'

const UserStatsDisplay = ({ friend, maxStreak, findsPerDay, scale }: IUserStatsDisplay) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
      <Typography>{friend.numbers?.length || 0}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        <LocalFireDepartment color='warning' sx={{ transform: `scale(${scale})`, fontSize: 16 }} />
        <Typography>{maxStreak}</Typography>
      </Box>
      <Typography>{findsPerDay.perday}/dag</Typography>
    </Box>
  )
}

export default UserStatsDisplay
