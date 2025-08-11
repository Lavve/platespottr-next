import { Delete, Logout } from '@mui/icons-material'
import { Avatar, Box, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import DeleteAccountDialog from '@/components/dialogs/DeleteAccountDialog'
import QrDialog from '@/components/dialogs/QrDialog'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import { relativeDays } from '@/utils/dates'

const UserBlock = ({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) => {
  const t = useTranslations()
  const { user, logout, resetUser } = useUser()
  const { resetSettings } = useSettings()
  const [confirmLogoutUserDialogOpen, setConfirmLogoutUserDialogOpen] = useState(false)
  const [confirmResetAccountDialogOpen, setConfirmResetAccountDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)

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

  return (
    <>
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
              {user?.name?.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ width: '100%', ml: 2 }}>
              <Typography variant='h6'>{user?.name}</Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}
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

      {/* Delete Account Dialog */}
      <DeleteAccountDialog open={deleteAccountDialogOpen} onClose={() => setDeleteAccountDialogOpen(false)} />
    </>
  )
}

export default UserBlock
