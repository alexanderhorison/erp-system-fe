import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableMasterCustomer from 'src/views/master/customer/TableMasterCustomer'

export default function homeMasterCustomer() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Master Data Customer'
          breadcrumbs={[{ label: 'Sales Order' }, { label: 'Data Customer' }, { label: 'Customer' }]}
        />
        <TableMasterCustomer />
      </Grid>
    </Grid>
  )
}
