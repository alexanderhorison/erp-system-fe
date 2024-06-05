import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'
import PreviewActions from 'src/views/apps/invoice/preview/PreviewActions'
import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
import SendInvoiceDrawer from 'src/views/apps/invoice/shared-drawer/SendInvoiceDrawer'
import DetailInvoice from 'src/views/delivery-order/DetailInvoice'
import ToolbarReceive from 'src/views/receive-order/ToolbarReceive'
import { fetchDetailReceiveOrder } from 'src/store/apps/receive-order'

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
            <DetailInvoice data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarReceive id={id} status={data?.status} />
            {/* <PreviewActions
              id={id}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
            /> */}
          </Grid>
        </Grid>
        {/* <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} /> */}
        {/* <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
      </>
    )
  } else {
    return null
  }
}
