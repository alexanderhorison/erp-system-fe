import {  Grid, Typography } from '@mui/material'
import TableMasterUnit from 'src/views/master/units/TableMasterUnit'

export default function homeMasterUnit() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Satuan
        </Typography>
        <TableMasterUnit />
      </Grid>
    </Grid>
  )
}
