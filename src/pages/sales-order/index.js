import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableAllSalesOrder from 'src/views/sales-order/TableAllSalesOrder'
import DashboardCardSo from 'src/views/sales-order/DashboardCardSo'
import { dashboardCountSo } from 'src/store/apps/dashboard'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function SalesOrder() {
  const dispatch = useDispatch()
  const { dataDashboardCountSo = { countPaid: 0, countDebt: 0 }, loadingDashboardCountSo = false } = useSelector(
    state => state.dashboard || {}
  )

  useEffect(() => {
    dispatch(dashboardCountSo())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daftar Sales Order' breadcrumbs={[{ label: 'Home' }, { label: 'Sales Order' }]} />

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <DashboardCardSo
              dataDashboardCountSo={dataDashboardCountSo}
              loadingDashboardCountSo={loadingDashboardCountSo}
            />
          </Grid>
        </Grid>

        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableAllSalesOrder />
      </Grid>
    </Grid>
  )
}
