import { Grid, Typography } from '@mui/material'
import TableProductWarehouse from 'src/views/product-warehouse/warehouse/TableProductWarehouse'

export default function homeProductWarehouse() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Daftar Gudang
        </Typography>
        <TableProductWarehouse />
      </Grid>
    </Grid>
  )
}
