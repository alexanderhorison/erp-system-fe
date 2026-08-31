import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableAllInternalTransfer from 'src/views/internalTransfer/TableAllInternalTransfer'

export default function InternalTransfer() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Internal Transfer Rak'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Management' }, { label: 'Internal Transfer' }]}
        />
        <TableAllInternalTransfer />
      </Grid>
    </Grid>
  )
}
