import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterUnit from 'src/views/master/units/TableMasterUnit'

export default function homeMasterUnit() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Unit'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Product Units' }]}
        />
        <TableMasterUnit />
      </Grid>
    </Grid>
  )
}
