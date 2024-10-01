import { Grid, Typography } from '@mui/material'
import AddSalesOrder from 'src/views/sales-order/AddSalesOrder'

export default function HomeAddSalesOrder() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Pembuatan Sales Order
        </Typography>
        <AddSalesOrder />
      </Grid>
    </Grid>
  )
}
