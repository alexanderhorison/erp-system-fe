import { Grid, Typography } from '@mui/material'
import TableAllGoodsIn from 'src/views/adjustment/goods-in/TableAllGoodsIn'

export default function adjustmentGoodsIn() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Penyesuaian Barang Masuk
        </Typography>
        <TableAllGoodsIn />
      </Grid>
    </Grid>
  )
}