'use client'

import { Box, LinearProgress, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import RegPlate from '@/components/RegPlate'
import { HOLD_DURATION, UPDATE_HOLD_INTERVAL, VIBRATE_SUCCESS } from '@/constants/app'
import { useUser } from '@/providers/userProvider'
import { generateRandomLetters } from '@/utils/generatePlateLetters'
import { vibrate } from '@/utils/vibrate'

const FindPlate = () => {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [letters, setLetters] = useState(() => generateRandomLetters())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startHold = () => {
    setIsHolding(true)
    setProgress(0)

    if (!user) return

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (UPDATE_HOLD_INTERVAL / HOLD_DURATION) * 100

        if (newProgress >= 100) {
          clearInterval(intervalRef.current as NodeJS.Timeout)
          return 100
        }
        return newProgress
      })
    }, UPDATE_HOLD_INTERVAL)

    timeoutRef.current = setTimeout(() => {
      saveUser({ ...user, plates: [...user.plates, Date.now()] })
      vibrate(VIBRATE_SUCCESS)
      endHold()
      setLetters(generateRandomLetters())
    }, HOLD_DURATION)
  }

  const endHold = () => {
    setIsHolding(false)
    setProgress(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
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

      <RegPlate letters={letters} number={user.plates.length + 1} />

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
          }}
        >
          {t('common.found')}
        </VibrateButton>
        {isHolding && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <LinearProgress
              variant='determinate'
              value={progress}
              color='primary'
              sx={{
                height: 10,
                borderRadius: 1,
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
                '& .MuiLinearProgress-bar': {
                  transition: 'none',
                },
              }}
            />
          </Box>
        )}
      </Box>
      <Typography variant='body2' color='text.secondary' sx={{ textWrap: 'pretty' }}>
        {t('app.press_for_seconds', { seconds: HOLD_DURATION / 1000 })}
      </Typography>
    </Paper>
  )
}

export default FindPlate
