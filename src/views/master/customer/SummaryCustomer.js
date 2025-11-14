import { Card, CardContent, Grid, Typography, Box, Divider } from '@mui/material'

import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'
import { useSelector } from 'react-redux'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// Icons for Non-POS customers
const icon = {
  totalSalesOrder: 'tabler:shopping-cart',
  totalAmountSalesOrder: 'tabler:moneybag',
  totalAmountPaymentSalesOrder: 'tabler:currency-dollar',
  totalAmountBarterSalesOrder: 'tabler:arrows-exchange',
  totalAmountDebtSalesOrder: 'tabler:file-dollar'
}

// Icons for POS customers
const iconPos = {
  totalPos: 'tabler:shopping-cart',
  totalAmountPos: 'tabler:moneybag',
  totalAmountPaidPos: 'tabler:currency-dollar',
  totalAmountDebtPos: 'tabler:file-dollar'
}

// Colors for Non-POS customers
const color = {
  totalSalesOrder: 'primary',
  totalAmountSalesOrder: 'info',
  totalAmountPaymentSalesOrder: 'success',
  totalAmountBarterSalesOrder: 'warning',
  totalAmountDebtSalesOrder: 'error'
}

// Colors for POS customers
const colorPos = {
  totalPos: 'primary',
  totalAmountPos: 'info',
  totalAmountPaidPos: 'success',
  totalAmountDebtPos: 'error'
}

export default function SummaryCustomer() {
  const { dataDashboardSummaryCustomer: data, loadingDashboardSummaryCustomer: loading } = useSelector(
    state => state.dashboard
  )

  const { detail: detailCustomer } = useSelector(state => state.masterCustomer)

  const isPosCustomer = detailCustomer?.isPosCustomer

  const renderStats = () => {
    if (!data || data.length === 0) return null

    const iconMapping = isPosCustomer ? iconPos : icon
    const colorMapping = isPosCustomer ? colorPos : color

    return data?.map((item, index) => {
      const isMoneyValue = item.name.includes('Amount') || item.name.includes('Debt') || item.name.includes('Paid')
      const displayValue = isMoneyValue ? priceFormatWIthCurrency(item.value) : item.value.toLocaleString('id-ID')

      // Dynamic font size based on value length - keep it moderate
      const getFontSize = () => {
        const valueLength = displayValue.length
        if (valueLength > 25) return '0.95rem'
        if (valueLength > 20) return '1rem'
        if (valueLength > 15) return '1.1rem'
        return '1.25rem'
      }

      return (
        <Grid item xs={12} sm={6} key={index}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CustomAvatar skin='light' color={colorMapping[item.name]} sx={{ width: 50, height: 50, mr: 3 }}>
                  <Icon icon={iconMapping[item.name]} fontSize='1.75rem' />
                </CustomAvatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
                    {item?.title}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: getFontSize(),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color:
                      colorMapping[item.name] === 'error'
                        ? 'error.main'
                        : colorMapping[item.name] === 'success'
                        ? 'success.main'
                        : colorMapping[item.name] === 'warning'
                        ? 'warning.main'
                        : colorMapping[item.name] === 'info'
                        ? 'info.main'
                        : 'primary.main'
                  }}
                  title={displayValue}
                >
                  {displayValue}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{
                    display: 'block',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {item?.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )
    })
  }

  return (
    <Grid container spacing={4}>
      {loading ? (
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography>Loading...</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        renderStats()
      )}
    </Grid>
  )
}
