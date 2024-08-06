import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import { fetchDetailAdjustmentGoodsOut } from 'src/store/apps/adjustment/goods-out'
import { Box } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import DetailGoodsOut from 'src/views/adjustment/goods-out/DetailGoodsOut'
import ToolbarGoodsOut from 'src/views/adjustment/goods-out/ToolbarGoodsOut'

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
    }
  }, [id, dispatch])

  console.log(data, id)

  if (errorDetailAdjustmentGoodsOut) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Barang Keluar: {id} Tidak Ditemukan. Mohon cek list surat barang keluar:{' '}
            <Link href='/adjustment/goods-out/'>Penyesuaian Barang Keluar</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <DetailGoodsOut data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarGoodsOut id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else if (loadingDetailAdjustmentGoodsOut) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}
