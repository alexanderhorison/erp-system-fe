import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import { fetchDetailReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'
import ToolbarReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/TollbarReceiptOrderOutstanding'
import DetailReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/DetailReceiptOrderOutstanding'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

export default function ReceiptOrderOutstandingDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const code = router.query.code
  const [data, setData] = useState({})

  const { detail, loadingDetail, errorDetail } = useSelector(state => state.deliveryOrderReceiptOutstanding)

  useEffect(() => {
    if (code) {
      dispatch(fetchDetailReceiptOrderOutstanding({ code }))
      dispatch(fetchCompanyInfo())
    }
  }, [code, dispatch])

  useEffect(() => {
    if (detail) {
      setData(detail)
    }
  }, [detail])

  if (loadingDetail) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (errorDetail) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Surat Outstanding: {code} Tidak Ditemukan. Mohon cek list surat outstanding produk:{' '}
            <Link href='/receipt-order-outstanding'>Surat Outstanding Produk</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!detail) return null

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Surat Outstanding Produk'
          subtitle={detail?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Surat Outstanding Produk', href: '/receipt-order-outstanding' },
            { label: detail?.code || 'Detail' }
          ]}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8.5}>
            <DetailReceiptOrderOutstanding data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} lg={3.5}>
            <ToolbarReceiptOrderOutstanding id={code} status={detail?.status} data={data} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
