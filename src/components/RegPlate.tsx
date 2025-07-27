'use client'

import { Box, Card, Typography } from '@mui/material'
import localFont from 'next/font/local'
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

  if (!letters || !number) return null

  return (
    <Card
      sx={{
        display: 'flex',
        width: { xs: 300, sm: 360 },
        height: { xs: 65, sm: 76 },
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
            border: '2px dotted #bfad67',
            strokeDasharray: 20,
            strokeDashoffset: 20,
            textAlign: 'center',
          }}
        ></Box>
        <Box
          sx={{
            color: 'regplate.light',
            fontWeight: 300,
            fontSize: { xs: '0.75rem', sm: '1rem' },
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: fontTratex.style.fontFamily,
          }}
        >
          {/* {t('app.plate_lang')} */}
          {settings.country}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          p: 0,
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--regplate-gradient)',
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: { xs: '3rem', sm: '3.75rem' },
            fontFamily: fontTratex.style.fontFamily,
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {letters}
        </Typography>
        <Typography
          variant='h2'
          sx={{
            fontSize: { xs: '3rem', sm: '3.75rem' },
            fontFamily: fontTratex.style.fontFamily,
            color: 'regplate.contrastText',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {number.toString().padStart(3, '0')}
        </Typography>
      </Box>
    </Card>
  )
}

export default RegPlate
