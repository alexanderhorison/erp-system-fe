import { CardHeader, Grid } from '@mui/material'
import TableMasterWarehouse from 'src/views/master/warehouses/TableMasterWarehouse'

export default function homeMasterUnit() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Master Data Gudang' />
        <TableMasterWarehouse
        />
      </Grid>
    </Grid>
  )
}
