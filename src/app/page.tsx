import { Container } from '@mui/material'
import AuthGuard from '@/components/auth/AuthGuard'
import Page from '@/components/common/Page'

const HomePage = () => {
  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        height: '100vh',
      }}
    >
      <AuthGuard>
        <Page />
      </AuthGuard>
    </Container>
  )
}

export default HomePage
