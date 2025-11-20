import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimeFilter from 'src/pages/components/filter/FilterTime'
import TableAllPurchaseOrder from 'src/views/purchase-order/TableAllPurchaseOrder'
import DashboardCardPo from 'src/views/purchase-order/DashboardCardPo'
import { dashboardCountPo } from 'src/store/apps/dashboard'

export default function InternalTransfer() {
  const dispatch = useDispatch()
  const { dataDashboardCountPo = { countPaid: 0, countDebt: 0 }, loadingDashboardCountPo = false } = useSelector(
    state => state.dashboard || {}
  )

  const [timeFilter, setTimeFilter] = useState({
    month: '',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    dispatch(dashboardCountPo())
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      {/* Dashboard Cards */}
      <Grid item xs={12}>
        <DashboardCardPo
          dataDashboardCountPo={dataDashboardCountPo}
          loadingDashboardCountPo={loadingDashboardCountPo}
        />
      </Grid>

      {/* Table Purchase Order */}
      <Grid item xs={12}>
        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingY: 3 }}>
          <Typography fontSize={20}>Daftar Purchase Order</Typography>
          <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </Box>
        <TableAllPurchaseOrder timeFilter={timeFilter} />
      </Grid>
    </Grid>
  )
}
