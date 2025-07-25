import { CalendarMonth, LocalFireDepartment, Timeline } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import Roadsign from '@/components/Roadsign'
import { useStatistics } from '@/hooks/useStatistics'
import { useGame } from '@/providers/gameProvider'

const StatisticsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { game } = useGame()
  const { maxFindings, latestFinding, findingsByWeek } = useStatistics(game.findings)

  const maxWeek = Math.max(...Array.from(findingsByWeek?.values() ?? []))

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text='Statistik' />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {maxFindings && (
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
            <Typography variant='h5'>{maxFindings} dagar i rad</Typography>
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
                          gap: 1,
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
                              backgroundColor: 'secondary.main',
                              borderRadius: 1,
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          />
                        </Box>
                        <Typography variant='body1'>{count}</Typography>
                        <Typography variant='body1'>V{week}</Typography>
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
            <Typography variant='h5'>{latestFinding}</Typography>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' size='large' onClick={onClose} color='secondary'>
          Stäng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatisticsDialog
