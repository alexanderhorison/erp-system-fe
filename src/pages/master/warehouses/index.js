import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterWarehouse from 'src/views/master/warehouses/TableMasterWarehouse'

export default function homeMasterWarehouse() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Warehouse'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Warehouses' }]}
        />
        <TableMasterWarehouse />
      </Grid>
    </Grid>
  )
}
