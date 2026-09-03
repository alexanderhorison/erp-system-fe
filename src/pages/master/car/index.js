import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterCar from 'src/views/master/cars/TableMasterCar'

export default function homeMasterCar() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Mobil'
          breadcrumbs={[{ label: 'Daily Cost' }, { label: 'Master Data' }, { label: 'Vehicles' }]}
        />
        <TableMasterCar />
      </Grid>
    </Grid>
  )
}
