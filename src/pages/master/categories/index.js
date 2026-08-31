import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterCategory from 'src/views/master/categories/TableMasterCategory'

export default function homeMasterCategory() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Category'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Data Inventory' }, { label: 'Product Categories' }]}
        />
        <TableMasterCategory />
      </Grid>
    </Grid>
  )
}
