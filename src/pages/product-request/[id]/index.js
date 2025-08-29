import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { fetchDetailProcessRequestOrder } from 'src/store/apps/product-request-order'
import ViewDetailProductRequest from 'src/views/product-request/ViewDetailProductRequest'
import ButtonBack from 'src/views/common/ButtonBack'
import { Alert, CircularProgress, Grid } from '@mui/material'

export default function DetailProductRequest({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detailProcessRequestOrder, loadingDetailProcessRequestOrder, errorDetailProcessRequestOrder } = useSelector(
    state => state.productRequest
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailProcessRequestOrder(id))
    }
  }, [id, dispatch])

  if (loadingDetailProcessRequestOrder) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (errorDetailProcessRequestOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Produk Request: {id} Tidak Ditemukan. Mohon cek list Produk Request:{' '}
            <Link href='/product-request'>Product Request</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (detailProcessRequestOrder) {
    return (
      <>
        <Grid container spacing={6}>
          <ButtonBack paddingY={0} />
          <Grid item xl={12} md={12} xs={12}>
            <ViewDetailProductRequest data={detailProcessRequestOrder} />
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}
