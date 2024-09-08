import { Grid, Typography } from '@mui/material'
import TableAllChooseReceiveOrder from 'src/views/receive-order/TableAllChooseReceiveOrder'

export default function AddReceiveOrder() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          List Surat Jalan
          <Typography fontSize={15}>Pilih surat jalan</Typography>
        </Typography>
        <TableAllChooseReceiveOrder />
      </Grid>
    </Grid>
  )
}
