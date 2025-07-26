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
import { useState } from 'react'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Roadsign from '@/components/Roadsign'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import type { Language } from '@/types/settings'
import type { IUser } from '@/types/user'

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
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
          <Roadsign text='Inställningar' />
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>Utseende</Typography>
                <ButtonGroup variant='outlined' fullWidth>
                  <Button
                    onClick={() => setTheme('light')}
                    variant={settings.themeChoice === 'light' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'light' ? 'primary' : 'secondary'}
                  >
                    Ljust
                  </Button>
                  <Button
                    onClick={() => setTheme('dark')}
                    variant={settings.themeChoice === 'dark' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'dark' ? 'primary' : 'secondary'}
                  >
                    Mörkt
                  </Button>
                  <Button
                    onClick={() => setTheme('system')}
                    variant={settings.themeChoice === 'system' ? 'contained' : 'outlined'}
                    color={settings.themeChoice === 'system' ? 'primary' : 'secondary'}
                  >
                    System
                  </Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>Språk</Typography>
                <ButtonGroup variant='outlined' fullWidth>
                  <Button
                    variant={settings.language === 'sv' ? 'contained' : 'outlined'}
                    color={settings.language === 'sv' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('sv')}
                  >
                    Svenska
                  </Button>
                  <Button
                    variant={settings.language === 'en' ? 'contained' : 'outlined'}
                    color={settings.language === 'en' ? 'primary' : 'secondary'}
                    onClick={() => handleChangeLanguage('en')}
                  >
                    English
                  </Button>
                </ButtonGroup>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>Återställning</Typography>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<History />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={handleResetLastPlate}
              >
                Återställ senaste nummer
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<Delete />}
                fullWidth
                disabled={!user?.plates?.length}
                onClick={() => setConfirmResetAllDialogOpen(true)}
              >
                Återställ alla nummer
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>Konto</Typography>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<Logout />}
                fullWidth
                onClick={() => setConfirmLogoutUserDialogOpen(true)}
              >
                Logga ut
              </Button>
              <Button
                variant='outlined'
                color='error'
                startIcon={<Delete />}
                fullWidth
                onClick={() => setConfirmDeleteUserDialogOpen(true)}
              >
                Radera konto
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' size='large' onClick={onClose} color='primary'>
            Stäng
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmResetAllDialogOpen}
        title='Återställ alla nummer'
        content='Är du säker på att du vill återställa alla nummer?'
        onClose={() => setConfirmResetAllDialogOpen(false)}
        onConfirm={handleResetAllPlates}
      />

      <ConfirmDialog
        open={confirmLogoutUserDialogOpen}
        title='Logga ut'
        content='Är du säker på att du vill logga ut?'
        onClose={() => setConfirmLogoutUserDialogOpen(false)}
        onConfirm={handleLogoutUser}
      />

      <ConfirmDialog
        open={confirmDeleteUserDialogOpen}
        title='Radera konto'
        content='Är du säker på att du vill radera ditt konto? Detta kan inte ångras.'
        onClose={() => setConfirmDeleteUserDialogOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </>
  )
}

export default SettingsDialog
