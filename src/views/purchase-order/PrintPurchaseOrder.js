// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// ** Configs
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { fetchDetailPurchaseOrder } from 'src/store/apps/purchase-order'
import GeneratePdfPurchaseOrder from './GeneratePdfPurchaseOrder'

const PrintPurchaseOrder = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  const {
    detailPurchaseOrder: data,
    errorDetailPurchaseOrder,
    loadingDetailPurchaseOrder
  } = useSelector(state => state.purchaseOrder)

  useEffect(() => {
    if (data?.code === id) {
      setTimeout(() => {
        window.print()
      }, 200)
    }
  }, [loadingDetailPurchaseOrder])

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailPurchaseOrder(id))
    }
  }, [id, dispatch])

  if (data) {
    return <GeneratePdfPurchaseOrder id={id} data={data} />
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
  } else if (loadingDetailPurchaseOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default PrintPurchaseOrder
