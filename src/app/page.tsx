import { Box } from '@mui/material'
import AuthGuard from '@/components/auth/AuthGuard'
import Page from '@/components/common/Page'

const HomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        height: '100vh',
      }}
    >
      <AuthGuard>
        <Page />
      </AuthGuard>
    </Box>
  )
}

export default HomePage
