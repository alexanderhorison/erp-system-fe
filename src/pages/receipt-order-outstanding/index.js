import Grid from '@mui/material/Grid'
import TableReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/TableReceiptOrderOutstanding'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function ReceiptOrderOutstanding() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Surat Outstanding Produk'
          breadcrumbs={[{ label: 'Home' }, { label: 'Surat Outstanding Produk' }]}
        />
        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableReceiptOrderOutstanding />
      </Grid>
    </Grid>
  )
}
