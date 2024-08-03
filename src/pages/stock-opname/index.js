import { Grid, Typography } from '@mui/material'
import TableListStockOpname from 'src/views/stock-opname/TableListStockOpname'

export default function homeStockOpname() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Stock Opname
        </Typography>
        <TableListStockOpname />
      </Grid>
    </Grid>
  )
}
