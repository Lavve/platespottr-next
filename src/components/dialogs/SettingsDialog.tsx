import { Delete, History, Logout } from '@mui/icons-material'
import {
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
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import type { Language } from '@/types/settings'
import type { IUser } from '@/types/user'
import { setUserLocale } from '@/utils/locale'

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { settings, saveSettings, setTheme } = useSettings()
  const [confirmResetAllDialogOpen, setConfirmResetAllDialogOpen] = useState(false)
  const [confirmDeleteUserDialogOpen, setConfirmDeleteUserDialogOpen] = useState(false)
  const [confirmLogoutUserDialogOpen, setConfirmLogoutUserDialogOpen] = useState(false)

  if (!open || !user) return null

  const handleResetLastPlate = () => {
    const newUser = {
      ...user,
      plates: user?.plates?.length ? user.plates.slice(0, -1) : [],
    } as IUser

    saveUser(newUser)
  }

  const handleChangeLanguage = (language: Language) => {
    saveSettings({ ...settings, language })
    setUserLocale(language as Locale)
  }

  const handleResetAllPlates = () => {
    saveUser({ ...user, plates: [] })
    setConfirmResetAllDialogOpen(false)
  }

  const handleDeleteUser = () => {
    saveUser({ ...user, plates: [] })
    setConfirmDeleteUserDialogOpen(false)
  }

  const handleLogoutUser = () => {
    setConfirmLogoutUserDialogOpen(false)
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
                <Typography>{t('settings.appearance')}</Typography>
                <ButtonGroup variant='outlined' fullWidth>
                  <Button
                    onClick={() => setTheme('light')}
                    variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'light' ? 'primary' : 'secondary'}
                  >
                    {t('settings.light')}
                  </Button>
                  <Button
                    onClick={() => setTheme('dark')}
                    variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'dark' ? 'primary' : 'secondary'}
                  >
                    {t('settings.dark')}
                  </Button>
                  <Button
                    onClick={() => setTheme('system')}
                    variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'system' ? 'primary' : 'secondary'}
                  >
                    {t('settings.auto')}
                  </Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>{t('settings.language')}</Typography>
                <ButtonGroup variant='outlined' fullWidth>
                  <Button
                    variant={settings.language === 'sv' ? 'contained' : 'outlined'}
                    color={settings.language === 'sv' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('sv')}
                  >
                    {t('settings.swedish')}
                  </Button>
                  <Button
                    variant={settings.language === 'en' ? 'contained' : 'outlined'}
                    color={settings.language === 'en' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('en')}
                  >
                    {t('settings.english')}
                  </Button>
                </ButtonGroup>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>{t('settings.resetting')}</Typography>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<History />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={handleResetLastPlate}
              >
                {t('settings.reset_last_plate')}
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<Delete />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => setConfirmResetAllDialogOpen(true)}
              >
                {t('settings.reset_all_data')}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>{t('settings.account')}</Typography>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<Logout />}
                fullWidth
                onClick={() => setConfirmLogoutUserDialogOpen(true)}
              >
                {t('settings.logout')}
              </Button>
              <Button
                variant='outlined'
                color='error'
                startIcon={<Delete />}
                fullWidth
                onClick={() => setConfirmDeleteUserDialogOpen(true)}
              >
                {t('settings.delete_account')}
              </Button>
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
    </>
  )
}

export default SettingsDialog
