import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterShift from 'src/views/master/shift/TableMasterShift'

export default function homeMasterShift() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Shift'
          breadcrumbs={[{ label: 'Point of Sale' }, { label: 'Shift' }]}
        />
        <TableMasterShift />
      </Grid>
    </Grid>
  )
}
