import { LocalFireDepartment } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import { useMaxFindingsPerDay } from '@/hooks/useMaxFindingsPerDay'
import { useGame } from '@/providers/gameProvider'

const Streak = () => {
  const { game } = useGame()
  const { maxFindings, date } = useMaxFindingsPerDay(game.findings)

  if (!maxFindings) return null

  return (
    <Paper sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 2, flexDirection: 'column', width: '100%' }}>
      <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center' }}>
        <LocalFireDepartment color='warning' /> Streak: {maxFindings}
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        {date}
      </Typography>
    </Paper>
  )
}

export default Streak
