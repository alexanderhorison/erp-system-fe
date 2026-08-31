import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableAllGoodsIn from 'src/views/adjustment/goods-in/TableAllGoodsIn'

export default function AdjustmentGoodsIn() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Penyesuaian Barang Masuk'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Adjustment' }, { label: 'Barang Masuk' }]}
        />
        <TableAllGoodsIn />
      </Grid>
    </Grid>
  )
}
