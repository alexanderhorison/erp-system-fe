import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import ToolbarReceive from 'src/views/receive-order/ToolbarReceive'
import { fetchDetailReceiveOrder } from 'src/store/apps/receive-order'
import DetailReceiveOrder from 'src/views/receive-order/DetailReceiveOrder'

export default function ReceiveOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detailReceiveOrder: data, errorDetailReceiveOrder } = useSelector(state => state.receiveOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailReceiveOrder(id))
    }
  }, [id, dispatch])

  if (errorDetailReceiveOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list penerimaan surat jalan:{' '}
            <Link href='/delivery-order-receive'>Penerimaan Surat Jalan</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <DetailReceiveOrder data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarReceive id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}
