import { LocalFireDepartment } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { IUserStatsDisplay } from '@/types/user'

const UserStatsDisplay = ({ friend, maxStreak, scale, place }: IUserStatsDisplay) => (
  <Box sx={{ display: 'flex', width: 100, ml: place ? 'auto' : 0 }}>
    <Box sx={{ width: '50%' }}>
      <Typography variant='body1' sx={{ fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center' }}>
        {friend.plates.length}
      </Typography>
    </Box>
    <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
      <LocalFireDepartment color='warning' sx={{ transform: `scale(${scale})`, fontSize: 16 }} />
      <Typography variant='body2'>{maxStreak}</Typography>
    </Box>
  </Box>
)

export default UserStatsDisplay
