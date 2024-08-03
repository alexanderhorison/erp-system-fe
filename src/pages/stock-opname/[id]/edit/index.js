import { Grid, Typography } from '@mui/material'
import EditStockOpname from 'src/views/stock-opname/EditStockOpname'

export default function HomeEditStockOpname() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Edit stok opname
        </Typography>
        <EditStockOpname/>
      </Grid>
    </Grid>
  )
}
