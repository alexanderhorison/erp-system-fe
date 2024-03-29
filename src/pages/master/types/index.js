import { CardHeader, Grid } from '@mui/material'
import TableMasterType from 'src/views/master/types/TableMasterType'

export default function homeMasterType() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Master Data Tipe' />
        <TableMasterType />
      </Grid>
    </Grid>
  )
}
