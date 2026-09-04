import { useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailDailyCostByDate } from 'src/store/apps/daily-cost'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { priceFormat } from 'src/helpers/priceFormatter'
import { returnFormatDateDay } from 'src/helpers/formatDate'
import { useRouter } from 'next/router'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const cardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background
}

/**
 * SectionHeading (per docs/REVAMP_BASELINE.md), plus a chevron to collapse the
 * Card that follows it — same numbered-circle + title + rule row, heading
 * stays outside the card it labels, one Card per section.
 */
const CollapsibleSectionHeading = ({ number, title, open, onToggle }) => (
  <Box
    onClick={onToggle}
    sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, cursor: 'pointer' }}
  >
    <Box
      sx={{
        width: 22,
        height: 22,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.foreground,
        color: colors.primaryForeground
      }}
    >
      {number}
    </Box>
    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
      {title}
    </Typography>
    <Box sx={{ flexGrow: 1, height: '1px', backgroundColor: colors.border }} />
    <Icon
      icon={open ? 'tabler:chevron-up' : 'tabler:chevron-down'}
      fontSize='1.125rem'
      color={colors.mutedForeground}
    />
  </Box>
)

/** A numbered section: heading outside the card, card content collapses. */
const CollapsibleSection = ({ number, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <>
      <CollapsibleSectionHeading number={number} title={title} open={open} onToggle={() => setOpen(prev => !prev)} />
      <Collapse in={open}>
        <Box sx={{ ...cardSx, p: 4 }}>{children}</Box>
      </Collapse>
    </>
  )
}

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
      <Box sx={{ ...cardSx, p: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
          Tidak ada data untuk tanggal ini
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <PageHeader
        title='Detail Daily Cost'
        subtitle={returnFormatDateDay(data.date)}
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Daily Cost' },
          { label: 'Daily Cost Calendar', href: '/daily-cost-calendar' },
          { label: 'Detail' }
        ]}
      />

      <Grid container spacing={4}>
        {/* Header Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ ...cardSx, p: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Grand Total</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              Rp {priceFormat(data.grandTotal)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ ...cardSx, p: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Biaya Umum & Deposit</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              Rp {priceFormat(data.totalCostGeneral)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ ...cardSx, p: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Biaya Karyawan & Bonus</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              Rp {priceFormat(data.totalCostEmployee)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ ...cardSx, p: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Biaya Tak Terduga</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 1 }}>
              Rp {priceFormat(data.totalCostUnexpected)}
            </Typography>
          </Box>
        </Grid>

        {data.notes && (
          <Grid item xs={12}>
            <Box sx={{ ...cardSx, p: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Catatan</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.foreground, mt: 1 }}>{data.notes}</Typography>
            </Box>
          </Grid>
        )}

        {/* Cost General */}
        <Grid item xs={12}>
          <CollapsibleSection number={1} title='Biaya Umum & Deposit'>
            {data.costGenerals && data.costGenerals.length > 0 ? (
              <Grid container spacing={2}>
                {data.costGenerals.map(item => (
                  <Grid item xs={12} key={item.id}>
                    <Box sx={{ p: 3, borderRadius: `${radii.md}px`, border: `1px solid ${colors.border}` }}>
                      {item.Sales_Order && (
                        <Box sx={{ mb: 3, p: 3, borderRadius: `${radii.md}px`, backgroundColor: stone[50] }}>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground, mb: 2 }}>
                            Sales Order Information
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                                Sales Order Code
                              </Typography>
                              <Typography
                                onClick={() => window.open(`/sales-order/${item.Sales_Order.code}`, '_blank')}
                                sx={{
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  color: colors.link,
                                  '&:hover': { color: colors.linkHover, textDecoration: 'underline' }
                                }}
                              >
                                {item.Sales_Order.code || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                                Customer Name
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
                                {item.Sales_Order.Master_Customer?.name || '-'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                                Customer Address
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', color: colors.foreground, wordBreak: 'break-word' }}>
                                {item.Sales_Order.Master_Customer?.address || '-'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      <Grid container spacing={0}>
                        <Grid item xs={12} md={4} p={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CustomAvatar skin='light' color='primary' sx={{ mr: 2 }}>
                              <Icon icon='tabler:car' />
                            </CustomAvatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                                {item.Tm_Car?.name || '-'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                                {item.Tm_Car?.plate_number || '-'}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CustomAvatar skin='light' color='success' sx={{ mr: 2 }}>
                              <Icon icon='tabler:user' />
                            </CustomAvatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                                Driver
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                                {item.Tm_Employee?.nama || '-'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={8} p={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Deposit Awal
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.depositBalance)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Deposit E-Money
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.eMoneyBalance)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Emoney Terakhir
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.latestEMoneyBalance)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Biaya Tol
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.tollCost)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Biaya Bensin
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.fuelCost)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Uang Jalan
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.transportAllowance)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Saldo E-Money Terakhir
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.remainingEMoneyBalance)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                              Sisa Deposit
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                              Rp {priceFormat(item.remainingDepositBalance)}
                            </Typography>
                          </Box>

                          <Divider sx={{ my: 2, borderColor: colors.border }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                              Total Cost Per SO
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                              Rp{' '}
                              {priceFormat(
                                Number(item.tollCost || 0) +
                                  Number(item.fuelCost || 0) +
                                  Number(item.transportAllowance || 0)
                              )}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mt: 1 }}>
                            *Termasuk biaya tol, bensin, uang jalan, dan e-money
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderRadius: `${radii.md}px`, backgroundColor: stone[50] }}>
                <Icon icon='tabler:info-circle' fontSize='1.125rem' color={colors.mutedForeground} />
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  Tidak ada biaya sopir atau setoran yang dicatat hari ini.
                </Typography>
              </Box>
            )}

            {data.costGenerals && data.costGenerals.length > 0 && (
              <>
                <Divider sx={{ my: 3, borderColor: colors.border }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Sub Total
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Rp {priceFormat(data.totalCostGeneral)}
                  </Typography>
                </Box>
              </>
            )}
          </CollapsibleSection>
        </Grid>

        {/* Cost Employees */}
        <Grid item xs={12}>
          <CollapsibleSection number={2} title='Biaya Karyawan & Bonus'>
            {data.costEmployees && data.costEmployees.length > 0 ? (
              <Grid container spacing={2}>
                {data.costEmployees.map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Box sx={{ p: 3, borderRadius: `${radii.md}px`, border: `1px solid ${colors.border}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <CustomAvatar skin='light' color='info' sx={{ mr: 2 }}>
                          {item.employeeName?.charAt(0) || 'E'}
                        </CustomAvatar>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                          {item.employeeName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Gaji</Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          Rp {priceFormat(item.salary)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Bonus</Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          Rp {priceFormat(item.bonus) || '-'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>Kasbon</Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          Rp {priceFormat(item?.amountDebt) || '-'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                          Kasbon Terbayar
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          - Rp {priceFormat(item?.amountDebtPaid) || '-'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: colors.border }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                          Total
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
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
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderRadius: `${radii.md}px`, backgroundColor: stone[50] }}>
                <Icon icon='tabler:info-circle' fontSize='1.125rem' color={colors.mutedForeground} />
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  Tidak ada biaya karyawan yang dicatat hari ini.
                </Typography>
              </Box>
            )}

            {data.costEmployees && data.costEmployees.length > 0 && (
              <>
                <Divider sx={{ my: 3, borderColor: colors.border }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Sub Total
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Rp {priceFormat(data.totalCostEmployee)}
                  </Typography>
                </Box>
              </>
            )}
          </CollapsibleSection>
        </Grid>

        {/* Cost Unexpected */}
        <Grid item xs={12}>
          <CollapsibleSection number={3} title='Biaya Tak Terduga'>
            {data.costUnexpecteds && data.costUnexpecteds.length > 0 ? (
              <>
                {data.costUnexpecteds.map((item, index) => (
                  <Box key={item.id} sx={{ mb: index !== data.costUnexpecteds.length - 1 ? 3 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>
                          {item.Tm_Unexpected_Cost_Category?.name || 'Biaya Tak Terduga'}
                        </Typography>
                        {item.description && (
                          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                        Rp {priceFormat(item.price)}
                      </Typography>
                    </Box>
                    {index !== data.costUnexpecteds.length - 1 && <Divider sx={{ my: 2, borderColor: colors.border }} />}
                  </Box>
                ))}
                <Divider sx={{ my: 3, borderColor: colors.border }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Sub Total
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.foreground }}>
                    Rp {priceFormat(data.totalCostUnexpected)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderRadius: `${radii.md}px`, backgroundColor: stone[50] }}>
                <Icon icon='tabler:info-circle' fontSize='1.125rem' color={colors.mutedForeground} />
                <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>
                  Tidak ada biaya tak terduga yang dicatat hari ini.
                </Typography>
              </Box>
            )}
          </CollapsibleSection>
        </Grid>
      </Grid>
    </>
  )
}
