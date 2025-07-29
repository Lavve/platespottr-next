import { AccountCircle, Delete, Explore, History, Logout, RestartAltOutlined, TuneOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Roadsign from '@/components/Roadsign'
import type { Locale } from '@/i18n/config'
import { useFriends } from '@/providers/friendsProvider'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import type { Country, Language } from '@/types/settings'
import type { IUser } from '@/types/user'
import { setUserLocale } from '@/utils/locale'
import { vibrate } from '@/utils/vibrate'
import QrDialog from './QrDialog'

const SettingsDialog = () => {
  const t = useTranslations()
  const { user, saveUser, resetUser } = useUser()
  const { resetFriends } = useFriends()
  const { settings, saveSettings, setTheme, resetSettings } = useSettings()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [country, setCountry] = useState<Country>(settings.country)
  const [confirmResetAllDialogOpen, setConfirmResetAllDialogOpen] = useState(false)
  const [confirmResetLastDialogOpen, setConfirmResetLastDialogOpen] = useState(false)
  const [confirmDeleteUserDialogOpen, setConfirmDeleteUserDialogOpen] = useState(false)
  const [confirmLogoutUserDialogOpen, setConfirmLogoutUserDialogOpen] = useState(false)
  const [confirmChangeCountryDialogOpen, setConfirmChangeCountryDialogOpen] = useState(false)
  const [confirmResetAccountDialogOpen, setConfirmResetAccountDialogOpen] = useState(false)

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
    saveUser({ ...user, plates: [] } as IUser)
    setConfirmChangeCountryDialogOpen(false)
  }

  const handleResetLastPlate = () => {
    const newUser = {
      ...user,
      plates: user?.plates?.length ? user.plates.slice(0, -1) : [],
    } as IUser

    saveUser(newUser)
    setConfirmResetLastDialogOpen(false)
  }

  const handleResetAllPlates = () => {
    saveUser({ ...user, plates: [] } as IUser)
    setConfirmResetAllDialogOpen(false)
  }

  const handleDeleteUser = () => {
    saveUser({ ...user, plates: [] } as IUser)
    setConfirmDeleteUserDialogOpen(false)
    setDialogOpen(false)
  }

  const handleLogoutUser = () => {
    setConfirmLogoutUserDialogOpen(false)
    setDialogOpen(false)
  }

  const handleResetAccount = () => {
    resetUser()
    resetFriends()
    resetSettings()
    setConfirmResetAccountDialogOpen(false)
    setDialogOpen(false)
  }

  const handleCloseDialog = () => {
    vibrate()
    setDialogOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='outlined'
        color='primary'
        size='large'
        fullWidth
        disabled={!user}
        startIcon={<Explore />}
        onClick={() => setDialogOpen(true)}
      >
        {t('app.settings')}
      </VibrateButton>
      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
            <Roadsign text={t('app.settings')} />
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneOutlined /> {t('settings.settings')}
                </Typography>
                <Typography>{t('settings.appearance')}</Typography>
                <ButtonGroup fullWidth>
                  <VibrateButton
                    onClick={() => setTheme('light')}
                    variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'light' ? 'primary' : 'secondary'}
                  >
                    {t('settings.light')}
                  </VibrateButton>
                  <VibrateButton
                    onClick={() => setTheme('dark')}
                    variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'dark' ? 'primary' : 'secondary'}
                  >
                    {t('settings.dark')}
                  </VibrateButton>
                  <VibrateButton
                    onClick={() => setTheme('system')}
                    variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'system' ? 'primary' : 'secondary'}
                  >
                    {t('settings.auto')}
                  </VibrateButton>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>{t('settings.language')}</Typography>
                <ButtonGroup fullWidth>
                  <VibrateButton
                    variant={settings.language === 'sv' ? 'contained' : 'outlined'}
                    color={settings.language === 'sv' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('sv')}
                  >
                    {t('settings.swedish')}
                  </VibrateButton>
                  <VibrateButton
                    variant={settings.language === 'en' ? 'contained' : 'outlined'}
                    color={settings.language === 'en' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('en')}
                  >
                    {t('settings.english')}
                  </VibrateButton>
                  <VibrateButton
                    variant={settings.language === 'fi' ? 'contained' : 'outlined'}
                    color={settings.language === 'fi' ? 'primary' : 'secondary'}
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
                    onClick={() => handleChangeCountry('s')}
                  >
                    {t('settings.sweden')}
                  </VibrateButton>
                  <VibrateButton
                    variant={settings.country === 'fi' ? 'contained' : 'outlined'}
                    color={settings.country === 'fi' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeCountry('fi')}
                  >
                    {t('settings.finland')}
                  </VibrateButton>
                </ButtonGroup>
              </Box>
            </Paper>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
              <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History /> {t('settings.resetting')}
              </Typography>
              <VibrateButton
                variant='contained'
                color='primary'
                startIcon={<History />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => setConfirmResetLastDialogOpen(true)}
              >
                {t('settings.reset_last_plate')}
              </VibrateButton>
              <VibrateButton
                variant='outlined'
                color='error'
                startIcon={<Delete />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => setConfirmResetAllDialogOpen(true)}
              >
                {t('settings.reset_all_numbers')}
              </VibrateButton>
            </Paper>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
              <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountCircle /> {t('settings.account')}
              </Typography>

              {/* User info */}
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
                  <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center' }}>
                    {user?.slug}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px' }}>
                  <QrDialog showText={false} />
                </Box>
              </Box>

              {/* QR code */}
              {/* <QrDialog /> */}

              {/* Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <VibrateButton
                  variant='outlined'
                  color='primary'
                  startIcon={<Logout />}
                  disabled
                  fullWidth
                  onClick={() => setConfirmLogoutUserDialogOpen(true)}
                  sx={{ textDecoration: 'line-through' }}
                >
                  {t('settings.logout')}
                </VibrateButton>
                <VibrateButton
                  variant='outlined'
                  color='error'
                  startIcon={<Delete />}
                  disabled
                  fullWidth
                  onClick={() => setConfirmDeleteUserDialogOpen(true)}
                  sx={{ textDecoration: 'line-through' }}
                >
                  {t('settings.delete_account')}
                </VibrateButton>
                <VibrateButton
                  variant='outlined'
                  color='warning'
                  startIcon={<RestartAltOutlined color='secondary' />}
                  endIcon={<RestartAltOutlined color='secondary' />}
                  fullWidth
                  onClick={() => setConfirmResetAccountDialogOpen(true)}
                >
                  - Reset test -
                </VibrateButton>
              </Box>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' size='large' onClick={handleCloseDialog} color='primary'>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ConfirmDialog
        open={confirmResetLastDialogOpen}
        title={t('confirm.reset_last_plate_title')}
        content={t('confirm.reset_last_plate_content', { number: user?.plates?.length ? user.plates.length - 1 : 0 })}
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
        open={confirmLogoutUserDialogOpen}
        title={t('confirm.logout_title')}
        content={t('confirm.logout_content')}
        onClose={() => setConfirmLogoutUserDialogOpen(false)}
        onConfirm={handleLogoutUser}
      />

      <ConfirmDialog
        open={confirmDeleteUserDialogOpen}
        title={t('confirm.delete_account_title')}
        content={t('confirm.delete_account_content')}
        onClose={() => setConfirmDeleteUserDialogOpen(false)}
        onConfirm={handleDeleteUser}
      />

      <ConfirmDialog
        open={confirmChangeCountryDialogOpen}
        title={t('confirm.change_country_title')}
        content={t('confirm.change_country_content')}
        onClose={() => setConfirmChangeCountryDialogOpen(false)}
        onConfirm={() => handleConfirmChangeCountry(country)}
      />

      <ConfirmDialog
        open={confirmResetAccountDialogOpen}
        title='Nollställa testkontot'
        content='Är du säker på att du vill nollställa testkontot? Detta kommer att återställa allt med test-data.'
        onClose={() => setConfirmResetAccountDialogOpen(false)}
        onConfirm={handleResetAccount}
      />
    </>
  )
}

export default SettingsDialog
