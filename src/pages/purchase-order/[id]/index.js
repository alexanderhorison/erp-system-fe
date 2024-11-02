import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
// ** Demo Components Imports
import ButtonBack from 'src/views/common/ButtonBack'
import { fetchDetailPurchaseOrder } from 'src/store/apps/purchase-order'
import ToolbarPurchaseOrder from 'src/views/purchase-order/ToolbarPurchaseOrder'
import DetailPagePurchaseOrder from 'src/views/purchase-order/DetailPagePurchaseOrder'
import { fetchAllPurchaseOrderPayment, resetPurchaseOrderPayments } from 'src/store/apps/purchase-order-payment'

import TablePaymentPurchaseOrder from 'src/views/purchase-order-payment/TablePaymentPurchaseOrder'

export default function DetailPurchaseOrder({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailPurchaseOrder: data,
    errorDetailPurchaseOrder,
    loadingDetailPurchaseOrder
  } = useSelector(state => state.purchaseOrder)

  useEffect(() => {
    if (id) {
      dispatch(resetPurchaseOrderPayments())
      dispatch(fetchDetailPurchaseOrder(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!loadingDetailPurchaseOrder && data?.status === 'APPROVED' && data?.id) {
      dispatch(fetchAllPurchaseOrderPayment(data.id))
    }
  }, [loadingDetailPurchaseOrder])

  if (errorDetailPurchaseOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Purchase Order: {id} Tidak Ditemukan. Mohon cek list surat purchase order:{' '}
            <Link href='/purchase-order'>Surat Purchase Order</Link>
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
            <DetailPagePurchaseOrder data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarPurchaseOrder id={id} data={data} />
          </Grid>
        </Grid>
        {data?.status === 'APPROVED' && data?.id && (
          <Grid container spacing={6} sx={{ mt: 2, mb: 2 }}>
            <Grid item xl={9} md={12} xs={12}>
              <TablePaymentPurchaseOrder purchaseOrderData={data} />
            </Grid>
          </Grid>
        )}
      </>
    )
  } else {
    return null
  }
}
