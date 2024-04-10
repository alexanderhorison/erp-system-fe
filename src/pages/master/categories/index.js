import {  Grid, Typography } from '@mui/material'
import TableMasterCategory from 'src/views/master/categories/TableMasterCategory'

export default function homeMasterCategory() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Kategory
        </Typography>
        <TableMasterCategory />
      </Grid>
    </Grid>
  )
}
