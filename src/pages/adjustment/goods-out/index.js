import Grid from '@mui/material/Grid'

import PageHeader from 'src/views/common/PageHeader'
import TableAllGoodsOut from 'src/views/adjustment/goods-out/TableAllGoodsOut'

export default function AdjustmentGoodsOut() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Daftar Penyesuaian Barang Keluar'
          breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Adjustment' }, { label: 'Barang Keluar' }]}
        />
        <TableAllGoodsOut />
      </Grid>
    </Grid>
  )
}
