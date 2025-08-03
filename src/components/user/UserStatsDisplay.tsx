import { LocalFireDepartment } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { IUserStatsDisplay } from '@/types/user'

const UserStatsDisplay = ({ friend, maxStreak, findsPerDay, scale }: IUserStatsDisplay) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant='body1'>{friend.numbers?.length || 0}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        <LocalFireDepartment color='warning' sx={{ transform: `scale(${scale})`, fontSize: 16 }} />
        <Typography variant='body1'>{maxStreak}</Typography>
      </Box>
      <Typography variant='body1'>{findsPerDay.perday}/dag</Typography>
    </Box>
  )
}

export default UserStatsDisplay
