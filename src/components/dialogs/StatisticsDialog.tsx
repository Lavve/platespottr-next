import { AccountBalanceWallet, CalendarMonth, LocalFireDepartment, Percent, Timeline } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import StatsBlock from '@/components/common/StatsBlock'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import theme from '@/style/theme'
import { relativeDays } from '@/utils/dates'
import { vibrate } from '@/utils/vibrate'

const StatisticsDialog = () => {
  const t = useTranslations()
  const { user } = useUser()
  const { maxStreak, maxWeek, latestFinding, findingsByWeek, findsPerDay } = useStatistics(user?.numbers || [])
  const [dialogOpen, setDialogOpen] = useState(false)

  const sortedFindingsByWeek = useMemo(() => {
    const sorted = Array.from(findingsByWeek.entries()).sort((a, b) => a[0] - b[0])

    return sorted.slice(sorted.length - 10, sorted.length)
  }, [findingsByWeek])

  const handleCloseDialog = () => {
    vibrate()
    setDialogOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        disabled={user?.numbers?.length === 0 || !user}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          border: `2px solid ${theme.palette.roadsign.contrastText}`,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AccountBalanceWallet />
        {t('app.statistics')}
      </VibrateButton>

      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.statistics')} number={user?.numbers?.length} />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Latest found number */}
            {latestFinding && (
              <StatsBlock
                title={t('statistics.latest_found_number')}
                icon={<CalendarMonth sx={{ color: 'primary.light' }} />}
              >
                {relativeDays(new Date(latestFinding))}
              </StatsBlock>
            )}

            {/* Current streak */}
            <StatsBlock
              title={t('statistics.current_streak')}
              icon={<LocalFireDepartment sx={{ color: 'warning.light' }} />}
            >
              {maxStreak > 1 ? t('statistics.streaks_days_in_a_row', { streak: maxStreak }) : '0'}
            </StatsBlock>

            {/* Finds per day */}
            {findsPerDay.days > 0 && findsPerDay.perday > 0 && (
              <StatsBlock title={t('statistics.finds_per_day')} icon={<Percent sx={{ color: 'accent.light' }} />}>
                {findsPerDay.perday}/dag
              </StatsBlock>
            )}

            {/* Numbers per week */}
            {sortedFindingsByWeek.length > 1 && user?.numbers?.length && user.numbers.length > 1 && (
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline sx={{ color: 'success.light' }} /> {t('statistics.numbers_per_week')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                  {sortedFindingsByWeek.map(([week, count]) => {
                    return (
                      <Box
                        key={week}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0,
                          flexGrow: 1,
                          flexBasis: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            height: 80,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: (count / maxWeek) * 70,
                              backgroundColor: 'primary.main',
                              borderRadius: 1,
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          />
                        </Box>
                        <Typography variant='body1' sx={{ fontWeight: 700, pt: 1 }}>
                          {count}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          V{week}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Paper>
            )}
          </DialogContent>

          <DialogActions>
            <Button variant='contained' size='large' onClick={handleCloseDialog} color='primary'>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default StatisticsDialog
