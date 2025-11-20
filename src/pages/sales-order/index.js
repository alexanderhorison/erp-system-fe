import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import TableAllSalesOrder from 'src/views/sales-order/TableAllSalesOrder'
import DashboardCardSo from 'src/views/sales-order/DashboardCardSo'
import { dashboardCountSo } from 'src/store/apps/dashboard'

export default function InternalTransfer() {
  const dispatch = useDispatch()
  const { dataDashboardCountSo = { countPaid: 0, countDebt: 0 }, loadingDashboardCountSo = false } = useSelector(
    state => state.dashboard || {}
  )

  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    dispatch(dashboardCountSo())
  }, [dispatch])

  return (
    <Grid container spacing={3}>
      {/* Dashboard Cards */}
      <Grid item xs={12}>
        <DashboardCardSo
          dataDashboardCountSo={dataDashboardCountSo}
          loadingDashboardCountSo={loadingDashboardCountSo}
        />
      </Grid>

      {/* Table Sales Order */}
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Sales Order</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllSalesOrder timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
