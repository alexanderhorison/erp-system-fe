import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'

import { fetchDetailAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

import DetailGoodsOut from 'src/views/adjustment/goods-out/DetailGoodsOut'
import ToolbarGoodsOut from 'src/views/adjustment/goods-out/ToolbarGoodsOut'
import PageHeader from 'src/views/common/PageHeader'

export default function DetailAdjustmentGoodsOut({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailAdjustmentGoodsOut: data,
    errorDetailAdjustmentGoodsOut,
    loadingDetailAdjustmentGoodsOut
  } = useSelector(state => state.adjustmentGoodsOut)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailAdjustmentGoodsOut(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (errorDetailAdjustmentGoodsOut) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Barang Keluar: {id} Tidak Ditemukan. Mohon cek list surat barang keluar:{' '}
            <Link href='/adjustment/goods-out/'>Penyesuaian Barang Keluar</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  // ** Skeletons hold the two-column shape while the detail resolves, rather
  // than collapsing the page to a centred spinner.
  if (loadingDetailAdjustmentGoodsOut || !data) {
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
          title='Surat Barang Keluar'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Adjustment' },
            { label: 'Barang Keluar', href: '/adjustment/goods-out' },
            { label: data?.code || 'Detail' }
          ]}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8} xl={9}>
            <DetailGoodsOut data={data} />
          </Grid>
          <Grid item xs={12} md={4} xl={3}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
              <ToolbarGoodsOut id={id} status={data?.status} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
