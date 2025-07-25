import { LocalFireDepartment } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import { useStatistics } from '@/hooks/useStatistics'
import { useGame } from '@/providers/gameProvider'

const Streak = () => {
  const { game } = useGame()
  const { streak } = useStatistics(game.findings)

  if (!streak) return null

  return (
    <Paper sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 2, flexDirection: 'column', width: '100%' }}>
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center' }}>
        <LocalFireDepartment color='warning' /> Streak: {streak} dagar i rad
      </Typography>
    </Paper>
  )
}

export default Streak
