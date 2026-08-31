import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'

import { fetchDetailInternalTransfer } from 'src/store/apps/internal-transfer'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

import PageDetailInternalTransfer from 'src/views/internalTransfer/PageDetailInternalTransfer'
import ToolbarInternalTransfer from 'src/views/internalTransfer/ToolbarInternalTransfer'
import PageHeader from 'src/views/common/PageHeader'

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
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (errorDetailInternalTransfer) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Internal Transfer: {id} Tidak Ditemukan. Mohon cek list surat internal transfer:{' '}
            <Link href='/internal-transfer/'>Surat Internal Transfer</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  // ** Skeletons hold the two-column shape while the detail resolves, rather
  // than collapsing the page to a centred spinner.
  if (loadingDetailInternalTransfer || !data) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Skeleton variant='text' width={240} height={38} />
          <Skeleton variant='text' width={140} height={22} sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} xl={9}>
              <Skeleton variant='rounded' height={520} />
            </Grid>
            <Grid item xs={12} md={4} xl={3}>
              <Skeleton variant='rounded' height={150} />
              <Skeleton variant='rounded' height={140} sx={{ mt: 4 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Surat Internal Transfer'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Inventory' },
            { label: 'Stock Management' },
            { label: 'Internal Transfer', href: '/internal-transfer' },
            { label: data?.code || 'Detail' }
          ]}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8} xl={9}>
            <PageDetailInternalTransfer data={data} />
          </Grid>
          <Grid item xs={12} md={4} xl={3}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
              <ToolbarInternalTransfer id={id} status={data?.status} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
