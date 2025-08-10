import { Delete, History } from '@mui/icons-material'
import { Paper } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import { useRemoveAllNumbers, useRemoveLastNumber } from '@/hooks/useApi'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import ConfirmDialog from '../ConfirmDialog'

const ResetBlock = () => {
  const t = useTranslations()
  const { user } = useUser()
  const { showError } = useSnackbar()
  const removeLastNumberMutation = useRemoveLastNumber()
  const removeAllNumbersMutation = useRemoveAllNumbers()
  const [confirmResetAllDialogOpen, setConfirmResetAllDialogOpen] = useState(false)
  const [confirmResetLastDialogOpen, setConfirmResetLastDialogOpen] = useState(false)

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

  return (
    <>
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
    </>
  )
}

export default ResetBlock
