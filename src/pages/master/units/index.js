import { CardHeader, Grid } from '@mui/material'
import TableMasterUnit from 'src/views/master/units/TableMasterUnit'

export default function homeMasterUnit() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Master Data Satuan' />
        <TableMasterUnit
        />
      </Grid>
    </Grid>
  )
}
