import { Delete, History, Logout } from '@mui/icons-material'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useGame } from '@/providers/gameProvider'
import Roadsign from '../Roadsign'
import { ThemeToggle } from '../ThemeToggle'

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { game, saveGame } = useGame()

  const handleResetLastPlate = () => {
    const newGame = {
      ...game,
      currentPlate: game.currentPlate === 1 ? 1 : game.currentPlate - 1,
      findings: game.findings?.filter(finding => finding.plate !== game.currentPlate),
    }

    saveGame(newGame)
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text='Inställningar' />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>Utseende</Typography>
            <ThemeToggle />
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>Återställning</Typography>
            <Button
              variant='contained'
              color='warning'
              startIcon={<History />}
              fullWidth
              onClick={handleResetLastPlate}
            >
              Återställ senaste nummer
            </Button>
            <Button
              variant='outlined'
              color='error'
              startIcon={<Delete />}
              fullWidth
              onClick={() => {
                saveGame({ ...game, currentPlate: 1 })
              }}
            >
              Återställ alla nummer
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>Konto</Typography>
            <Button variant='contained' color='error' startIcon={<Logout />} fullWidth>
              Logga ut
            </Button>
            <Button variant='outlined' color='error' startIcon={<Delete />} fullWidth>
              Radera konto
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Stäng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
