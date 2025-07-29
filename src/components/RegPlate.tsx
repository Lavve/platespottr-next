'use client'

import { Box, Card, Typography } from '@mui/material'
import localFont from 'next/font/local'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSettings } from '@/providers/settingsProvider'
import type { IPlateProps } from '@/types/common'
import { generateRandomLetters } from '@/utils/generatePlateLetters'

const fontTratex = localFont({
  src: [
    {
      path: '../assets/fonts/Tratex.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})
const plateFontSize = 'clamp(3rem, calc((100vw - 3rem) / 6.5), 5.5rem)'

const RegPlate = ({ number }: IPlateProps) => {
  const { settings } = useSettings()
  const key = useRef(0)
  const [letters, setLetters] = useState('')

  // const letters = useMemo(() => {
  //   return generateRandomLetters(number)
  // }, [number])

  useEffect(() => {
    setLetters(generateRandomLetters(number))
  }, [number])

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
        component='span'
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
        component='span'
        sx={{ display: 'inline-block', minWidth: { xs: '1.5rem', sm: '3rem' }, textAlign: 'center' }}
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
        aspectRatio: 5.25,
        borderRadius: 2,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        border: '4px solid #000',
        userSelect: 'none',
      }}
      elevation={7}
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
          gap: 1.2,
          background: 'var(--roadsign-gradient)',
          color: 'regplate.contrastText',
        }}
      >
        <Box
          sx={{
            width: '60%',
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
            fontSize: 'clamp(0.75rem, calc((75vw - 4.5rem) * 0.06), 1.25rem)',
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
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--regplate-gradient)',
        }}
      >
        <Typography
          sx={{
            fontSize: plateFontSize,
            fontFamily: fontTratex.style.fontFamily,
            lineHeight: 1,
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {wrappedLetters}
        </Typography>
        <Typography
          sx={{
            fontSize: plateFontSize,
            fontFamily: fontTratex.style.fontFamily,
            lineHeight: 1,
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
