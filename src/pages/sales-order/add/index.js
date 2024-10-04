import { Grid } from '@mui/material'
import ButtonBack from 'src/views/common/ButtonBack'
import AddSalesOrder from 'src/views/sales-order/AddSalesOrder'

export default function HomeAddSalesOrder() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan Sales Order' />
        <AddSalesOrder />
      </Grid>
    </Grid>
  )
}
