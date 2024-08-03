import { Grid, Typography } from '@mui/material'
import AddStockOpname from 'src/views/stock-opname/AddStockOpname'

export default function HomeEditStockOpname() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Detail stok opname
        </Typography>
        
        <AddStockOpname />
      </Grid>
    </Grid>
  )
}
