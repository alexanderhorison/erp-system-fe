import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

import AddAdjustmentGoodsIn from 'src/views/adjustment/goods-in/AddAdjustmentGoodsIn'
import PageHeader from 'src/views/common/PageHeader'

export default function AdjustmentGoodInAdd() {
  const router = useRouter()

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Pembuatan Surat Barang Masuk'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Adjustment' },
            { label: 'Barang Masuk', href: '/adjustment/goods-in' },
            { label: 'Pembuatan' }
          ]}
        />
        <AddAdjustmentGoodsIn />
      </Grid>
    </Grid>
  )
}
