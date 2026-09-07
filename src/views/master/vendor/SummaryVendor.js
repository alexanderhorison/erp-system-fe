import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { fetchDashboardSummaryVendor } from 'src/store/apps/dashboard'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

// ** Icon + tone per summary field, keyed by the API's `name` — mirrors
// SummaryCustomer.js's field-meta map for the equivalent purchase-order fields.
const FIELD_META = {
  totalPurchaseOrder: { icon: 'tabler:clipboard-list' },
  totalAmountPurchaseOrder: { icon: 'lucide:gem', tone: statusTokens.info },
  totalAmountPaymentPurchaseOrder: { icon: 'lucide:banknote', tone: statusTokens.success },
  totalAmountDebtPurchaseOrder: { icon: 'lucide:banknote', tone: statusTokens.danger },
  totalAmountBarterPurchaseOrder: { icon: 'lucide:switch-camera', tone: statusTokens.warning }
}

const isMoneyField = name => /amount|debt|paid/i.test(name)

const SummaryCard = ({ item }) => {
  const meta = FIELD_META[item.name] || {}
  const tone = meta.tone
  const displayValue = isMoneyField(item.name)
    ? priceFormatWIthCurrency(item.value)
    : (item.value ?? 0).toLocaleString('id-ID')

  return (
    <Box
      sx={{
        p: 4,
        height: '100%',
        borderRadius: `${radii.lg}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.xs,
        backgroundColor: colors.background
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>{item.title}</Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tone ? tone.bg : stone[100],
            color: tone ? tone.fg : colors.mutedForeground
          }}
        >
          <Icon icon={meta.icon || 'tabler:report'} fontSize='1.125rem' />
        </Box>
      </Box>
      <Typography
        sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.foreground, wordBreak: 'break-word' }}
        title={displayValue}
      >
        {displayValue}
      </Typography>
    </Box>
  )
}

export default function SummaryVendor() {
  const dispatch = useDispatch()
  const { id } = useRouter().query

  const { dataDashboardSummaryVendor: data, loadingDashboardSummaryVendor: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchDashboardSummaryVendor({ id }))
    }
  }, [id, dispatch])

  if (loading) {
    return <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Memuat ringkasan...</Typography>
  }

  if (!data || data.length === 0) return null

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <SummaryCard item={item} />
        </Grid>
      ))}
    </Grid>
  )
}
