import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
// ** Demo Components Imports
import ButtonBack from 'src/views/common/ButtonBack'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import ToolbarSalesOrder from 'src/views/sales-order/ToolbarSalesOrder'
import DetailPageSalesOrder from 'src/views/sales-order/DetailPageSalesOrder'

export default function DetailSalesOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const { detailSalesOrder: data, errorDetailSalesOrder } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailSalesOrder(id))
    }
  }, [id, dispatch])

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
            <ToolbarSalesOrder id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}
