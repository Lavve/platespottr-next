import { Card, Typography } from '@mui/material'
import localFont from 'next/font/local'
import type { IRoadsignProps } from '@/types/common'

const fontOcrb = localFont({
  src: [
    {
      path: '../assets/fonts/ocrb.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})

const Roadsign = ({ number, text }: IRoadsignProps) => {
  return (
    <Card
      sx={{
        width: 'fit-content',
        px: 3,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        borderRadius: 2,
        border: '3px solid #fff',
        background: 'var(--roadsign-gradient)',
        textTransform: 'uppercase',
        userSelect: 'none',
        boxShadow: '2px 4px 4px 0 rgba(0, 0, 0, 0.2)',
      }}
      elevation={5}
    >
      {number && (
        <Typography
          variant='h5'
          sx={{
            fontFamily: fontOcrb.style.fontFamily,
            color: 'roadsign.contrastText',
          }}
        >
          {number}
        </Typography>
      )}
      <Typography
        variant='h5'
        sx={{
          fontFamily: fontOcrb.style.fontFamily,
          color: 'roadsign.contrastText',
        }}
      >
        {text}
      </Typography>
    </Card>
  )
}

export default Roadsign
