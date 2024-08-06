import { Grid, Typography } from '@mui/material'
import AddAdjustmentGoodsOut from 'src/views/adjustment/goods-out/AddAdjustmentGoodsOut'

export default function AdjustmentGoodOutAdd() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Pembuatan surat barang keluar
        </Typography>
        <AddAdjustmentGoodsOut />
      </Grid>
    </Grid>
  )
}
