import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailDeliveryOrder } from 'src/store/apps/delivery-order'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import DetailInvoice from 'src/views/delivery-order/DetailInvoice'
import ToolbarInvoice from 'src/views/delivery-order/ToolbarInvoice'
import ButtonBack from 'src/views/common/ButtonBack'

export default function DetailDeliveryOrder({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detailDeliveryOrder: data, errorDetailDeliveryOrder } = useSelector(state => state.deliveryOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailDeliveryOrder(id))
    }
  }, [id, dispatch])

  if (errorDetailDeliveryOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list surat jalan:{' '}
            <Link href='/delivery-order'>Surat Jalan</Link>
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
            <DetailInvoice data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarInvoice id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}
