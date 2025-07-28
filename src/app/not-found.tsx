import { ArrowBack } from '@mui/icons-material'
import { Container, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import VibrateButton from '@/components/common/VibrateButton'

const NotFound = () => {
  return (
    <Container
      maxWidth='md'
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, pb: 6, height: '100vh' }}
    >
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 3 }}>
        <Typography variant='h1' sx={{ fontWeight: 100 }}>
          404
        </Typography>
        <Typography sx={{ mb: 2 }}>Sidan du letar efter finns inte eller har tagits bort.</Typography>
        <VibrateButton variant='contained' color='primary' startIcon={<ArrowBack />} component={Link} href='/'>
          Till startsidan
        </VibrateButton>
      </Paper>
    </Container>
  )
}

export default NotFound
