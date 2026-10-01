import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import CustomTab from 'src/views/common/CustomTab'
import { fetchDetailSalesOrder } from 'src/store/apps/sales-order'
import ToolbarSalesOrder from 'src/views/sales-order/ToolbarSalesOrder'
import DetailPageSalesOrder from 'src/views/sales-order/DetailPageSalesOrder'
import { fetchAllSalesOrderPayment, resetSalesOrderPayments } from 'src/store/apps/sales-order-payment'
import TablePayment from 'src/views/sales-order-payment/TablePayment'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

const tabList = [
  { label: 'Tagihan', value: 'tagihan', icon: 'tabler:file-invoice' },
  { label: 'Pembayaran', value: 'pembayaran', icon: 'tabler:credit-card' }
]

export default function DetailSalesOrder({ }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const [activeTab, setActiveTab] = useState('tagihan')

  const {
    detailSalesOrder: data,
    errorDetailSalesOrder,
    loadingDetailSalesOrder
  } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (id) {
      dispatch(resetSalesOrderPayments())
      dispatch(fetchDetailSalesOrder(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!loadingDetailSalesOrder && data?.status === 'APPROVED' && data?.id) {
      dispatch(fetchAllSalesOrderPayment(data.id))
    }
  }, [loadingDetailSalesOrder])

  if (loadingDetailSalesOrder) {
    return (
      <Grid container justifyContent='center' alignItems='center' sx={{ height: '50vh' }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (errorDetailSalesOrder) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii['3xl']}px` }}>
            Surat Sales Order: {id} Tidak Ditemukan. Mohon cek list surat sales order:{' '}
            <Link href='/sales-order'>Surat Sales Order</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  }

  if (!data) return null

  const showPaymentTab = data?.status === 'APPROVED' && data?.id

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='Sales Order Details'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Sales Order', href: '/sales-order' },
            { label: data?.code || 'Detail' }
          ]}
        />

        {showPaymentTab && (
          <Grid container sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <CustomTab tabContentList={tabList} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={4}>
          <Grid item xl={9} md={8} xs={12}>
            {showPaymentTab && activeTab === 'pembayaran' ? (
              <TablePayment salesOrderData={data} />
            ) : (
              <DetailPageSalesOrder data={data} />
            )}
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarSalesOrder id={id} data={data} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
