import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
// ** Demo Components Imports
import { fetchDetailPointOfSale } from 'src/store/apps/pos'
import GeneratePdfPrintOfSale from 'src/views/point-of-sale/transaction/GeneratePdfPrintOfSale'

const PrintPointOfSale = ({ id }) => {
  const dispatch = useDispatch()

  const { detailPointOfSale: data, errorDetailPointOfSale, loadingDetailPointOfSale } = useSelector(state => state.pos)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailPointOfSale(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (data?.code === id) {
      setTimeout(() => {
        window.print()
      }, 200)
    }
  }, [loadingDetailPointOfSale])

  if (errorDetailPointOfSale) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Point of sale: {id} Tidak Ditemukan. Mohon cek list point of sale:{' '}
            <Link href='/point-of-sale'>Point of Sale</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    return <GeneratePdfPrintOfSale id={id} data={data} />
  } else if (loadingDetailPointOfSale) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default PrintPointOfSale
