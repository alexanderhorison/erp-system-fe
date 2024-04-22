import { Grid, Typography } from '@mui/material'
import TableAllInvoice from 'src/views/delivery-order/TableAllInvoice'

export default function homeProductWarehouse() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Surat Jalan
        </Typography>
        <TableAllInvoice />
      </Grid>
    </Grid>
  )
}
