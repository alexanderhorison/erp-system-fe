import {  Grid, Typography } from '@mui/material'
import TableMasterProduct from 'src/views/master/products/TableMasterProduct'

export default function homeMasterProduct() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Produk
        </Typography>
        <TableMasterProduct />
      </Grid>
    </Grid>
  )
}
