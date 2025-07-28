import { Grid } from '@mui/material'
import StatisticsDialog from '@/components/dialogs/StatisticsDialog'
import FriendsDialog from './dialogs/FriendsDialog'
import RulesDialog from './dialogs/RulesDialog'
import SettingsDialog from './dialogs/SettingsDialog'
import TopListDialog from './dialogs/TopListDialog'

const PageActionButtons = () => {
  return (
    <Grid container rowSpacing={1} columnSpacing={1} sx={{ mt: 2 }}>
      <Grid size={4}>
        <StatisticsDialog />
      </Grid>
      <Grid size={4}>
        <FriendsDialog />
      </Grid>
      <Grid size={4}>
        <TopListDialog />
      </Grid>
      <Grid size={6}>
        <RulesDialog />
      </Grid>
      <Grid size={6}>
        <SettingsDialog />
      </Grid>
    </Grid>
  )
}

export default PageActionButtons
