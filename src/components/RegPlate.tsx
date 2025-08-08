/** biome-ignore-all lint/suspicious/noArrayIndexKey: // */
'use client'

import { Box, Card } from '@mui/material'
import localFont from 'next/font/local'
import { useEffect, useMemo, useState } from 'react'
import RegPlateCharacter from '@/components/RegPlateCharacter'
import { useSettings } from '@/providers/settingsProvider'
import theme from '@/style/theme'
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

const RegPlate = ({ number }: IPlateProps) => {
  const { settings } = useSettings()
  const [letters, setLetters] = useState('')

  useEffect(() => {
    setLetters(generateRandomLetters(number))
  }, [number])

  const lettersArray = useMemo(() => {
    return letters.split('')
  }, [letters])

  const numberArray = useMemo(() => {
    return number.toString().padStart(3, '0').split('')
  }, [number])

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
        border: `4px solid ${theme.palette.regplate.contrastText}`,
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
          background: settings.country === 'us' ? theme.palette.regplate.dark : 'var(--roadsign-gradient)',
          color: 'regplate.contrastText',
        }}
      >
        {settings.country !== 'us' && (
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
        )}
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
          px: 3,
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--regplate-gradient)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            width: '100%',
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {lettersArray.map((letter, idx) => (
            <RegPlateCharacter key={`${idx}-letter`} char={letter} type='letter' />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            width: '100%',
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {numberArray.map((digit, idx) => (
            <RegPlateCharacter key={`${idx}-number`} char={digit} type='number' />
          ))}
        </Box>
      </Box>
    </Card>
  )
}

export default RegPlate
