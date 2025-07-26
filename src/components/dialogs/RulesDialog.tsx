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
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Roadsign from '@/components/Roadsign'
import { useSettings } from '@/providers/settingsProvider'
import { vibrate } from '@/utils/vibrate'

const RulesDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  const { settings } = useSettings()
  const [understood, setUnderstood] = useState(false)

  if (!open) return null

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
        <Roadsign text={t('rules.title')} />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpCenter color='success' /> {t('rules.game_rules.title')}
            </Typography>
            <List>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={t('rules.game_rules.order')}
                  secondary={t('rules.game_rules.order_description')}
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={t('rules.game_rules.real_plates')}
                  secondary={t('rules.game_rules.real_plates_description')}
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={t('rules.game_rules.number_format')}
                  secondary={t('rules.game_rules.number_format_description')}
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={t('rules.game_rules.traffic_safety')}
                  secondary={t('rules.game_rules.traffic_safety_description')}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color='info' /> {t('rules.examples.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ color: 'success.main', mr: 1 }} />
                <ListItemText primary='ABC 012' secondary={t('rules.examples.valid')} />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Close sx={{ color: 'error.main', mr: 1 }} />
                <ListItemText primary='EFG 12A' secondary={t('rules.examples.invalid')} />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ color: 'success.main', mr: 1 }} />
                <ListItemText primary='XYZ 999' secondary={t('rules.examples.valid')} />
              </Grid>
              <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Close sx={{ color: 'error.main', mr: 1 }} />
                <ListItemText primary='PLSPTR2' secondary={t('rules.examples.invalid')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color='error' /> {t('rules.important_safety_rules.title')}
            </Typography>
            <List>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  1.
                </Typography>
                <ListItemText primary={t('rules.important_safety_rules.rule_1')} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  2.
                </Typography>
                <ListItemText primary={t('rules.important_safety_rules.rule_2')} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  3.
                </Typography>
                <ListItemText primary={t('rules.important_safety_rules.rule_3')} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  4.
                </Typography>
                <ListItemText primary={t('rules.important_safety_rules.rule_4')} />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  5.
                </Typography>
                <ListItemText primary={t('rules.important_safety_rules.rule_5')} />
              </ListItem>
            </List>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              {t('rules.important_safety_rules.remember_safety')}
            </Typography>
          </CardContent>
        </Card>
        {settings.initialRulesDialogOpen && (
          <>
            <Divider sx={{ my: 2 }} />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      setUnderstood(!understood)
                      vibrate()
                    }}
                  />
                }
                label={t('rules.important_safety_rules.understood')}
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
          color='primary'
        >
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesDialog
