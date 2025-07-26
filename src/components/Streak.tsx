import { LocalFireDepartment } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'

const Streak = () => {
  const t = useTranslations()
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
      elevation={8}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center' }}>
        <LocalFireDepartment color='warning' fontSize='large' />
        <Typography variant='h5'>{t('statistics.streaks_days_in_a_row', { streak: maxStreak })}</Typography>
      </Box>
    </Paper>
  )
}

export default Streak
