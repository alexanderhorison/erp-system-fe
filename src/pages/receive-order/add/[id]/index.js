import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import ReceiveDelivery from 'src/views/receive-order/ReceiveDelivery'
import { fetchDetailDeliveryOrder } from 'src/store/apps/delivery-order'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function AddDetailReceiveOrder() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailDeliveryOrder: data,
    errorDetailDeliveryOrder,
    loadingDetailDeliveryOrder
  } = useSelector(state => state.deliveryOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailDeliveryOrder(id))
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
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list penerimaan surat jalan:{' '}
            <Link href='/receive-order/add'>List Surat Jalan</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!data || Object.keys(data).length === 0 || !data.code) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <ReceiveDelivery data={data} />
      </Grid>
    </Grid>
  )
}
