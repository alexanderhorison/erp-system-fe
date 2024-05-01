import { Grid, Typography } from '@mui/material'
import TableAllReceive from 'src/views/delivery-order-receive/TableAllReceive'

export default function DeliveryOrderReceive() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Penerimaan Surat Jalan
        </Typography>
        <TableAllReceive />
      </Grid>
    </Grid>
  )
}
