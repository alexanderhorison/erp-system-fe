import { Grid, Typography } from '@mui/material'
import TableReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/TableReceiptOrderOutstanding'

export default function ReceiptOrderOutstanding() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Surat Outstanding Produk
        </Typography>
        <TableReceiptOrderOutstanding />
      </Grid>
    </Grid>
  )
}
