'use client'

import { Box, Button, Card, CardContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import RegPlate from '@/components/RegPlate'
import { useGame } from '@/providers/gameProvider'
import { generateRandomLetters } from '@/utils/generatePlateLetters'
import { vibrate } from '@/utils/vibrate'
import Streak from './Streak'

const FindPlate = () => {
  const { game, saveGame } = useGame()
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
      saveGame({
        ...game,
        currentPlate: game.currentPlate + 1,
        findings: [...(game.findings || []), { plate: game.currentPlate, foundAt: Date.now() }],
      })
      vibrate()
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

  return (
    <Card sx={{ borderRadius: 3 }} raised>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Typography variant='h6'>Nästa nummer att hitta</Typography>
        <RegPlate letters={letters} number={game.currentPlate} />
        <Box sx={{ position: 'relative', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
          >
            Hittad!
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
                color='secondary'
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
        <Typography variant='body2'>Håll inne knappen i 1.5 sekunder för att registrera numret</Typography>
        <Streak />
      </CardContent>
    </Card>
  )
}

export default FindPlate
