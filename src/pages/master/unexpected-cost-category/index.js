import { Grid, Typography } from '@mui/material'
import TableMasterUnexpectedCostCategory from 'src/views/master/unexpected-cost-category/TableMasterUnexpectedCostCategory'

export default function MasterUnexpectedCostCategory() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Master Data Kategori Biaya Tak Terduga
        </Typography>
        <TableMasterUnexpectedCostCategory />
      </Grid>
    </Grid>
  )
}
