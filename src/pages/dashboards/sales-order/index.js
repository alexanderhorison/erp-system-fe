import { useDispatch, useSelector } from 'react-redux'
// ** MUI Import
import Grid from '@mui/material/Grid'
// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useEffect, useState } from 'react'
import DashboardSo1 from 'src/views/dashboards/sales-order/DashboardSo1'
import DashboardSo2 from 'src/views/dashboards/sales-order/DashboardSo2'
import DashboardSo3 from 'src/views/dashboards/sales-order/DashboardSo3'
import DashboardSo4 from 'src/views/dashboards/sales-order/DashboardSo4'
// import DashboardSo5 from 'src/views/dashboards/sales-order/DashboardSo5'
import DashboardSo6 from 'src/views/dashboards/sales-order/DashboardSo6'
import { fetchDashboardSalesOrder } from 'src/store/apps/dashboard'

// 1. DashboardSo1: Top 5 Customer yang total nominal SO nya paling bnyk
// 2. DashboardSo2: Top 5 Customer yang total surat SO nya paling bnyk
// 3. DashboardSo3: Top 5 Customer yang total hutang SO nya paling bnyk
// 4. DashboardSo4: Top 5 Customer yang total barter SO nya paling bnyk
// 5. DashboardSo5: Grafik x = date , y = nominal SO per gudang
// 6. DashboardSo6: List 10 SO yang sudah lewat due date nya → pagination

export default function SalesOrderDashboard() {
  const dispatch = useDispatch()

  const { dataDashboardSalesOrder: data, loadingDashboardSalesOrder, errorDashboardSalesOrder } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardSalesOrder({}))
  }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* 1. Top 5 Customer yang total nominal SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={1}>
            <DashboardSo1 data={data?.dashboard1} />
          </Grid>
          {/* 2. Top 5 Customer yang total surat SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardSo2 data={data?.dashboard2} />
          </Grid>
          {/* 3. Top 5 Customer yang total hutang SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardSo3 data={data?.dashboard3} />
          </Grid>
          {/* 4. Top 5 Customer yang total barter SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardSo4 data={data?.dashboard4} />
          </Grid>
          {/* 5. Grafik x = date , y = nominal SO per gudang*/}
          {/* <Grid item xs={12} sm={12} order={2}>
            <DashboardSo5 data={data} />
          </Grid> */}
          {/* 6. List 10 SO yang sudah lewat due date nya → pagination*/}
          <Grid item xs={12} sm={12} order={2}>
            <DashboardSo6 data={data} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}