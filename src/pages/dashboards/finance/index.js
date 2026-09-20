import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import KeenSliderWrapper from "src/@core/styles/libs/keen-slider"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import DashboardRevenue from "src/views/dashboards/finance/DashboardRevenue"
import DashboardProfitLoss from "src/views/dashboards/finance/DashboardProfitLoss"
import DashboardProfitLossYearly from "src/views/dashboards/finance/DashboardProfitLossYearly"
import { returnFormatDate } from 'src/helpers/formatDate'
import { colors } from 'src/configs/designTokens'


export default function FinanceDashboard() {
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
              Dashboard - Finance
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
              Ringkasan pendapatan, biaya, dan laba rugi perusahaan.
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
                <DashboardRevenue />
              </Grid>
              <Grid item xs={12}>
                <DashboardProfitLoss />
              </Grid>
              <Grid item xs={12}>
                <DashboardProfitLossYearly />
              </Grid>
            </Grid>
          </KeenSliderWrapper>
        </ApexChartWrapper>
      </Grid>
    </Grid>
  )
}
