import { useDispatch, useSelector } from 'react-redux'
// ** MUI Import
import Grid from '@mui/material/Grid'
// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useEffect, useState } from 'react'
import DashboardPo1 from 'src/views/dashboards/purchase-order/DashboardPo1'
import DashboardPo2 from 'src/views/dashboards/purchase-order/DashboardPo2'
import DashboardPo3 from 'src/views/dashboards/purchase-order/DashboardPo3'
import DashboardPo4 from 'src/views/dashboards/purchase-order/DashboardPo4'
// import DashboardPo5 from 'src/views/dashboards/purchase-order/DashboardPo5'
import DashboardPo6 from 'src/views/dashboards/purchase-order/DashboardPo6'
import { fetchDashboardPurchaseOrder } from 'src/store/apps/dashboard'

// 1. DashboardPo1: Top 5 Vendor yang total nominal SO nya paling bnyk
// 2. DashboardPo2: Top 5 Vendor yang total surat SO nya paling bnyk
// 3. DashboardPo3: Top 5 Vendor yang total hutang SO nya paling bnyk
// 4. DashboardPo4: Top 5 Vendor yang total barter SO nya paling bnyk
// 5. DashboardPo5: Grafik x = date , y = nominal SO per gudang
// 6. DashboardPo6: List 10 SO yang sudah lewat due date nya → pagination

export default function PurchaseOrderDashboard() {
  const dispatch = useDispatch()

  const { dataDashboardPurchaseOrder: data, loadingDashboardPurchaseOrder, errorDashboardPurchaseOrder } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardPurchaseOrder({}))
  }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* 1. Top 5 Vendor yang total nominal SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={1}>
            <DashboardPo1 data={data?.dashboard1} />
          </Grid>
          {/* 2. Top 5 Vendor yang total surat SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardPo2 data={data?.dashboard2} />
          </Grid>
          {/* 3. Top 5 Vendor yang total hutang SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardPo3 data={data?.dashboard3} />
          </Grid>
          {/* 4. Top 5 Vendor yang total barter SO nya paling bnyk*/}
          <Grid item xs={12} sm={6} order={2}>
            <DashboardPo4 data={data?.dashboard4} />
          </Grid>
          {/* 5. Grafik x = date , y = nominal SO per gudang*/}
          {/* <Grid item xs={12} sm={12} order={2}>
            <DashboardPo5 data={data} />
          </Grid> */}
          {/* 6. List 10 SO yang sudah lewat due date nya → pagination*/}
          <Grid item xs={12} sm={12} order={2}>
            <DashboardPo6 data={data} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}