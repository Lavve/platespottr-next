'use client'

import { Box, CircularProgress } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' p={2}>
      <CircularProgress />
    </Box>
  )
}
