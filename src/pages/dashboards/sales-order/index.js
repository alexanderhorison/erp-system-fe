import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DashboardSo1 from 'src/views/dashboards/sales-order/DashboardSo1'
import DashboardSo2 from 'src/views/dashboards/sales-order/DashboardSo2'
import DashboardSo3 from 'src/views/dashboards/sales-order/DashboardSo3'
import DashboardSo4 from 'src/views/dashboards/sales-order/DashboardSo4'
import DashboardSo6 from 'src/views/dashboards/sales-order/DashboardSo6'
import DashboardSectionLabel from 'src/views/dashboards/common/DashboardSectionLabel'
import { fetchDashboardSalesOrder } from 'src/store/apps/dashboard'
import { returnFormatDate } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

// 1. DashboardSo1: Top 5 Customer yang total nominal SO nya paling bnyk
// 2. DashboardSo2: Top 5 Customer yang total surat SO nya paling bnyk
// 3. DashboardSo3: Top 5 Customer yang total hutang SO nya paling bnyk
// 4. DashboardSo4: Top 5 Customer yang total barter SO nya paling bnyk
// 6. DashboardSo6: List SO yang sudah lewat due date nya → pagination

export default function SalesOrderDashboard() {
  const dispatch = useDispatch()

  const { dataDashboardSalesOrder: data, loadingDashboardSalesOrder } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardSalesOrder({}))
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
              Dashboard - Sales Order
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
              Ringkasan performa customer dan sales order.
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
                <DashboardSectionLabel title='Distribusi Performa Customer' />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardSo1 data={data?.dashboard1} loading={loadingDashboardSalesOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardSo2 data={data?.dashboard2} loading={loadingDashboardSalesOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardSo3 data={data?.dashboard3} loading={loadingDashboardSalesOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DashboardSo4 data={data?.dashboard4} loading={loadingDashboardSalesOrder} />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <DashboardSectionLabel title='List SO Melewati Batas Waktu' />
              </Grid>
              <Grid item xs={12}>
                <DashboardSo6 />
              </Grid>
            </Grid>
          </KeenSliderWrapper>
        </ApexChartWrapper>
      </Grid>
    </Grid>
  )
}
