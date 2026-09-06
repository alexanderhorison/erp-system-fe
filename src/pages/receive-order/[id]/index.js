import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import ToolbarReceive from 'src/views/receive-order/ToolbarReceive'
import { fetchDetailReceiveOrder } from 'src/store/apps/receive-order'
import DetailReceiveOrder from 'src/views/receive-order/DetailReceiveOrder'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function ReceiveOrder() {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id

  const {
    detailReceiveOrder: data,
    loadingDetailReceiveOrder,
    errorDetailReceiveOrder
  } = useSelector(state => state.receiveOrder)

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailReceiveOrder(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (loadingDetailReceiveOrder) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (errorDetailReceiveOrder) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Surat Jalan: {id} Tidak Ditemukan. Mohon cek list penerimaan surat jalan:{' '}
            <Link href='/receive-order'>Penerimaan Surat Jalan</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!data) return null

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Penerimaan Surat Jalan'
          subtitle={data?.codeReceipt}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Penerimaan Surat Jalan', href: '/receive-order' },
            { label: data?.codeReceipt || 'Detail' }
          ]}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8.5}>
            <DetailReceiveOrder data={data} />
          </Grid>
          <Grid item xs={12} lg={3.5}>
            <ToolbarReceive id={id} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
