import { Check, Close, Help, HelpCenter, Info, Warning } from '@mui/icons-material'
import {
  Box,
  Button,
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
  Paper,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import Logo from '@/components/Logo'
import Roadsign from '@/components/Roadsign'
import { VIBRATE_ALERT } from '@/constants/app'
import { useSettings } from '@/providers/settingsProvider'
import { vibrate } from '@/utils/vibrate'
import packageJson from '../../../package.json'

const RulesDialog = () => {
  const t = useTranslations()
  const { settings, saveSettings } = useSettings()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [understood, setUnderstood] = useState(false)
  const initialRuleTimer = useRef<NodeJS.Timeout | null>(null)

  const initialRulesDialogOpen = useMemo(() => {
    return settings.initialRulesDialogOpen
  }, [settings.initialRulesDialogOpen])

  const appVersion = useMemo(() => {
    return packageJson.version
  }, [])

  useEffect(() => {
    if (initialRuleTimer.current) {
      clearTimeout(initialRuleTimer.current)
    }

    initialRuleTimer.current = setTimeout(() => {
      const shouldBeOpen = initialRulesDialogOpen ?? false

      if (shouldBeOpen) {
        setDialogOpen(true)
        vibrate(VIBRATE_ALERT)
      }
    }, 500)

    return () => {
      if (initialRuleTimer.current) {
        clearTimeout(initialRuleTimer.current)
      }
    }
  }, [initialRulesDialogOpen])

  const onCloseRulesDialog = () => {
    vibrate()
    saveSettings({ ...settings, initialRulesDialogOpen: false })
    setDialogOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='outlined'
        color='primary'
        size='large'
        fullWidth
        startIcon={<Help />}
        onClick={() => setDialogOpen(true)}
      >
        {t('app.rules')}
      </VibrateButton>

      {dialogOpen && (
        <Dialog
          fullWidth
          maxWidth='sm'
          open={dialogOpen}
          onClose={() => {
            if (understood || !initialRulesDialogOpen) {
              onCloseRulesDialog()
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            <Roadsign text={t('rules.title')} />
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
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
            </Paper>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
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
                  <ListItemText primary='GHJ 12K' secondary={t('rules.examples.invalid')} />
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Check sx={{ color: 'success.main', mr: 1 }} />
                  <ListItemText primary='DEF 999' secondary={t('rules.examples.valid')} />
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Close sx={{ color: 'error.main', mr: 1 }} />
                  <ListItemText primary='PLSPTR2' secondary={t('rules.examples.invalid')} />
                </Grid>
              </Grid>
            </Paper>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
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
              <Typography sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                {t('rules.important_safety_rules.remember_safety')}
              </Typography>
            </Paper>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Logo size={40} />
                <Typography
                  component='h1'
                  variant='h6'
                  sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100, textTransform: 'uppercase' }}
                >
                  latespottr
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Typography variant='body2' sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  v.{appVersion}
                </Typography>
                <Typography variant='body2' sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  &copy; {new Date().getFullYear()}
                </Typography>
              </Box>
            </Paper>
            {initialRulesDialogOpen && (
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
              onClick={onCloseRulesDialog}
              disabled={!understood && initialRulesDialogOpen}
              color='primary'
            >
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default RulesDialog
