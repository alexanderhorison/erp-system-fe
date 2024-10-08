import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummaryCustomer } from "src/store/apps/dashboard";
import { priceFormatWIthCurrency } from "src/helpers/priceFormatter";

const icon = {
  'totalSalesOrder': 'tabler:shopping-cart',
  'totalAmountSalesOrder': 'tabler:moneybag',
  'totalAmountPaymentSalesOrder': 'tabler:currency-dollar',
  'totalAmountDebtSalesOrder': 'tabler:file-dollar',
}

const color = {
  'totalSalesOrder': 'primary',
  'totalAmountSalesOrder': 'info',
  'totalAmountPaymentSalesOrder': 'success',
  'totalAmountDebtSalesOrder': 'error',
}

export default function SummaryCustomer() {
  const query = useRouter().query
  const dispatch = useDispatch()

  const id = query.id

  const { dataDashboardSummaryCustomer: data, loadingDashboardSummaryCustomer: loading } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardSummaryCustomer({ id }))
  }, [id])

  const renderStats = () => {
    return data.map((item, index) => (
      <Grid item xs={6} md={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color={color[item.name]} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={icon[item.name]} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{item.name !== "totalSalesOrder" ? priceFormatWIthCurrency(item.value) : item.value}</Typography>
            <Typography variant='body2'>{item.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title='Summary'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}