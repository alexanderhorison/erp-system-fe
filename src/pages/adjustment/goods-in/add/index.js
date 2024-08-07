import { Grid, Typography } from '@mui/material'
import AddAdjustmentGoodsIn from 'src/views/adjustment/goods-in/AddAdjustmentGoodsIn'

export default function AdjustmentGoodInAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Pembuatan surat barang Masuk
        </Typography>
        <AddAdjustmentGoodsIn />
      </Grid>
    </Grid>
  )
}