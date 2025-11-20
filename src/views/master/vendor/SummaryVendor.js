import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import CustomAvatar from 'src/@core/components/mui/avatar'

import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardSummaryVendor } from 'src/store/apps/dashboard'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

const icon = {
  totalPurchaseOrder: 'tabler:shopping-cart',
  totalAmountPurchaseOrder: 'tabler:moneybag',
  totalAmountPaymentPurchaseOrder: 'tabler:currency-dollar',
  totalAmountDebtPurchaseOrder: 'tabler:file-dollar',
  totalAmountBarterPurchaseOrder: 'tabler:arrows-exchange'
}

const color = {
  totalPurchaseOrder: 'primary',
  totalAmountPurchaseOrder: 'info',
  totalAmountPaymentPurchaseOrder: 'success',
  totalAmountDebtPurchaseOrder: 'error',
  totalAmountBarterPurchaseOrder: 'warning'
}

export default function SummaryVendor() {
  const query = useRouter().query
  const dispatch = useDispatch()

  const id = query.id

  const { dataDashboardSummaryVendor: data, loadingDashboardSummaryVendor: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchDashboardSummaryVendor({ id }))
    }
  }, [id])

  const renderStats = () => {
    if (!data || data.length === 0) return null

    return data?.map((item, index) => {
      const isMoneyValue = item.name.includes('Amount') || item.name.includes('Debt') || item.name.includes('Payment')
      const displayValue = isMoneyValue ? priceFormatWIthCurrency(item.value) : item.value.toLocaleString('id-ID')

      // Dynamic font size based on value length
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
                <CustomAvatar skin='light' color={color[item.name]} sx={{ width: 50, height: 50, mr: 3 }}>
                  <Icon icon={icon[item.name]} fontSize='1.75rem' />
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
                      color[item.name] === 'error'
                        ? 'error.main'
                        : color[item.name] === 'success'
                        ? 'success.main'
                        : color[item.name] === 'warning'
                        ? 'warning.main'
                        : color[item.name] === 'info'
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
