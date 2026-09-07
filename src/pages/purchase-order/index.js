import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableAllPurchaseOrder from 'src/views/purchase-order/TableAllPurchaseOrder'
import DashboardCardPo from 'src/views/purchase-order/DashboardCardPo'
import { dashboardCountPo } from 'src/store/apps/dashboard'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

export default function PurchaseOrder() {
  const dispatch = useDispatch()
  const { dataDashboardCountPo = { countPaid: 0, countDebt: 0 }, loadingDashboardCountPo = false } = useSelector(
    state => state.dashboard || {}
  )

  useEffect(() => {
    dispatch(dashboardCountPo())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader title='Daftar Purchase Order' breadcrumbs={[{ label: 'Home' }, { label: 'Purchase Order' }]} />

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <DashboardCardPo
              dataDashboardCountPo={dataDashboardCountPo}
              loadingDashboardCountPo={loadingDashboardCountPo}
            />
          </Grid>
        </Grid>

        {/* The month/year `TimeFilter` that used to sit beside the title is now
            part of the table's shared filter panel. */}
        <TableAllPurchaseOrder />
      </Grid>
    </Grid>
  )
}
