import { Check, Close, HelpCenter, Info, Warning } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useSettings } from '@/providers/settingsProvider'
import Roadsign from '../Roadsign'

const RulesDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { settings } = useSettings()
  const [understood, setUnderstood] = useState(false)

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={() => {
        if (understood || !settings.initialRulesDialogOpen) {
          onClose()
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text='Regler' />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpCenter color='success' /> Spelregler
            </Typography>
            <List>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary='Ordningsföljd'
                  secondary='Du måste hitta alla nummer i ordning från 001 till 999. Du kan inte hoppa över nummer eller "spara" ett nummer till senare.'
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary='Verkliga registreringsskyltar'
                  secondary='Numret måste ses på en riktig, svensk registreringsskylt i verkligheten, inte på TV, mobil, affisch eller andra bilder. '
                />
              </ListItem>
              {/* <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary='Typer av fordon'
                  secondary='Personbilar, lastbilar, motorcyklar, bussar, EPA-traktorer, mopeder, fyrhjulingar, taxi, beskickningsfordon, släp, etc.'
                />
              </ListItem> */}
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary='Nummerformat'
                  secondary='Endast nummer utan bokstav i slutet räknas. Exempel: ABC123 är giltigt, men ABC12A är inte giltigt. Personliga registernummer räknas alltså inte.'
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary='Säkerhet i trafiken'
                  secondary='Var alltid försiktig när du letar efter nummer i trafiken. Din säkerhet går före spelet.'
                />
              </ListItem>
              <ListItem></ListItem>
            </List>
            <Typography></Typography>
          </CardContent>
        </Card>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color='info' /> Exempel på nummer
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ color: 'success.main', mr: 1 }} />
                <ListItemText primary='ABC 012' secondary='Giltigt' />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Close sx={{ color: 'error.main', mr: 1 }} />
                <ListItemText primary='EFG 12A' secondary='Ogiltigt' />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ color: 'success.main', mr: 1 }} />
                <ListItemText primary='XYZ 999' secondary='Giltigt' />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Close sx={{ color: 'error.main', mr: 1 }} />
                <ListItemText primary='PLSPTR2' secondary='Ogiltigt' />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color='error' /> Viktiga säkerhetsråd
            </Typography>
            <List>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  1.
                </Typography>
                <ListItemText primary='Kör aldrig bil samtidigt som du letar efter nummer' />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  2.
                </Typography>
                <ListItemText primary='Som passagerare - hjälp föraren att koncentrera sig på körningen' />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  3.
                </Typography>
                <ListItemText primary='Använd säkra platser som parkeringar och busshållplatser' />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  4.
                </Typography>
                <ListItemText primary='Var uppmärksam på din omgivning när du rör dig i trafiken' />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  5.
                </Typography>
                <ListItemText primary='Respektera andra människors egendom och integritet' />
              </ListItem>
            </List>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Kom ihåg: Säkerheten går alltid före spelet. Var ansvarsfull!
            </Typography>
          </CardContent>
        </Card>
        {settings.initialRulesDialogOpen && (
          <>
            <Divider sx={{ my: 2 }} />
            <FormGroup>
              <FormControlLabel
                control={<Checkbox onChange={() => setUnderstood(!understood)} />}
                label='Ja, jag har läst och förstått reglerna'
              />
            </FormGroup>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          size='large'
          onClick={onClose}
          disabled={!understood && settings.initialRulesDialogOpen}
          color='secondary'
        >
          Stäng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesDialog
