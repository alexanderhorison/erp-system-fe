import { Grid, Typography } from '@mui/material'
import AddAdjustmentGoodsIn from 'src/views/adjustment/goods-in/AddAdjustmentGoodsIn'
import ButtonBack from 'src/views/common/ButtonBack'

export default function AdjustmentGoodInAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan surat barang Masuk' />
        <AddAdjustmentGoodsIn />
      </Grid>
    </Grid>
  )
}