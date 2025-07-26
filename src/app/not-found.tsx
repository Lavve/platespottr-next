import { ArrowBack } from '@mui/icons-material'
import { Button, Container, Paper, Typography } from '@mui/material'
import Link from 'next/link'

const NotFound = () => {
  return (
    <Container maxWidth='md' sx={{ my: 4, pb: 6 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h1' sx={{ fontWeight: 100 }} gutterBottom>
          404
        </Typography>
        <Typography>Sidan du letar efter finns inte eller har tagits bort.</Typography>
        <Button variant='contained' color='primary' startIcon={<ArrowBack />} component={Link} href='/'>
          Till startsidan
        </Button>
      </Paper>
    </Container>
  )
}

export default NotFound
