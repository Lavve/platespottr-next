import { LocalFireDepartment } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'

const Streak = () => {
  const t = useTranslations()
  const { user } = useUser()
  const { maxStreak } = useStatistics(user?.plates || [])

  const scale = useMemo(() => {
    return Math.min(1.75, 1 + 0.15 * maxStreak)
  }, [maxStreak])

  if (maxStreak < 2 || !user) return null

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
      }}
    >
      <LocalFireDepartment color='warning' sx={{ transform: `scale(${scale})` }} />
      <Typography variant='h5'>{t('statistics.streaks_days_in_a_row', { streak: maxStreak })}</Typography>
    </Paper>
  )
}

export default Streak
