import Grid from '@mui/material/Grid'
import TableAllPosTransaction from 'src/views/pos-transaction/TableAllPosTransaction'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function PosTransaction() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daftar Transaksi POS' breadcrumbs={[{ label: 'Home' }, { label: 'Transaksi POS' }]} />

        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableAllPosTransaction />
      </Grid>
    </Grid>
  )
}
