import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import { fetchMasterDataVendorDetail } from 'src/store/apps/master/vendor'
import useCollapsedSidebar from 'src/hooks/useCollapsedSidebar'
import PageHeader from 'src/views/common/PageHeader'
import SectionHeading from 'src/views/common/SectionHeading'
import DetailVendor from 'src/views/master/vendor/DetailVendor'
import SummaryVendor from 'src/views/master/vendor/SummaryVendor'
import TablePurchaseOrderVendor from 'src/views/master/vendor/TablePurchaseOrderVendor'

export default function DetailMasterVendor() {
  const dispatch = useDispatch()
  const router = useRouter()
  const query = router.query

  const { loadingDetail, detail: detailVendor } = useSelector(state => state.masterVendor)

  // The two-column layout (vendor info + summary + history table) needs the
  // extra width, so collapse the sidebar while this page is open.
  useCollapsedSidebar()

  useEffect(() => {
    if (query?.id) {
      dispatch(fetchMasterDataVendorDetail(query.id))
    }
  }, [query.id, dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title='View Detail Vendor'
          onBack={() => router.back()}
          breadcrumbs={[
            { label: 'Purchase Order' },
            { label: 'Data Vendor' },
            { label: 'Vendor', href: '/master/vendor' },
            { label: detailVendor?.name || 'Detail' }
          ]}
        />

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DetailVendor data={detailVendor} loading={loadingDetail} />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading number={2} title='Ringkasan Vendor' />
            <SummaryVendor />
          </Grid>

          <Grid item xs={12}>
            <SectionHeading number={3} title='Riwayat Purchase Order' />
            <TablePurchaseOrderVendor vendorName={detailVendor?.name} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
