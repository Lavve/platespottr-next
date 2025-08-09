'use client'

import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import RegPlate from '@/components/RegPlate'
import { useAddNumber } from '@/hooks/useApi'
import { useQueryNavigation } from '@/hooks/useQueryNavigation'
import { useFriends } from '@/providers/friendsProvider'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import { getUserCoordinates } from '@/utils/getUserCoordinates'

const AddNumberDialog = () => {
  const { isAddPlateDialogOpen, clearQuery } = useQueryNavigation()
  const [dialogOpen, setDialogOpen] = useState(isAddPlateDialogOpen)
  const t = useTranslations()
  const { user } = useUser()
  const { friendsAll } = useFriends()
  const addNumberMutation = useAddNumber()
  const { showError } = useSnackbar()
  const { settings } = useSettings()
  const addPlateContent = useMemo(() => {
    const number = ((user?.numbers?.length || 1) + 1).toString().padStart(3, '0')
    const translateStr =
      friendsAll && friendsAll.length > 0 ? 'app.add_plate_description' : 'app.add_plate_description_no_friends'

    return t(translateStr, {
      add: t('common.add'),
      number,
    })
  }, [friendsAll, t, user?.numbers])

  const handleAddPlate = useCallback(async () => {
    clearQuery()
    if (!user?.id) return
    const latlng = await getUserCoordinates(settings.latlang === 'on')

    addNumberMutation.mutate(
      { userId: user.id, latlng: latlng ?? undefined },
      {
        onError: error => {
          console.error(error)
          let errorMsg = t('notifications.add_number_failed', { code: 0 })
          if (error instanceof ApiError) {
            errorMsg = t('notifications.add_number_failed', { code: error.status })
          }
          showError(errorMsg)
        },
      }
    )
    setDialogOpen(false)
  }, [clearQuery, user?.id, addNumberMutation, showError, t, settings.latlang])

  const handleClose = useCallback(() => {
    clearQuery()
    setDialogOpen(false)
  }, [clearQuery])

  useEffect(() => {
    setDialogOpen(isAddPlateDialogOpen)
  }, [isAddPlateDialogOpen])

  return (
    <Dialog open={dialogOpen}>
      <DialogHeader title={t('app.add_plate')} />

      <DialogContent>
        <Typography sx={{ mb: 2 }}>{addPlateContent}</Typography>
        <RegPlate number={(user?.numbers?.length || 0) + 1} />
      </DialogContent>

      <DialogActions>
        <VibrateButton size='large' variant='outlined' color='primary' onClick={handleClose}>
          {t('common.cancel')}
        </VibrateButton>
        <VibrateButton size='large' variant='contained' color='primary' onClick={handleAddPlate} autoFocus>
          {t('common.add')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default AddNumberDialog
