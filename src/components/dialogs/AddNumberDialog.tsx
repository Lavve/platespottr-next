import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHashNavigation } from '@/hooks/useHashNavigation'
import { useFriends } from '@/providers/friendsProvider'
import { useUser } from '@/providers/userProvider'
import VibrateButton from '../common/VibrateButton'
import RegPlate from '../RegPlate'
import Roadsign from '../Roadsign'

const AddNumberDialog = () => {
  const { isAddPlateDialogOpen, clearHash } = useHashNavigation()
  const [dialogOpen, setDialogOpen] = useState(isAddPlateDialogOpen)
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const { friendsAll } = useFriends()

  const addPlateContent = useMemo(() => {
    return friendsAll && friendsAll.length > 0
      ? t('app.add_plate_description', {
          add: t('common.add'),
          number: user?.plates.length.toString().padStart(3, '0') || '000',
        })
      : t('app.add_plate_description_no_friends', {
          add: t('common.add'),
          number: user?.plates.length.toString().padStart(3, '0') || '000',
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
      <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
        <Roadsign text={t('app.add_plate')} />
      </DialogTitle>
      <DialogContent>
        <Typography variant='body1' gutterBottom>
          {addPlateContent}
        </Typography>
        <RegPlate number={user?.plates.length || 0} />
      </DialogContent>
      <DialogActions>
        <VibrateButton onClick={handleClose}>{t('common.cancel')}</VibrateButton>
        <VibrateButton variant='contained' onClick={handleAddPlate}>
          {t('common.add')}
        </VibrateButton>
      </DialogActions>
    </Dialog>
  )
}

export default AddNumberDialog
