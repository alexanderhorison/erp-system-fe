import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterVendor from 'src/views/master/vendor/TableMasterVendor'

export default function HomeMasterDataVendor() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Vendor'
          breadcrumbs={[{ label: 'Purchase Order' }, { label: 'Data Vendor' }, { label: 'Vendor' }]}
        />
        <TableMasterVendor />
      </Grid>
    </Grid>
  )
}
