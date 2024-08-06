import { Grid, Typography } from '@mui/material'
import TableAllGoodsOut from 'src/views/adjustment/goods-out/TableAllGoodsOut'

export default function adjustmentGoodsOut() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Penyesuaian Barang Keluar
        </Typography>
        <TableAllGoodsOut />
      </Grid>
    </Grid>
  )
}
