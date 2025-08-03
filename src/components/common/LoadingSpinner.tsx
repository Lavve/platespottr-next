'use client'

import { Box, CircularProgress } from '@mui/material'

const LoadingSpinner = () => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' p={2}>
      <CircularProgress />
    </Box>
  )
}

export default LoadingSpinner
