import { Grid, Typography } from '@mui/material'
import ButtonBack from 'src/views/common/ButtonBack'
import EditStockOpname from 'src/views/stock-opname/EditStockOpname'

export default function HomeEditStockOpname() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} >
        <Grid container alignContent={'center'} justifyContent={'space-between'}>
          <Grid item>
            <ButtonBack name='Edit Stok Opname' />
          </Grid>
        </Grid>
        <EditStockOpname />
      </Grid>
    </Grid>
  )
}
