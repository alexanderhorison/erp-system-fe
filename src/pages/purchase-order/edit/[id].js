import { Alert, CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailPurchaseOrder } from 'src/store/apps/purchase-order'
import ButtonBack from 'src/views/common/ButtonBack'
import EditPurchaseOrderPage from 'src/views/purchase-order/EditPurchaseOrder'

export default function EditPurchaseOrder() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const {
    detailPurchaseOrder: data,
    errorDetailPurchaseOrder,
    loadingDetailPurchaseOrder
  } = useSelector(state => state.purchaseOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailPurchaseOrder(id))
    }
  }, [id, dispatch])

  if (loadingDetailPurchaseOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  } else if (errorDetailPurchaseOrder) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Purchase Order: {id} Tidak Ditemukan. Mohon cek list purchase order:{' '}
              <Link href='/purchase-order'>Purchase Order</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else if (Object.keys(data).length > 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ButtonBack paddingY={3} name='Form Edit Purchase Order' />
          <Typography marginBottom={3} fontSize={15}>
            Purchase Order: {id}
          </Typography>
          {data.code ? (
            <EditPurchaseOrderPage data={data} purchaseOrderCode={id} />
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
