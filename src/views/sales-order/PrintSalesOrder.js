// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'

// ** Configs
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import GeneratePdfSalesOrder from './GeneratePdfSalesOrder'

export const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const PrintSalesOrder = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  const {
    detailSalesOrder: data,
    errorDetailSalesOrder,
    loadingDetailSalesOrder
  } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (data?.code === id) {
      setTimeout(() => {
        window.print()
      }, 200)
    }
  }, [loadingDetailSalesOrder])

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailSalesOrder(id))
    }
  }, [id, dispatch])

  if (data) {
    return <GeneratePdfSalesOrder id={id} data={data} />
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
  } else if (loadingDetailSalesOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default PrintSalesOrder
