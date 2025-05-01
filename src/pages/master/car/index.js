import { Grid, Typography } from '@mui/material'
import TableMasterCar from 'src/views/master/cars/TableMasterCar'

export default function homeMasterCar() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Mobil
        </Typography>
        <TableMasterCar />
      </Grid>
    </Grid>
  )
}