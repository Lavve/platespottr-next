import { Card, Typography } from '@mui/material'
import localFont from 'next/font/local'

const fontTratex = localFont({
  src: [
    {
      path: '../assets/fonts/Tratex.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})

const Roadsign = () => {
  return (
    <Card
      sx={{
        width: 'fit-content',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        borderRadius: 2,
        border: '4px solid #fff',
        background: 'var(--roadsign-gradient)',
        textTransform: 'uppercase',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          fontFamily: fontTratex.style.fontFamily,
          color: 'roadsign.contrastText',
        }}
      >
        22
      </Typography>
      <Typography
        variant='h6'
        sx={{
          fontFamily: fontTratex.style.fontFamily,
          color: 'roadsign.contrastText',
        }}
      >
        Roadsign
      </Typography>
    </Card>
  )
}

export default Roadsign
