import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

import AddAdjustmentGoodsOut from 'src/views/adjustment/goods-out/AddAdjustmentGoodsOut'
import PageHeader from 'src/views/common/PageHeader'

export default function AdjustmentGoodOutAdd() {
  const router = useRouter()

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Pembuatan Surat Barang Keluar'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Adjustment' },
            { label: 'Barang Keluar', href: '/adjustment/goods-out' },
            { label: 'Pembuatan' }
          ]}
        />
        <AddAdjustmentGoodsOut />
      </Grid>
    </Grid>
  )
}
