import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailDeliveryOrder } from 'src/store/apps/delivery-order'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import DetailInvoice from 'src/views/delivery-order/DetailInvoice'
import ToolbarInvoice from 'src/views/delivery-order/ToolbarInvoice'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function DetailDeliveryOrder() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailDeliveryOrder: data,
    loadingDetailDeliveryOrder,
    errorDetailDeliveryOrder
  } = useSelector(state => state.deliveryOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailDeliveryOrder(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (loadingDetailDeliveryOrder) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (errorDetailDeliveryOrder) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list surat jalan:{' '}
            <Link href='/delivery-order'>Surat Jalan</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!data) return null

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Surat Jalan'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Surat Jalan', href: '/delivery-order' },
            { label: data?.code || 'Detail' }
          ]}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8.5}>
            <DetailInvoice data={data} />
          </Grid>
          <Grid item xs={12} lg={3.5}>
            <ToolbarInvoice id={id} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
