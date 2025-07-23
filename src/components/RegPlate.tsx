'use client'

import { Box, Card, Typography, useTheme } from '@mui/material'
import localFont from 'next/font/local'
import { useEffect, useState } from 'react'
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

const RegPlate = ({ number }: { number: number }) => {
  const [letters, setLetters] = useState('')
  const theme = useTheme()

  useEffect(() => {
    setLetters(generateRandomLetters())
  }, [])

  return (
    <Card
      sx={{
        display: 'flex',
        width: 380,
        height: 76,
        borderRadius: 2,
        textTransform: 'uppercase',
        background: 'var(--regplate-gradient)',
        border: '4px solid #000',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '40px',
          height: '100%',
          flexGrow: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          gap: 1,
          background: theme.palette.regplate.secondary,
          color: 'regplate.contrastText',
        }}
      >
        <Box
          sx={{
            width: '50%',
            aspectRatio: 1,
            borderRadius: '50%',
            border: '2px dotted #bfad67',
            strokeDasharray: 20,
            strokeDashoffset: 20,
            textAlign: 'center',
          }}
        ></Box>
        <Box sx={{ color: 'regplate.light', fontWeight: 300, lineHeight: 1, fontFamily: fontTratex.style.fontFamily }}>
          S
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          px: 2,
          py: 0.5,
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {letters && (
          <>
            <Typography
              variant='h2'
              sx={{
                fontFamily: fontTratex.style.fontFamily,
                color: 'regplate.contrastText',
              }}
            >
              {letters}
            </Typography>
            <Typography
              variant='h2'
              sx={{
                fontFamily: fontTratex.style.fontFamily,
                color: 'regplate.contrastText',
              }}
            >
              {number}
            </Typography>
          </>
        )}
      </Box>
    </Card>
  )
}

export default RegPlate
