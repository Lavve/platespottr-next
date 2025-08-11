import { Box } from '@mui/material'
import { headers } from 'next/headers'
import AuthGuard from '@/components/auth/AuthGuard'
import Page from '@/components/common/Page'
import { GOOGLE_PLAY_ID } from '@/constants/app'

const HomePage = async () => {
  const headersList = await headers()
  const xRequestedWith = headersList.get('x-requested-with')
  const isTwaApp = xRequestedWith === GOOGLE_PLAY_ID

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
        <Page isTwaApp={isTwaApp} />
      </AuthGuard>
    </Box>
  )
}

export default HomePage
