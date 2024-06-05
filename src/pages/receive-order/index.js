import { Grid, Typography } from '@mui/material'
import TableAllReceive from 'src/views/receive-order/TableAllReceive'

export default function ReceiveOrder() {
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
