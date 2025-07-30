import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import RegPlate from '@/components/RegPlate'
import { useHashNavigation } from '@/hooks/useHashNavigation'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'
import DialogHeader from './DialogHeader'

const AddNumberDialog = () => {
  const { isAddPlateDialogOpen, clearHash } = useHashNavigation()
  const [dialogOpen, setDialogOpen] = useState(isAddPlateDialogOpen)
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { friendsAll } = useFriends()

  const addPlateContent = useMemo(() => {
    const number = ((user?.plates.length || 1) + 1).toString().padStart(3, '0')
    const translateStr =
      friendsAll && friendsAll.length > 0 ? 'app.add_plate_description' : 'app.add_plate_description_no_friends'

    return t(translateStr, {
      add: t('common.add'),
      number,
    })
  }, [friendsAll, t, user?.plates])

  const handleAddPlate = useCallback(() => {
    clearHash()
    if (!user) return
    saveUser({ ...user, plates: [...user.plates, Date.now()] })
    setDialogOpen(false)
  }, [clearHash, user, saveUser])

  const handleClose = useCallback(() => {
    clearHash()
    setDialogOpen(false)
  }, [clearHash])

  useEffect(() => {
    setDialogOpen(isAddPlateDialogOpen)
  }, [isAddPlateDialogOpen])

  return (
    <Dialog open={dialogOpen}>
      <DialogHeader title={t('app.add_plate')} />

      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          {addPlateContent}
        </Typography>
        <RegPlate number={(user?.plates.length || 0) + 1} />
      </DialogContent>

      <DialogActions>
        <VibrateButton size='large' variant='outlined' onClick={handleClose}>
          {t('common.cancel')}
        </VibrateButton>
        <VibrateButton size='large' variant='contained' onClick={handleAddPlate} autoFocus>
          {t('common.add')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default AddNumberDialog
