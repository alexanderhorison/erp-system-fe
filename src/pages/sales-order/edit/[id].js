import { Alert, CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import ButtonBack from 'src/views/common/ButtonBack'
import EditSalesOrderPage from 'src/views/sales-order/EditSalesOrder'

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
  console.log(data)

  if (loadingDetailSalesOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  } else if (errorDetailSalesOrder) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Sales Order: {id} Tidak Ditemukan. Mohon cek list sales order:{' '}
              <Link href='/sales-order'>Sales Order</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else if (Object.keys(data).length > 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ButtonBack paddingY={3} name='Form Edit Sales Order' />
          <Typography marginBottom={3} fontSize={15}>
            Sales Order: {id}
          </Typography>
          {data.code ? (
            <EditSalesOrderPage data={data} salesOrderCode={id} />
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
  }
}
