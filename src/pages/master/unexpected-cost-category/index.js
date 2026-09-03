import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterUnexpectedCostCategory from 'src/views/master/unexpected-cost-category/TableMasterUnexpectedCostCategory'

export default function MasterUnexpectedCostCategory() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Kategori Biaya Tak Terduga'
          breadcrumbs={[{ label: 'Daily Cost' }, { label: 'Master Data' }, { label: 'Unexpected Cost' }]}
        />
        <TableMasterUnexpectedCostCategory />
      </Grid>
    </Grid>
  )
}
