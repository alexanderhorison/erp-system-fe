import { CardHeader, Grid } from '@mui/material'
import TableMasterCategory from 'src/views/master/categories/TableMasterCategory'

export default function homeMasterCategory() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CardHeader title='Master Data Kategori' />
        <TableMasterCategory
        />
      </Grid>
    </Grid>
  )
}
