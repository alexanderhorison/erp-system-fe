import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterType from 'src/views/master/types/TableMasterType'

export default function homeMasterType() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Type'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Product Types' }]}
        />
        <TableMasterType />
      </Grid>
    </Grid>
  )
}
