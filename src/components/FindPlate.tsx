'use client'

import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import RegPlate from '@/components/RegPlate'
import { HOLD_DURATION, VIBRATE_SUCCESS } from '@/constants/app'
import { useUser } from '@/providers/userProvider'
import { vibrate } from '@/utils/vibrate'

const FindPlate = () => {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const releaseRef = useRef<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const updateProgress = () => {
    if (!startTimeRef.current || !user) return

    const elapsed = Date.now() - startTimeRef.current
    const newProgress = (elapsed / HOLD_DURATION) * 100
    console.log({ newProgress })
    setProgress(Math.min(newProgress, 100))

    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(updateProgress)
    } else {
      saveUser({ ...user, plates: [...user.plates, Date.now()] })
      vibrate(VIBRATE_SUCCESS)
      endHold()
    }
  }

  const updateReleaseProgress = () => {
    setProgress(prev => {
      const newProgress = prev - 1
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

      <RegPlate number={user.plates.length + 1} />

      <Box sx={{ position: 'relative', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
        <VibrateButton
          variant='contained'
          size='large'
          color='primary'
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onContextMenu={e => e.preventDefault()}
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            userSelect: 'none',
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
        {isHolding && (
          <CircularProgress
            variant='determinate'
            value={progress}
            size={140}
            thickness={5}
            sx={{
              pointerEvents: 'none',
              color: 'secondary.main',
              opacity: 0.9,
              position: 'absolute',
              top: -10,
              left: -10,
              zIndex: 1,
              '& .MuiCircularProgress-circle': {
                transition: 'none',
              },
            }}
          />
        )}
      </Box>
      <Typography variant='body2' color='text.secondary' sx={{ textWrap: 'pretty' }}>
        {t('app.press_for_seconds', { seconds: HOLD_DURATION / 1000 })}
      </Typography>
    </Paper>
  )
}

export default FindPlate
