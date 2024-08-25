import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import { Box } from '@mui/system'
import { CircularProgress, Typography } from '@mui/material'
import { fetchDetailInternalTransfer } from 'src/store/apps/internal-transfer'
import ToolbarInternalTransfer from 'src/views/internalTransfer/ToolbarInternalTransfer'
import PageDetailInternalTransfer from 'src/views/internalTransfer/PageDetailInternalTransfer'
DetailInternalTransfer
export default function DetailInternalTransfer({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailInternalTransfer: data,
    errorDetailInternalTransfer,
    loadingDetailInternalTransfer
  } = useSelector(state => state.internalTransfer)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailInternalTransfer(id))
    }
  }, [id, dispatch])

  if (errorDetailInternalTransfer) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Internal Transfer: {id} Tidak Ditemukan. Mohon cek list surat internal transfer:{' '}
            <Link href='/internal-transfer'>Surat Internal Transfer</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PageDetailInternalTransfer data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarInternalTransfer id={id} status={data?.status} />
          </Grid>
        </Grid>
      </>
    )
  } else if (loadingDetailInternalTransfer) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}
