import { Alert, CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import EditSalesOrderPage from 'src/views/sales-order/EditSalesOrder'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function EditSalesOrder() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const {
    detailSalesOrder: data,
    errorDetailSalesOrder,
    loadingDetailSalesOrder
  } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailSalesOrder(id))
    }
  }, [id, dispatch])

  if (loadingDetailSalesOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  } else if (errorDetailSalesOrder) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Sales Order: {id} Tidak Ditemukan. Mohon cek list sales order:{' '}
            <Link href='/sales-order'>Sales Order</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (Object.keys(data).length > 0) {
    if (!data.code) {
      return (
        <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
          <CircularProgress />
        </Grid>
      )
    }
    return (
      <Grid container>
        <Grid item xs={12}>
          <EditSalesOrderPage data={data} salesOrderCode={id} />
        </Grid>
      </Grid>
    )
  }
}
