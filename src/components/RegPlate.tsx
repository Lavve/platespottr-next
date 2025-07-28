'use client'

import { Box, Card, Typography } from '@mui/material'
import localFont from 'next/font/local'
import { useMemo, useRef } from 'react'
import { useSettings } from '@/providers/settingsProvider'
import type { IPlateProps } from '@/types/common'

const fontTratex = localFont({
  src: [
    {
      path: '../assets/fonts/Tratex.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})

const RegPlate = ({ letters, number }: IPlateProps) => {
  const { settings } = useSettings()
  const key = useRef(0)

  const lettersArray = useMemo(() => {
    return letters.split('')
  }, [letters])

  const numberArray = useMemo(() => {
    return number.toString().padStart(3, '0').split('')
  }, [number])

  const wrappedLetters = useMemo(() => {
    return lettersArray.map(letter => (
      <Box
        key={`${letter}-${key.current++}`}
        sx={{ display: 'inline-block', minWidth: { xs: '2rem', sm: '2.25rem' }, textAlign: 'center' }}
      >
        {letter}
      </Box>
    ))
  }, [lettersArray])

  const wrappedNumbers = useMemo(() => {
    return numberArray.map(digit => (
      <Box
        key={`${digit}-${key.current++}`}
        sx={{ display: 'inline-block', minWidth: { xs: '1.5rem', sm: '2.25rem' }, textAlign: 'center' }}
      >
        {digit}
      </Box>
    ))
  }, [numberArray])

  if (!letters || !number) return null

  return (
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        aspectRatio: 5,
        borderRadius: 2,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        border: '4px solid #000',
        userSelect: 'none',
      }}
      elevation={5}
    >
      <Box
        sx={{
          display: 'flex',
          width: '10%',
          height: '100%',
          flexGrow: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          gap: 1,
          background: 'var(--roadsign-gradient)',
          color: 'regplate.contrastText',
        }}
      >
        <Box
          sx={{
            width: '50%',
            aspectRatio: 1,
            borderRadius: '50%',
            border: '2px dotted var(--regplate-stars)',
            strokeDasharray: 20,
            strokeDashoffset: 20,
            textAlign: 'center',
          }}
        />
        <Box
          sx={{
            color: 'regplate.light',
            fontWeight: 300,
            fontSize: 'clamp(0.75rem, calc((75vw - 4.5rem) * 0.0625), 1.5rem)',
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: fontTratex.style.fontFamily,
          }}
        >
          {settings.country}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          p: 0,
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--regplate-gradient)',
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: 'clamp(2.75rem, calc((100vw - 4.5rem) / 7), 5rem)',
            fontFamily: fontTratex.style.fontFamily,
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {wrappedLetters}
        </Typography>
        <Typography
          variant='h2'
          sx={{
            fontSize: 'clamp(3rem, calc((100vw - 4.5rem) / 7), 5rem)',
            fontFamily: fontTratex.style.fontFamily,
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {wrappedNumbers}
        </Typography>
      </Box>
    </Card>
  )
}

export default RegPlate
