'use client'

import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import RegPlate from '@/components/RegPlate'
import { HOLD_DURATION_SECONDS, VIBRATES } from '@/constants/app'
import { useAddNumber } from '@/hooks/useApi'
import { useVibration } from '@/hooks/useVibration'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { useSettings } from '@/providers/settingsProvider'
import { useUser } from '@/providers/userProvider'
import { ApiError } from '@/services/api'
import theme from '@/style/theme'
import { getUserCoordinates } from '@/utils/getUserCoordinates'

const rndNumber = () => {
  return Math.floor(Math.random() * (998 - 111 + 1)) + 111
}

const FindPlate = () => {
  const t = useTranslations()
  const { user, isLoading } = useUser()
  const addNumberMutation = useAddNumber()
  const { settings } = useSettings()
  const { showError } = useSnackbar()
  const { handleClick } = useVibration({ pattern: VIBRATES.SUCCESS })
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false)
  const releaseRef = useRef<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const initialRandomNumber = useRef(rndNumber())

  const isDisabled = useMemo(
    () => isLoading || addNumberMutation.isPending || isGettingCoordinates,
    [isLoading, addNumberMutation.isPending, isGettingCoordinates]
  )
  const currentNumber = useMemo(() => {
    return (user?.numbers?.length ?? initialRandomNumber.current) + 1
  }, [user])

  const updateProgress = () => {
    if (!startTimeRef.current || !user) return

    const elapsed = Date.now() - startTimeRef.current
    const newProgress = (elapsed / (HOLD_DURATION_SECONDS * 1000)) * 100
    setProgress(Math.min(newProgress, 100))

    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(updateProgress)
    } else {
      handleCompletion()
    }
  }

  const handleCompletion = async () => {
    if (!user?.id) return

    setIsGettingCoordinates(true)
    try {
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
      handleClick()
    } finally {
      setIsGettingCoordinates(false)
    }
    endHold()
  }

  const updateReleaseProgress = () => {
    setProgress(prev => {
      const newProgress = prev - 3
      if (newProgress <= 0) {
        if (releaseRef.current) {
          cancelAnimationFrame(releaseRef.current)
          releaseRef.current = null
        }
        return 0
      }
      releaseRef.current = requestAnimationFrame(updateReleaseProgress)
      return newProgress
    })
  }

  const startHold = () => {
    startTimeRef.current = Date.now()
    setIsHolding(true)
    setProgress(0)
    updateProgress()
  }

  const endHold = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      updateReleaseProgress()
    } else {
      startTimeRef.current = null
      setProgress(0)
      setIsHolding(false)
    }
  }

  if (!user) return null

  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        py: 4,
        px: 2,
      }}
    >
      <Typography variant='h6'>{t('app.next_number_to_find')}</Typography>

      <Container maxWidth='sm'>
        <RegPlate number={currentNumber} />
      </Container>

      <Box sx={{ position: 'relative', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
        <VibrateButton
          variant='contained'
          size='large'
          color='primary'
          disabled={isDisabled}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onContextMenu={e => e.preventDefault()}
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            userSelect: 'none',
            border: `4px solid ${theme.palette.roadsign.contrastText}`,
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
            width: 120,
            height: 120,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {t('common.found')}
        </VibrateButton>
        {isGettingCoordinates && (
          <CircularProgress
            thickness={2}
            size={136}
            sx={{
              pointerEvents: 'none',
              position: 'absolute',
              top: -8,
              left: -8,
              zIndex: 1,
              opacity: 0.5,
            }}
          />
        )}
        {isHolding && (
          <CircularProgress
            variant='determinate'
            value={progress}
            size={114}
            thickness={4}
            sx={{
              pointerEvents: 'none',
              color: 'secondary.main',
              position: 'absolute',
              top: 3,
              left: 3,
              zIndex: 1,
              '& .MuiCircularProgress-circle': {
                transition: 'none',
              },
            }}
          />
        )}
      </Box>
    </Paper>
  )
}

export default FindPlate
