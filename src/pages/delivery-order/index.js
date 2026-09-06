import Grid from '@mui/material/Grid'
import TableAllInvoice from 'src/views/delivery-order/TableAllInvoice'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function HomeProductWarehouse() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daftar Surat Jalan' breadcrumbs={[{ label: 'Home' }, { label: 'Surat Jalan' }]} />
        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableAllInvoice />
      </Grid>
    </Grid>
  )
}
