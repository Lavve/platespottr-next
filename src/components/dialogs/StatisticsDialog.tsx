import { BarChart, CalendarMonth, LocalFireDepartment, Timeline } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import Roadsign from '@/components/Roadsign'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import { relativeDays } from '@/utils/dates'
import { vibrate } from '@/utils/vibrate'

const StatisticsDialog = () => {
  const t = useTranslations()
  const { user } = useUser()
  const { maxStreak, latestFinding, findingsByWeek } = useStatistics(user?.plates || [])
  const [dialogOpen, setDialogOpen] = useState(false)

  const maxWeek = useMemo(() => {
    if (!findingsByWeek || findingsByWeek.size === 0) return 0
    return Math.max(...Array.from(findingsByWeek.values()))
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
        disabled={user?.plates.length === 0 || !user}
        startIcon={<BarChart />}
        onClick={() => setDialogOpen(true)}
      >
        {t('app.statistics')}
      </VibrateButton>

      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            <Roadsign text={t('statistics.title')} />
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {maxStreak > 1 && (
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 1,
                  p: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartment color='warning' /> {t('statistics.current_streak')}
                </Typography>
                <Typography variant='h6'>{t('statistics.streaks_days_in_a_row', { streak: maxStreak })}</Typography>
              </Paper>
            )}
            {findingsByWeek && user?.plates?.length && user.plates.length > 1 && (
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline color='success' /> {t('statistics.numbers_per_week')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  {findingsByWeek &&
                    Array.from(findingsByWeek.entries())
                      .slice(0, 10)
                      .map(([week, count]) => {
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
                                gap: 1,
                                height: 80,
                                width: '100%',
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: 30,
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
                            <Typography variant='body2'>V{week}</Typography>
                          </Box>
                        )
                      })}
                </Box>
              </Paper>
            )}
            {latestFinding && (
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 1,
                  p: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth color='info' /> {t('statistics.latest_found_number')}
                </Typography>
                <Typography variant='h6'>{relativeDays(new Date(latestFinding))}</Typography>
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
