'use client'

import { Box, Button, CardContent, LinearProgress, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import RegPlate from '@/components/RegPlate'
import { useUser } from '@/providers/userProvider'
import { generateRandomLetters } from '@/utils/generatePlateLetters'
import { vibrate } from '@/utils/vibrate'

const FindPlate = () => {
  const t = useTranslations()
  const { user, saveUser } = useUser()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [letters, setLetters] = useState('')

  const holdDuration = 1500
  const updateInterval = 50

  useEffect(() => {
    setLetters(generateRandomLetters())
  }, [])

  const startHold = () => {
    setIsHolding(true)
    setProgress(0)

    if (!user) return

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (updateInterval / holdDuration) * 100

        if (newProgress >= 100) {
          clearInterval(intervalRef.current as NodeJS.Timeout)
          return 100
        }
        return newProgress
      })
    }, updateInterval)

    timeoutRef.current = setTimeout(() => {
      saveUser({ ...user, plates: [...user.plates, Date.now()] })
      vibrate(60)
      endHold()
      setLetters(generateRandomLetters())
    }, holdDuration)
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
    <Paper sx={{ borderRadius: 2 }} elevation={8}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Typography variant='h6'>{t('app.next_number_to_find')}</Typography>
        <RegPlate letters={letters} number={user.plates.length + 1} />
        <Box sx={{ position: 'relative', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            size='large'
            color='primary'
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            sx={{ userSelect: 'none' }}
          >
            {t('common.found')}
          </Button>
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
        <Typography variant='body2' color='text.secondary'>
          {t('app.press_for_seconds', { seconds: holdDuration / 1000 })}
        </Typography>
      </CardContent>
    </Paper>
  )
}

export default FindPlate
