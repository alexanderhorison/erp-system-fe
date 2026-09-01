import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

// ** Store Imports
import { fetchDetailProcessRequestOrder } from 'src/store/apps/product-request-order'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import ViewDetailProductRequest from 'src/views/product-request/ViewDetailProductRequest'
import ToolbarProductRequest from 'src/views/product-request/ToolbarProductRequest'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

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
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Produk Request: {id} Tidak Ditemukan. Mohon cek list Produk Request:{' '}
            <Link href='/product-request'>Product Request</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!detailProcessRequestOrder) return null

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Surat Product Request'
          subtitle={detailProcessRequestOrder?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Product Request', href: '/product-request' },
            { label: detailProcessRequestOrder?.code || 'Detail' }
          ]}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8.5}>
            <ViewDetailProductRequest data={detailProcessRequestOrder} />
          </Grid>
          <Grid item xs={12} lg={3.5}>
            <ToolbarProductRequest id={id} data={detailProcessRequestOrder} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
