import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import { fetchDashboardSummaryCustomer } from 'src/store/apps/dashboard'
import { fetchMasterDataCustomerDetail } from 'src/store/apps/master/customer'
import PageHeader from 'src/views/common/PageHeader'
import SectionHeading from 'src/views/common/SectionHeading'
import DetailCustomer from 'src/views/master/customer/DetailCustomer'
import SummaryCustomer from 'src/views/master/customer/SummaryCustomer'
import TablePosCustomer from 'src/views/master/customer/TablePosCustomer'
import TableSalesOrderCustomer from 'src/views/master/customer/TableSalesOrderCustomer'

export default function DetailMasterCustomer() {
  const dispatch = useDispatch()
  const router = useRouter()
  const query = router.query

  const { loadingDetail, detail: detailCustomer } = useSelector(state => state.masterCustomer)

  useEffect(() => {
    if (query?.id) {
      dispatch(fetchMasterDataCustomerDetail(query.id))
      dispatch(fetchDashboardSummaryCustomer({ id: query.id }))
    }
  }, [query.id, dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='View Detail Customer'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Sales Order' },
            { label: 'Data Customer' },
            { label: 'Customer', href: '/master/customer' },
            { label: detailCustomer?.name || 'Detail' }
          ]}
        />

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DetailCustomer data={detailCustomer} loading={loadingDetail} />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading number={2} title='Ringkasan Customer' />
            <SummaryCustomer />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading
              number={3}
              title={detailCustomer?.isPosCustomer ? 'Riwayat Transaksi POS' : 'Riwayat Sales Order'}
            />
            {detailCustomer?.isPosCustomer ? (
              <TablePosCustomer customerName={detailCustomer?.name} />
            ) : (
              <TableSalesOrderCustomer customerName={detailCustomer?.name} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
