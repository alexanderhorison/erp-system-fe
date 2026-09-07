import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import CustomTab from 'src/views/common/CustomTab'
import { fetchDetailPurchaseOrder } from 'src/store/apps/purchase-order'
import ToolbarPurchaseOrder from 'src/views/purchase-order/ToolbarPurchaseOrder'
import DetailPagePurchaseOrder from 'src/views/purchase-order/DetailPagePurchaseOrder'
import { fetchAllPurchaseOrderPayment, resetPurchaseOrderPayments } from 'src/store/apps/purchase-order-payment'

import TablePaymentPurchaseOrder from 'src/views/purchase-order-payment/TablePaymentPurchaseOrder'
import TableTermsOfPayment from 'src/views/purchase-order/terms-of-payment/TableTermsOfPayment'
import { fetchAllTermsOfPaymentByCode } from 'src/store/apps/purchase-order/terms-of-payment'

// ** Design Tokens
import { radii } from 'src/configs/designTokens'

const tabList = [
  { label: 'Tagihan', value: 'tagihan', icon: 'tabler:file-invoice' },
  { label: 'Pembayaran', value: 'pembayaran', icon: 'tabler:credit-card' }
]

export default function DetailPurchaseOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const [activeTab, setActiveTab] = useState('tagihan')

  const {
    detailPurchaseOrder: data,
    errorDetailPurchaseOrder,
    loadingDetailPurchaseOrder
  } = useSelector(state => state.purchaseOrder)

  useEffect(() => {
    if (id) {
      dispatch(resetPurchaseOrderPayments())
      dispatch(fetchDetailPurchaseOrder(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!loadingDetailPurchaseOrder && data?.status === 'APPROVED' && data?.id) {
      dispatch(fetchAllPurchaseOrderPayment(data.id))
      dispatch(fetchAllTermsOfPaymentByCode({ purchaseOrderCode: data.code }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDetailPurchaseOrder])

  if (errorDetailPurchaseOrder) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ borderRadius: `${radii.lg}px` }}>
            Surat Purchase Order: {id} Tidak Ditemukan. Mohon cek list surat purchase order:{' '}
            <Link href='/purchase-order'>Surat Purchase Order</Link>
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
          title='Purchase Order Details'
          subtitle={data?.code}
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Purchase Order', href: '/purchase-order' },
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
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TablePaymentPurchaseOrder purchaseOrderData={data} />
                </Grid>
                <Grid item xs={12}>
                  <TableTermsOfPayment purchaseOrderData={data} />
                </Grid>
              </Grid>
            ) : (
              <DetailPagePurchaseOrder data={data} />
            )}
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <ToolbarPurchaseOrder id={id} data={data} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
