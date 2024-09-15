import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import { Box } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import { fetchDetailAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import DetailGoodsIn from 'src/views/adjustment/goods-in/DetailGoodsIn'
import ToolbarGoodsIn from 'src/views/adjustment/goods-in/ToolbarGoodsIn'
import ButtonBack from 'src/views/common/ButtonBack'

export default function DetailAdjustmentGoodsIn({ }) {
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
    }
  }, [id, dispatch])

  if (errorDetailAdjustmentGoodsIn) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Barang Masuk: {id} Tidak Ditemukan. Mohon cek list surat barang masuk:{' '}
            <Link href='/adjustment/goods-in/'>Penyesuaian Barang Masuk</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <ButtonBack paddingY={0} />
          <Grid item xl={9} md={8} xs={12}>
            <DetailGoodsIn data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarGoodsIn id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else if (loadingDetailAdjustmentGoodsIn) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}
