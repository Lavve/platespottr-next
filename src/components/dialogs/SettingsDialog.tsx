import { Delete, Explore, History, Logout } from '@mui/icons-material'
import {
  Avatar,
  Box,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useSnackbar } from '@/components/common/SnackbarProvider'
import VibrateButton from '@/components/common/VibrateButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import DeleteAccountDialog from '@/components/dialogs/DeleteAccountDialog'
import DialogHeader from '@/components/dialogs/DialogHeader'
import QrDialog from '@/components/dialogs/QrDialog'
import { useRemoveAllNumbers, useRemoveLastNumber } from '@/hooks/useApi'
import { useVibration } from '@/hooks/useVibration'
import type { Locale } from '@/i18n/config'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import type { ISettingsTabs } from '@/types/common'
import type { Country, Language } from '@/types/settings'
import type { IUser } from '@/types/user'
import { relativeDays } from '@/utils/dates'
import { setUserLocale } from '@/utils/locale'

const SettingsDialog = () => {
  const t = useTranslations()
  const { user, saveUser, resetUser, logout, isAuthenticated } = useUser()
  const { settings, saveSettings, setTheme, resetSettings } = useSettings()
  const { showError } = useSnackbar()
  const { handleClick } = useVibration()
  const removeLastNumberMutation = useRemoveLastNumber()
  const removeAllNumbersMutation = useRemoveAllNumbers()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [country, setCountry] = useState<Country>(settings.country)
  const [confirmResetAllDialogOpen, setConfirmResetAllDialogOpen] = useState(false)
  const [confirmResetLastDialogOpen, setConfirmResetLastDialogOpen] = useState(false)
  const [confirmLogoutUserDialogOpen, setConfirmLogoutUserDialogOpen] = useState(false)
  const [confirmChangeCountryDialogOpen, setConfirmChangeCountryDialogOpen] = useState(false)
  const [confirmResetAccountDialogOpen, setConfirmResetAccountDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<ISettingsTabs>('user')

  const handleChangeLanguage = (language: Language) => {
    saveSettings({ ...settings, language })
    setUserLocale(language as Locale)
  }

  const handleChangeCountry = (country: Country) => {
    setCountry(country)
    setConfirmChangeCountryDialogOpen(true)
  }

  const handleConfirmChangeCountry = (country: Country) => {
    saveSettings({ ...settings, country })
    saveUser({ ...user, numbers: [] } as IUser)
    setConfirmChangeCountryDialogOpen(false)
  }

  const handleResetLastPlate = () => {
    if (user?.id) {
      removeLastNumberMutation.mutate(user.id, {
        onError: error => {
          console.error(error)
          let errorMsg = t('notifications.remove_number_failed', { code: 0 })
          if (error instanceof ApiError) {
            errorMsg = t('notifications.remove_number_failed', { code: error.status })
          }
          showError(errorMsg)
        },
      })
    }
    setConfirmResetLastDialogOpen(false)
  }

  const handleResetAllPlates = () => {
    if (user?.id) {
      removeAllNumbersMutation.mutate(user.id, {
        onError: error => {
          console.error(error)
          let errorMsg = t('notifications.remove_number_failed', { code: 0 })
          if (error instanceof ApiError) {
            errorMsg = t('notifications.remove_number_failed', { code: error.status })
          }
          showError(errorMsg)
        },
      })
    }
    setConfirmResetAllDialogOpen(false)
  }

  const handleLogoutUser = () => {
    logout()
    setConfirmLogoutUserDialogOpen(false)
    setDialogOpen(false)
  }

  const handleResetAccount = () => {
    resetUser()
    resetSettings()
    setConfirmResetAccountDialogOpen(false)
    setDialogOpen(false)
  }

  const handleCloseDialog = () => {
    handleClick()
    setDialogOpen(false)
    setSettingsTab('user')
  }

  // Don't render settings button if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <VibrateButton
        variant='outlined'
        color='primary'
        size='large'
        fullWidth
        disabled={!user}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, px: 1 }}
        startIcon={<Explore />}
        onClick={() => setDialogOpen(true)}
      >
        {t('app.settings')}
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('app.settings')} />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Tabs value={settingsTab} variant='fullWidth' onChange={(_, value) => setSettingsTab(value)} sx={{ mb: 2 }}>
              <Tab label={t('settings.user_management')} value='user' />
              <Tab label={t('settings.settings')} value='settings' />
              <Tab label={t('settings.resetting')} value='reset' />
            </Tabs>

            {settingsTab === 'user' && (
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      bgcolor: 'background.default',
                      borderRadius: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {user?.name?.slice(0, 2)}
                    </Avatar>
                    <Box sx={{ width: '100%', ml: 2 }}>
                      <Typography variant='h6'>{user?.name}</Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
                      >
                        {user?.slug.toUpperCase()}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center' }}>
                        {t('settings.member_since', { date: relativeDays(new Date(user?.member_since || ''), t) })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px' }}>
                      <QrDialog showText={false} />
                    </Box>
                  </Box>

                  {/* Logout Button */}
                  <VibrateButton
                    variant='outlined'
                    color='warning'
                    size='large'
                    fullWidth
                    startIcon={<Logout />}
                    onClick={() => setConfirmLogoutUserDialogOpen(true)}
                  >
                    {t('auth.logout')}
                  </VibrateButton>

                  {/* Reset Account Button */}
                  {/* <VibrateButton
                    variant='outlined'
                    color='error'
                    size='large'
                    fullWidth
                    startIcon={<RestartAltOutlined />}
                    onClick={() => setConfirmResetAccountDialogOpen(true)}
                  >
                    {t('settings.reset_account')}
                  </VibrateButton> */}

                  {/* Delete Account Button */}
                  <VibrateButton
                    variant='outlined'
                    color='error'
                    size='large'
                    fullWidth
                    startIcon={<Delete />}
                    onClick={() => setDeleteAccountDialogOpen(true)}
                  >
                    {t('settings.delete_account')}
                  </VibrateButton>
                </Box>
              </Paper>
            )}

            {settingsTab === 'settings' && (
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{t('settings.appearance')}</Typography>
                  <ButtonGroup fullWidth>
                    <VibrateButton
                      onClick={() => setTheme('light')}
                      size='large'
                      variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
                      color={settings.themeChoice === 'light' ? 'primary' : 'secondary'}
                    >
                      {t('settings.light')}
                    </VibrateButton>
                    <VibrateButton
                      onClick={() => setTheme('dark')}
                      size='large'
                      variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
                      color={settings.themeChoice === 'dark' ? 'primary' : 'secondary'}
                    >
                      {t('settings.dark')}
                    </VibrateButton>
                    <VibrateButton
                      onClick={() => setTheme('system')}
                      size='large'
                      variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
                      color={settings.themeChoice === 'system' ? 'primary' : 'secondary'}
                    >
                      {t('settings.auto')}
                    </VibrateButton>
                  </ButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{t('settings.vibrate')}</Typography>
                  <ButtonGroup fullWidth>
                    <VibrateButton
                      variant={settings.vibrate ? 'contained' : 'outlined'}
                      color={settings.vibrate ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => saveSettings({ ...settings, vibrate: 'on' })}
                    >
                      {t('common.on')}
                    </VibrateButton>
                    <VibrateButton
                      variant={!settings.vibrate ? 'contained' : 'outlined'}
                      color={!settings.vibrate ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => saveSettings({ ...settings, vibrate: 'off' })}
                    >
                      {t('common.off')}
                    </VibrateButton>
                    <VibrateButton
                      variant={settings.vibrate === 'max' ? 'contained' : 'outlined'}
                      color={settings.vibrate === 'max' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => saveSettings({ ...settings, vibrate: 'max' })}
                    >
                      {t('common.max')}
                    </VibrateButton>
                  </ButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{t('settings.language')}</Typography>
                  <ButtonGroup fullWidth>
                    <VibrateButton
                      variant={settings.language === 'sv' ? 'contained' : 'outlined'}
                      color={settings.language === 'sv' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => handleChangeLanguage('sv')}
                    >
                      {t('settings.swedish')}
                    </VibrateButton>
                    <VibrateButton
                      variant={settings.language === 'en' ? 'contained' : 'outlined'}
                      color={settings.language === 'en' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => handleChangeLanguage('en')}
                    >
                      {t('settings.english')}
                    </VibrateButton>
                    <VibrateButton
                      variant={settings.language === 'fi' ? 'contained' : 'outlined'}
                      color={settings.language === 'fi' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => handleChangeLanguage('fi')}
                    >
                      {t('settings.finnish')}
                    </VibrateButton>
                  </ButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{t('settings.country')}</Typography>
                  <ButtonGroup fullWidth>
                    <VibrateButton
                      variant={settings.country === 's' ? 'contained' : 'outlined'}
                      color={settings.country === 's' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => handleChangeCountry('s')}
                    >
                      {t('settings.sweden')}
                    </VibrateButton>
                    <VibrateButton
                      variant={settings.country === 'fi' ? 'contained' : 'outlined'}
                      color={settings.country === 'fi' ? 'primary' : 'secondary'}
                      size='large'
                      onClick={() => handleChangeCountry('fi')}
                    >
                      {t('settings.finland')}
                    </VibrateButton>
                  </ButtonGroup>
                </Box>
              </Paper>
            )}

            {settingsTab === 'reset' && (
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <VibrateButton
                  variant='contained'
                  color='primary'
                  size='large'
                  startIcon={<History />}
                  fullWidth
                  disabled={!user?.numbers?.length}
                  onClick={() => setConfirmResetLastDialogOpen(true)}
                >
                  {t('settings.reset_last_plate')}
                </VibrateButton>
                <VibrateButton
                  variant='outlined'
                  color='error'
                  size='large'
                  startIcon={<Delete />}
                  fullWidth
                  disabled={!user?.numbers?.length}
                  onClick={() => setConfirmResetAllDialogOpen(true)}
                >
                  {t('settings.reset_all_numbers')}
                </VibrateButton>
              </Paper>
            )}
          </DialogContent>

          <DialogActions>
            <VibrateButton variant='outlined' color='primary' size='large' onClick={handleCloseDialog}>
              {t('common.close')}
            </VibrateButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmLogoutUserDialogOpen}
        title={t('confirm.logout_title')}
        content={t('confirm.logout_content')}
        onConfirm={handleLogoutUser}
        onClose={() => setConfirmLogoutUserDialogOpen(false)}
      />

      <ConfirmDialog
        open={confirmResetAccountDialogOpen}
        title={t('settings.reset_account_title')}
        content={t('settings.reset_account_content')}
        onConfirm={handleResetAccount}
        onClose={() => setConfirmResetAccountDialogOpen(false)}
      />

      <ConfirmDialog
        open={confirmResetLastDialogOpen}
        title={t('confirm.reset_last_plate_title')}
        content={t('confirm.reset_last_plate_content', { number: user?.numbers?.length ? user.numbers.length - 1 : 0 })}
        onClose={() => setConfirmResetLastDialogOpen(false)}
        onConfirm={handleResetLastPlate}
      />

      <ConfirmDialog
        open={confirmResetAllDialogOpen}
        title={t('confirm.reset_all_data_title')}
        content={t('confirm.reset_all_data_content')}
        onClose={() => setConfirmResetAllDialogOpen(false)}
        onConfirm={handleResetAllPlates}
      />

      <ConfirmDialog
        open={confirmChangeCountryDialogOpen}
        title={t('confirm.change_country_title')}
        content={t('confirm.change_country_content')}
        onClose={() => setConfirmChangeCountryDialogOpen(false)}
        onConfirm={() => handleConfirmChangeCountry(country)}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog open={deleteAccountDialogOpen} onClose={() => setDeleteAccountDialogOpen(false)} />
    </>
  )
}

export default SettingsDialog
