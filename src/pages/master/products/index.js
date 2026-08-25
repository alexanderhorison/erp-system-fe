import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterProduct from 'src/views/master/products/TableMasterProduct'

export default function homeMasterProduct() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Product'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Products' }]}
        />
        <TableMasterProduct />
      </Grid>
    </Grid>
  )
}
