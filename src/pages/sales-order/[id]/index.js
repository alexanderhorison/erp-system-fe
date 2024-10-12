import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector, redu } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
// ** Demo Components Imports
import ButtonBack from 'src/views/common/ButtonBack'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import ToolbarSalesOrder from 'src/views/sales-order/ToolbarSalesOrder'
import DetailPageSalesOrder from 'src/views/sales-order/DetailPageSalesOrder'
import { fetchAllSalesOrderPayment, resetSalesOrderPayments } from 'src/store/apps/sales-order-payment'
import TablePayment from 'src/views/sales-order-payment/TablePayment'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { priceFormat } from 'src/helpers/priceFormatter'

export default function DetailSalesOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailSalesOrder: data,
    errorDetailSalesOrder,
    loadingDetailSalesOrder
  } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (id) {
      dispatch(resetSalesOrderPayments())
      dispatch(fetchDetailSalesOrder(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!loadingDetailSalesOrder && data?.status === 'APPROVED' && data?.id) {
      dispatch(fetchAllSalesOrderPayment(data.id))
    }
  }, [loadingDetailSalesOrder])

  if (errorDetailSalesOrder) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Sales Order: {id} Tidak Ditemukan. Mohon cek list surat sales order:{' '}
            <Link href='/sales-order'>Surat Sales Order</Link>
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
            <DetailPageSalesOrder data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarSalesOrder id={id} data={data} />
          </Grid>
        </Grid>
        {data?.status === 'APPROVED' && data?.id && (
          <Grid container spacing={6} sx={{ mt: 2, mb: 2 }}>
            <Grid item xl={9} md={12} xs={12}>
              <TablePayment salesOrderData={data} />
            </Grid>
          </Grid>
        )}
      </>
    )
  } else {
    return null
  }
}
