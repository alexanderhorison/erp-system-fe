import { Grid } from "@mui/material"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import KeenSliderWrapper from "src/@core/styles/libs/keen-slider"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import DashboardRevenue from "src/views/dashboards/finance/DashboardRevenue"
import DashboardProfitLoss from "src/views/dashboards/finance/DashboardProfitLoss"
import DashboardProfitLossYearly from "src/views/dashboards/finance/DashboardProfitLossYearly"



export default function FinanceDashboard() {
  const dispatch = useDispatch()
  useEffect(() => {
    // dispatch()
  })
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* 1. Dashboard Revenue */}
          <Grid item xs={12} sm={12} order={1}>
            <DashboardRevenue />
          </Grid>
          {/* 2. Dashboard Profit Loss */}
          <Grid item xs={12} sm={12} order={2}>
            <DashboardProfitLoss />
          </Grid>
          {/* 3. Dashboard Profit Loss Yearly */}
          <Grid item xs={12} sm={12} order={3}>
            <DashboardProfitLossYearly />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}