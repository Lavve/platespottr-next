import { Box } from '@mui/material'
import RegPlate from '@/components/RegPlate'
import Roadsign from '@/components/Roadsign'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 0, padding: 0 }}>Platespottr</h1>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ThemeToggle />
        <Roadsign />
        <RegPlate number={123} />
      </Box>
    </div>
  )
}
