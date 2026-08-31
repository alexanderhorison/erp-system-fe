import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'

import { fetchDetailAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

import DetailGoodsIn from 'src/views/adjustment/goods-in/DetailGoodsIn'
import ToolbarGoodsIn from 'src/views/adjustment/goods-in/ToolbarGoodsIn'
import PageHeader from 'src/views/common/PageHeader'

export default function DetailAdjustmentGoodsIn({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailAdjustmentGoodsIn: data,
    errorDetailAdjustmentGoodsIn,
    loadingDetailAdjustmentGoodsIn
  } = useSelector(state => state.adjustmentGoodsIn)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailAdjustmentGoodsIn(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (errorDetailAdjustmentGoodsIn) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Barang Masuk: {id} Tidak Ditemukan. Mohon cek list surat barang masuk:{' '}
            <Link href='/adjustment/goods-in/'>Penyesuaian Barang Masuk</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  // ** Skeletons hold the two-column shape while the detail resolves, rather
  // than collapsing the page to a centred spinner.
  if (loadingDetailAdjustmentGoodsIn || !data) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Skeleton variant='text' width={240} height={38} />
          <Skeleton variant='text' width={140} height={22} sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} xl={9}>
              <Skeleton variant='rounded' height={520} />
            </Grid>
            <Grid item xs={12} md={4} xl={3}>
              <Skeleton variant='rounded' height={150} />
              <Skeleton variant='rounded' height={140} sx={{ mt: 4 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Surat Barang Masuk'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Adjustment' },
            { label: 'Barang Masuk', href: '/adjustment/goods-in' },
            { label: data?.code || 'Detail' }
          ]}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8} xl={9}>
            <DetailGoodsIn data={data} />
          </Grid>
          <Grid item xs={12} md={4} xl={3}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
              <ToolbarGoodsIn id={id} status={data?.status} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
