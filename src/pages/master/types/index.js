import {  Grid, Typography } from '@mui/material'
import TableMasterType from 'src/views/master/types/TableMasterType'

export default function homeMasterType() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Tipe
        </Typography>
        <TableMasterType />
      </Grid>
    </Grid>
  )
}
