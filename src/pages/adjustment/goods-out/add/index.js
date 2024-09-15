import { Grid, Typography } from '@mui/material'
import AddAdjustmentGoodsOut from 'src/views/adjustment/goods-out/AddAdjustmentGoodsOut'
import ButtonBack from 'src/views/common/ButtonBack'

export default function AdjustmentGoodOutAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ButtonBack paddingY={3} name='Pembuatan surat barang keluar' />
        <AddAdjustmentGoodsOut />
      </Grid>
    </Grid>
  )
}
