import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import { CircularProgress, Typography } from '@mui/material'
import ReceiveDelivery from 'src/views/receive-order/ReceiveDelivery'
import { Box } from '@mui/system'
import { fetchDetailDeliveryOrder } from 'src/store/apps/delivery-order'

export default function AddDetailReceiveOrder({}) {
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
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  } else if (errorDetailDeliveryOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list penerimaan surat jalan:{' '}
            <Link href='/delivery-order-receive/add'>List Surat Jalan</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (Object.keys(data).length > 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography paddingY={3} fontSize={20}>
            Form Penerimaan surat jalan
          </Typography>
          <Typography marginBottom={3} fontSize={15}>
            Kode Surat: {id}
          </Typography>
          {data.code ? (
            <ReceiveDelivery data={data} />
          ) : (
            <>
              <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Loading...</Typography>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}
