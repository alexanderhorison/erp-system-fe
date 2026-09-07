import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailPurchaseOrder } from 'src/store/apps/purchase-order'
import EditPurchaseOrderPage from 'src/views/purchase-order/EditPurchaseOrder'
import useCollapsedSidebar from 'src/hooks/useCollapsedSidebar'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function EditPurchaseOrder() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  useCollapsedSidebar()

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
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Purchase Order: {id} Tidak Ditemukan. Mohon cek list purchase order:{' '}
            <Link href='/purchase-order'>Purchase Order</Link>
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
          <EditPurchaseOrderPage data={data} purchaseOrderCode={id} />
        </Grid>
      </Grid>
    )
  }
}
