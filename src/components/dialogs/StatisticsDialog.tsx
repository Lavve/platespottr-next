import { CalendarMonth, LocalFireDepartment, Timeline } from '@mui/icons-material'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import Roadsign from '@/components/Roadsign'
import { useStatistics } from '@/hooks/useStatistics'
import { useUser } from '@/providers/userProvider'
import { relativeDays } from '@/utils/dates'

const StatisticsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user } = useUser()
  const { maxStreak, latestFinding, findingsByWeek } = useStatistics(user?.plates || [])
  const maxWeek = Math.max(...Array.from(findingsByWeek?.values() ?? []))

  if (!open) return null

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text='Statistik' />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {maxStreak > 1 && (
          <Card
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
              <LocalFireDepartment color='warning' /> Nuvarande streak:
            </Typography>
            <Typography variant='h5'>{maxStreak} dagar i rad</Typography>
          </Card>
        )}
        {findingsByWeek && (
          <Card sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline color='success' /> Hittade nummer per vecka:
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
          </Card>
        )}
        {latestFinding && (
          <Card
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
              <CalendarMonth color='info' /> Senaste hittade nummer:
            </Typography>
            <Typography variant='h5'>{relativeDays(new Date(latestFinding))}</Typography>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' size='large' onClick={onClose} color='primary'>
          Stäng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatisticsDialog
