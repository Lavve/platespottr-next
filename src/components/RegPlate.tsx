'use client'

import { Box, Card, Typography } from '@mui/material'
import localFont from 'next/font/local'
import { useTranslations } from 'next-intl'
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

const RegPlate = ({ letters, number, scale = 1 }: IPlateProps) => {
  const t = useTranslations()

  return (
    <Card
      sx={{
        display: 'flex',
        width: 380,
        height: 76,
        borderRadius: 2,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        border: '4px solid #000',
        userSelect: 'none',
        transform: `scale(${scale})`,
      }}
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
        <Box sx={{ color: 'regplate.light', fontWeight: 300, lineHeight: 1, fontFamily: fontTratex.style.fontFamily }}>
          {t('app.plate_lang')}
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
          background: 'var(--regplate-gradient)',
        }}
      >
        {letters && number && (
          <>
            <Typography
              variant='h2'
              sx={{
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
                fontFamily: fontTratex.style.fontFamily,
                color: 'regplate.contrastText',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
              }}
            >
              {number.toString().padStart(3, '0')}
            </Typography>
          </>
        )}
      </Box>
    </Card>
  )
}

export default RegPlate
