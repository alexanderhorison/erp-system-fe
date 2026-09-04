import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import DailyCostCalendarView from 'src/views/daily-cost-calendar/DailyCostCalendarView'

export default function DailyCostCalendar() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daily Cost Calendar' breadcrumbs={[{ label: 'Daily Cost' }, { label: 'Daily Cost Calendar' }]} />
        <DailyCostCalendarView />
      </Grid>
    </Grid>
  )
}
