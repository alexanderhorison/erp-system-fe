import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import { fetchDetailReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'
import ToolbarReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/TollbarReceiptOrderOutstanding'
import DetailReceiptOrderOutstanding from 'src/views/receipt-order-outstanding/DetailReceiptOrderOutstanding'
import { Box, IconButton, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import ButtonBack from 'src/views/common/ButtonBack'

export default function ReceiveOrder({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const code = router.query.code
  const [data, setData] = useState({})

  const { detail, errorDetail, loadingDetail } = useSelector(state => state.deliveryOrderReceiptOutstanding)

  useEffect(() => {
    if (code) {
      dispatch(fetchDetailReceiptOrderOutstanding({ code }))
    }
  }, [code, dispatch])

  useEffect(() => {
    if (detail) {
      setData(detail)
    }
  }, [detail])

  const goBack = () => {
    router.back()
  }

  if (errorDetail) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Surat Jalan Outstanding: {code} Tidak Ditemukan. Mohon cek list penerimaan surat jalan outstanding:{' '}
            <Link href='/receipt-order-outstanding'>Penerimaan Surat Jalan Outstanding</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else if (detail) {
    return (
      <>
        <Grid container spacing={6}>
          <ButtonBack paddingY={0} />
          <Grid item xl={9} md={8} xs={12}>
            <DetailReceiptOrderOutstanding data={data} setData={setData} />
          </Grid>
          <Grid item xl={3} md={4} xs={12} spacing={6}>
            <ToolbarReceiptOrderOutstanding id={code} status={detail?.status} data={data} />
          </Grid>
        </Grid>
      </>
    )
  } else {
    return null
  }
}
