// ** MUI Imports
import { CircularProgress, Card, CardContent, Grid, Typography, Box, Divider } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailDailyCostByDate } from 'src/store/apps/daily-cost'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Helper functions

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { priceFormat } from 'src/helpers/priceFormatter'
import ButtonBack from '../common/ButtonBack'
import { returnFormatDateDay } from 'src/helpers/formatDate'
import { useRouter } from 'next/router'

export default function DailyCostViewOnly({ selectedDate }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { detailDailyCost: data, loadingDetailDailyCost } = useSelector(state => state.dailyCost)

  useEffect(() => {
    dispatch(fetchDetailDailyCostByDate({ date: selectedDate }))
  }, [dispatch, selectedDate])

  if (loadingDetailDailyCost) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  if (!data) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant='body1'>Tidak ada data untuk tanggal ini</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      <ButtonBack
        name={`Detail Daily Cost - ${returnFormatDateDay(data.date)}`}
        onClick={() => {
          router.back()
        }}
      />
      {/* Header Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    General Cost & Deposit
                  </Typography>
                  <Typography variant='h6' sx={{ mt: 1 }}>
                    Rp {priceFormat(data.totalCostGeneral)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Employee Cost & Bonus
                  </Typography>
                  <Typography variant='h6' sx={{ mt: 1 }}>
                    Rp {priceFormat(data.totalCostEmployee)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Unexpected Cost
                  </Typography>
                  <Typography variant='h6' sx={{ mt: 1 }}>
                    Rp {priceFormat(data.totalCostUnexpected)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'right',
                pt: 2,
                borderRadius: 1
              }}
            >
              <Typography variant='subtitle1' fontWeight='bold'>
                Grand Total : Rp {priceFormat(data.grandTotal)}
              </Typography>
            </Box>

            {data.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Catatan:
                </Typography>
                <Typography variant='body2'>{data.notes}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Cost General */}
      {data.costGenerals && data.costGenerals.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>
                General Cost & Deposit
              </Typography>

              {data.costGenerals.map((item, index) => (
                <Box key={item.id} sx={{ mb: index !== data.costGenerals.length - 1 ? 4 : 0 }}>
                  <Grid container spacing={0}>
                    {/* Sales Order Information - Moved to top */}
                    {item.Sales_Order && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3, p: 2, bgcolor: hexToRGBA('#f5f5f5', 0.5), borderRadius: 1 }}>
                          <Typography variant='subtitle2' sx={{ mb: 1, color: 'primary.main' }}>
                            Sales Order Information
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                              <Typography variant='caption' color='text.secondary'>
                                Sales Order Code
                              </Typography>
                              <Typography
                                variant='body2'
                                fontWeight='500'
                                onClick={() => window.open(`/sales-order/${item.Sales_Order.code}`, '_blank')}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: 'primary.main'
                                  }
                                }}
                              >
                                {item.Sales_Order.code || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Typography variant='caption' color='text.secondary'>
                                Customer Name
                              </Typography>
                              <Typography variant='body2' fontWeight='500'>
                                {item.Sales_Order.Master_Customer?.name || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant='caption' color='text.secondary'>
                                Customer Address
                              </Typography>
                              <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
                                {item.Sales_Order.Master_Customer?.address || '-'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12} md={4} p={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CustomAvatar skin='light' color='primary' sx={{ mr: 2 }}>
                          <Icon icon='tabler:car' />
                        </CustomAvatar>
                        <Box>
                          <Typography variant='body2' fontWeight='600'>
                            {item.Tm_Car?.name || '-'}
                          </Typography>
                          <Typography variant='caption'>{item.Tm_Car?.plate_number || '-'}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CustomAvatar skin='light' color='success' sx={{ mr: 2 }}>
                          <Icon icon='tabler:user' />
                        </CustomAvatar>
                        <Box>
                          <Typography variant='body2' fontWeight='600'>
                            Driver
                          </Typography>
                          <Typography variant='caption'>{item.Tm_Employee?.nama || '-'}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8} p={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Deposit Awal
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.depositBalance)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Deposit E-Money
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.eMoneyBalance)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Emoney Terakhir
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.latestEMoneyBalance)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Biaya Tol
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.tollCost)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Biaya Bensin
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.fuelCost)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Uang Jalan
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.transportAllowance)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Saldo E-Money Terakhir
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.remainingEMoneyBalance)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='caption' color='text.secondary'>
                            Sisa Deposit
                          </Typography>
                          <Typography variant='body2'>Rp {priceFormat(item.remainingDepositBalance)}</Typography>
                        </Grid>
                      </Grid>
                      {/* Total Cost per SO section */}
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed rgba(58, 53, 65, 0.12)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='subtitle2' color='primary.main'>
                            Total Cost Per SO
                          </Typography>
                          <Typography variant='body2' fontWeight='600'>
                            Rp{' '}
                            {priceFormat(
                              Number(item.tollCost || 0) +
                                Number(item.fuelCost || 0) +
                                Number(item.transportAllowance || 0)
                            )}
                          </Typography>
                        </Box>
                        <Typography variant='caption' color='text.secondary'>
                          *Termasuk biaya tol, bensin, uang jalan, dan e-money
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {index !== data.costGenerals.length - 1 && <Divider sx={{ my: 3 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Cost Employees */}
      {data.costEmployees && data.costEmployees.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>
                Employee Cost & Bonus
              </Typography>

              <Grid container spacing={2}>
                {data.costEmployees.map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'action.hover' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CustomAvatar skin='light' color='info' sx={{ mr: 2 }}>
                          {item.employeeName?.charAt(0) || 'E'}
                        </CustomAvatar>
                        <Typography variant='body1'>{item.employeeName}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant='caption' color='text.secondary'>
                          Gaji
                        </Typography>
                        <Typography variant='body2'>Rp {priceFormat(item.salary)}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='caption' color='text.secondary'>
                          Bonus
                        </Typography>
                        <Typography variant='body2'>Rp {priceFormat(item.bonus) || '-'}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='caption' color='text.secondary'>
                          Kasbon
                        </Typography>
                        <Typography variant='body2'>Rp {priceFormat(item?.amountDebt) || '-'}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='caption' color='text.secondary'>
                          Kasbon Terbayar
                        </Typography>
                        <Typography variant='body2'>Rp {priceFormat(item?.amountDebtPaid) || '-'}</Typography>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2' fontWeight='500'>
                          Total
                        </Typography>
                        <Typography variant='body2' fontWeight='500'>
                          Rp{' '}
                          {priceFormat(
                            Number(item.salary) +
                              Number(item.bonus) +
                              Number(item?.amountDebt || 0) -
                              Number(item?.amountDebtPaid || 0)
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Cost Unexpected */}
      {data.costUnexpecteds && data.costUnexpecteds.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>
                Unexpected Cost
              </Typography>

              {data.costUnexpecteds.map((item, index) => (
                <Box key={item.id} sx={{ mb: index !== data.costUnexpecteds.length - 1 ? 3 : 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant='body1'>
                        {item.Tm_Unexpected_Cost_Category?.name || 'Biaya Tak Terduga'}
                      </Typography>
                      {item.description && (
                        <Typography variant='caption' color='text.secondary'>
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant='body1' fontWeight='500'>
                      Rp {priceFormat(item.price)}
                    </Typography>
                  </Box>
                  {index !== data.costUnexpecteds.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}
