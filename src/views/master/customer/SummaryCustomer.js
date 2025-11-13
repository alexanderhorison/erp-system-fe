import { Card, CardContent, Grid, Typography } from '@mui/material'

import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'
import { useSelector } from 'react-redux'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

const icon = {
  totalSalesOrder: 'tabler:shopping-cart',
  totalAmountSalesOrder: 'tabler:moneybag',
  totalAmountPaymentSalesOrder: 'tabler:currency-dollar',
  totalAmountBarterSalesOrder: 'tabler:arrows-exchange',
  totalAmountDebtSalesOrder: 'tabler:file-dollar'
}

const color = {
  totalSalesOrder: 'primary',
  totalAmountSalesOrder: 'info',
  totalAmountPaymentSalesOrder: 'success',
  totalAmountBarterSalesOrder: 'primary',
  totalAmountDebtSalesOrder: 'error'
}

export default function SummaryCustomer() {
  const { dataDashboardSummaryCustomer: data, loadingDashboardSummaryCustomer: loading } = useSelector(
    state => state.dashboard
  )

  const { detail: detailCustomer } = useSelector(state => state.masterCustomer)

  const renderStats = () => {
    let filteredData = data?.slice(2)

    // Jika POS customer, hilangkan field Total Barter
    if (detailCustomer?.isPosCustomer) {
      filteredData = filteredData?.filter(item => item.name !== 'totalAmountBarterSalesOrder')
    }

    return filteredData?.map((item, index) => (
      <Grid item xs={6} key={index}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <CustomAvatar skin='light' color={color[item.name]} sx={{ mr: 4, width: 42, height: 42 }}>
              <Icon icon={icon[item.name]} fontSize='1.5rem' />
            </CustomAvatar>
            <Typography variant='h5' textAlign={'left'} sx={{ mt: 2 }}>
              {item?.title}
            </Typography>
            <Typography variant='h5' textAlign={'left'} sx={{ mt: 1 }}>
              {priceFormatWIthCurrency(item.value)}
            </Typography>
            <Typography variant='body2' textAlign={'left'} sx={{ mt: 1 }}>
              {item?.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))
  }

  return (
    <Grid container spacing={6}>
      {renderStats()}
    </Grid>
  )
}
