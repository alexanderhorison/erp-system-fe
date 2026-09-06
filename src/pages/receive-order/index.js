import Grid from '@mui/material/Grid'
import TableAllReceive from 'src/views/receive-order/TableAllReceive'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function ReceiveOrder() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Penerimaan Surat Jalan'
          breadcrumbs={[{ label: 'Home' }, { label: 'Penerimaan Surat Jalan' }]}
        />
        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableAllReceive />
      </Grid>
    </Grid>
  )
}
