'use client'

import type { FireworksHandlers } from '@fireworks-js/react'
import { Fireworks } from '@fireworks-js/react'
import { EmojiEvents } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useVibration } from '@/hooks/useVibration'
import type { IUser } from '@/types/user'

const CompleteDialog = ({ user }: { user: IUser | null }) => {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const t = useTranslations()
  const { handleClick } = useVibration()
  const ref = useRef<FireworksHandlers>(null)

  const handleClose = () => {
    handleClick()
    setIsCompleteDialogOpen(false)
  }

  useEffect(() => {
    if ((user?.numbers?.length ?? 0) === 999) {
      setIsCompleteDialogOpen(true)
      ref.current?.start()
    }
  }, [user])

  if (!isCompleteDialogOpen) return null

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isCompleteDialogOpen}>
        <DialogHeader title={t('completed.title')} />

        <DialogContent>
          <DialogContentText
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            {t('completed.description')}
            <EmojiEvents sx={{ fontSize: 120, color: 'gold' }} />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button size='large' variant='contained' onClick={handleClose}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
      <Fireworks
        ref={ref}
        options={{
          opacity: 1,
          acceleration: 1.03,
          particles: 30,
          traceSpeed: 1,
          lineWidth: {
            explosion: {
              min: 2,
              max: 4,
            },
            trace: {
              min: 2,
              max: 4,
            },
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          zIndex: 1000,
          background: '#000',
        }}
      />
    </>
  )
}

export default CompleteDialog
