import { Delete, History, Logout, RestartAltOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
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

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  const { user, saveUser, resetUser } = useUser()
  const { resetFriends } = useFriends()
  const { settings, saveSettings, setTheme, resetSettings } = useSettings()
  const [country, setCountry] = useState<Country>(settings.country)
  const [confirmResetAllDialogOpen, setConfirmResetAllDialogOpen] = useState(false)
  const [confirmResetLastDialogOpen, setConfirmResetLastDialogOpen] = useState(false)
  const [confirmDeleteUserDialogOpen, setConfirmDeleteUserDialogOpen] = useState(false)
  const [confirmLogoutUserDialogOpen, setConfirmLogoutUserDialogOpen] = useState(false)
  const [confirmChangeCountryDialogOpen, setConfirmChangeCountryDialogOpen] = useState(false)
  const [confirmResetAccountDialogOpen, setConfirmResetAccountDialogOpen] = useState(false)

  if (!open || !user) return null

  const handleChangeLanguage = (language: Language) => {
    vibrate()
    saveSettings({ ...settings, language })
    setUserLocale(language as Locale)
  }

  const handleChangeCountry = (country: Country) => {
    vibrate()
    setCountry(country)
    setConfirmChangeCountryDialogOpen(true)
  }

  const handleConfirmChangeCountry = (country: Country) => {
    vibrate()
    saveSettings({ ...settings, country })
    saveUser({ ...user, plates: [] })
    setConfirmChangeCountryDialogOpen(false)
  }

  const handleResetLastPlate = () => {
    vibrate()
    const newUser = {
      ...user,
      plates: user.plates.length ? user.plates.slice(0, -1) : [],
    } as IUser

    saveUser(newUser)
    setConfirmResetLastDialogOpen(false)
  }

  const handleResetAllPlates = () => {
    vibrate()
    saveUser({ ...user, plates: [] })
    setConfirmResetAllDialogOpen(false)
  }

  const handleDeleteUser = () => {
    vibrate()
    saveUser({ ...user, plates: [] })
    setConfirmDeleteUserDialogOpen(false)
    onClose()
  }

  const handleLogoutUser = () => {
    vibrate()
    setConfirmLogoutUserDialogOpen(false)
    onClose()
  }

  const handleResetAccount = () => {
    vibrate()
    resetUser()
    resetFriends()
    resetSettings()
    setConfirmResetAccountDialogOpen(false)
    onClose()
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          <Roadsign text={t('settings.title')} />
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='h6'>{t('settings.title')}</Typography>
                <Typography>{t('settings.appearance')}</Typography>
                <ButtonGroup fullWidth>
                  <Button
                    onClick={() => {
                      vibrate()
                      setTheme('light')
                    }}
                    variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
                    color='primary'
                  >
                    {t('settings.light')}
                  </Button>
                  <Button
                    onClick={() => {
                      vibrate()
                      setTheme('dark')
                    }}
                    variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
                    color='primary'
                  >
                    {t('settings.dark')}
                  </Button>
                  <Button
                    onClick={() => {
                      vibrate()
                      setTheme('system')
                    }}
                    variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
                    color='primary'
                  >
                    {t('settings.auto')}
                  </Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>{t('settings.language')}</Typography>
                <ButtonGroup fullWidth>
                  <Button
                    variant={settings.language === 'sv' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleChangeLanguage('sv')}
                  >
                    {t('settings.swedish')}
                  </Button>
                  <Button
                    variant={settings.language === 'en' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleChangeLanguage('en')}
                  >
                    {t('settings.english')}
                  </Button>
                  <Button
                    variant={settings.language === 'fi' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleChangeLanguage('fi')}
                  >
                    {t('settings.finnish')}
                  </Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>{t('settings.country')}</Typography>
                <ButtonGroup fullWidth>
                  <Button
                    variant={settings.country === 's' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleChangeCountry('s')}
                  >
                    {t('settings.sweden')}
                  </Button>
                  <Button
                    variant={settings.country === 'fi' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleChangeCountry('fi')}
                  >
                    {t('settings.finland')}
                  </Button>
                </ButtonGroup>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h6'>{t('settings.resetting')}</Typography>
              <Button
                variant='outlined'
                color='primary'
                startIcon={<History />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => {
                  vibrate()
                  setConfirmResetLastDialogOpen(true)
                }}
              >
                {t('settings.reset_last_plate')}
              </Button>
              <Button
                variant='outlined'
                color='error'
                startIcon={<Delete />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => {
                  vibrate()
                  setConfirmResetAllDialogOpen(true)
                }}
              >
                {t('settings.reset_all_data')}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h6'>{t('settings.account')}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{user.name.slice(0, 2)}</Avatar>
                <Box sx={{ width: '100%', ml: 2 }}>
                  <Typography variant='h6'>{user.name}</Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}
                  >
                    {user.slug}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant='outlined'
                  color='warning'
                  startIcon={<RestartAltOutlined color='secondary' />}
                  endIcon={<RestartAltOutlined color='secondary' />}
                  fullWidth
                  onClick={() => {
                    vibrate()
                    setConfirmResetAccountDialogOpen(true)
                  }}
                >
                  - Reset test -
                </Button>
                <Button
                  variant='outlined'
                  color='primary'
                  startIcon={<Logout />}
                  fullWidth
                  onClick={() => {
                    vibrate()
                    setConfirmLogoutUserDialogOpen(true)
                  }}
                >
                  {t('settings.logout')}
                </Button>
                {/* <Button
                  variant='outlined'
                  color='error'
                  startIcon={<Delete />}
                  fullWidth
                  onClick={() => setConfirmDeleteUserDialogOpen(true)}
                >
                  {t('settings.delete_account')}
                </Button> */}
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' size='large' onClick={onClose} color='primary'>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmResetLastDialogOpen}
        title={t('confirm.reset_last_plate_title')}
        content={t('confirm.reset_last_plate_content', { number: user.plates.length - 1 })}
        onClose={() => {
          vibrate()
          setConfirmResetLastDialogOpen(false)
        }}
        onConfirm={handleResetLastPlate}
      />

      <ConfirmDialog
        open={confirmResetAllDialogOpen}
        title={t('confirm.reset_all_data_title')}
        content={t('confirm.reset_all_data_content')}
        onClose={() => {
          vibrate()
          setConfirmResetAllDialogOpen(false)
        }}
        onConfirm={handleResetAllPlates}
      />

      <ConfirmDialog
        open={confirmLogoutUserDialogOpen}
        title={t('confirm.logout_title')}
        content={t('confirm.logout_content')}
        onClose={() => {
          vibrate()
          setConfirmLogoutUserDialogOpen(false)
        }}
        onConfirm={handleLogoutUser}
      />

      <ConfirmDialog
        open={confirmDeleteUserDialogOpen}
        title={t('confirm.delete_account_title')}
        content={t('confirm.delete_account_content')}
        onClose={() => {
          vibrate()
          setConfirmDeleteUserDialogOpen(false)
        }}
        onConfirm={handleDeleteUser}
      />

      <ConfirmDialog
        open={confirmChangeCountryDialogOpen}
        title={t('confirm.change_country_title')}
        content={t('confirm.change_country_content')}
        onClose={() => {
          vibrate()
          setConfirmChangeCountryDialogOpen(false)
        }}
        onConfirm={() => handleConfirmChangeCountry(country)}
      />

      <ConfirmDialog
        open={confirmResetAccountDialogOpen}
        title='Nollställa testkontot'
        content='Är du säker på att du vill nollställa testkontot? Detta kommer att återställa allt med test-data.'
        onClose={() => {
          vibrate()
          setConfirmResetAccountDialogOpen(false)
        }}
        onConfirm={handleResetAccount}
      />
    </>
  )
}

export default SettingsDialog
