import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DashboardPo1 from 'src/views/dashboards/purchase-order/DashboardPo1'
import DashboardPo2 from 'src/views/dashboards/purchase-order/DashboardPo2'
import DashboardPo3 from 'src/views/dashboards/purchase-order/DashboardPo3'
import DashboardPo4 from 'src/views/dashboards/purchase-order/DashboardPo4'
import DashboardPo6 from 'src/views/dashboards/purchase-order/DashboardPo6'
import DashboardSectionLabel from 'src/views/dashboards/common/DashboardSectionLabel'
import { fetchDashboardPurchaseOrder } from 'src/store/apps/dashboard'
import { returnFormatDate } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

// 1. DashboardPo1: Top 5 Vendor yang total nominal PO nya paling bnyk
// 2. DashboardPo2: Top 5 Vendor yang total surat PO nya paling bnyk
// 3. DashboardPo3: Top 5 Vendor yang total hutang PO nya paling bnyk
// 4. DashboardPo4: Top 5 Vendor yang total barter PO nya paling bnyk
// 6. DashboardPo6: List PO yang sudah lewat due date nya → pagination

export default function PurchaseOrderDashboard() {
  const dispatch = useDispatch()

  const { dataDashboardPurchaseOrder: data, loadingDashboardPurchaseOrder } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardPurchaseOrder({}))
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3
          }}
        >
          <Box>
            <Typography variant='h3' sx={{ color: colors.foreground }}>
              Dashboard - Purchase Order
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
              Ringkasan performa vendor dan purchase order.
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, whiteSpace: 'nowrap' }}>
            Diperbarui, {returnFormatDate(new Date())}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <ApexChartWrapper>
          <KeenSliderWrapper>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <DashboardSectionLabel title='Distribusi Performa Vendor' />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardPo1 data={data?.dashboard1} loading={loadingDashboardPurchaseOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardPo2 data={data?.dashboard2} loading={loadingDashboardPurchaseOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardPo3 data={data?.dashboard3} loading={loadingDashboardPurchaseOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardPo4 data={data?.dashboard4} loading={loadingDashboardPurchaseOrder} />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <DashboardSectionLabel title='List PO Melewati Batas Waktu' />
              </Grid>
              <Grid item xs={12}>
                <DashboardPo6 />
              </Grid>
            </Grid>
          </KeenSliderWrapper>
        </ApexChartWrapper>
      </Grid>
    </Grid>
  )
}
