import { Grid } from '@mui/material'
import ButtonBack from 'src/views/common/ButtonBack'
import AddPurchaseOrder from 'src/views/purchase-order/AddPurchaseOrder'

export default function HomeAddPurchaseOrder() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan Purchase Order' />
        <AddPurchaseOrder />
      </Grid>
    </Grid>
  )
}
