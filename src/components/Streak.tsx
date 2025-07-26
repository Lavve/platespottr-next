import { LocalFireDepartment } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'

const Streak = () => {
  const { user } = useUser()
  const { maxStreak } = useStatistics(user?.plates || [])

  if (!maxStreak || !user) return null

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderRadius: 2,
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center' }}>
        <LocalFireDepartment color='warning' /> Streak {maxStreak} dagar i rad
      </Typography>
    </Paper>
  )
}

export default Streak
