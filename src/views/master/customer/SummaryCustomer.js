import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

// ** Icon + tone per summary field, keyed by the API's `name`. Non-POS and POS
// customers report different fields, so both sets are declared. `banknote-x`
// and `banknote-arrow-up` (the requested Hutang/Pembayaran icons) don't exist
// in the installed Lucide package version, so both use the plain `banknote`
// icon and are told apart by tone (red vs. green) instead.
const FIELD_META = {
  // Non-POS
  totalSalesOrder: { icon: 'tabler:clipboard-list' },
  totalAmountSalesOrder: { icon: 'lucide:gem', tone: statusTokens.info },
  totalAmountPaymentSalesOrder: { icon: 'lucide:banknote', tone: statusTokens.success },
  totalAmountDebtSalesOrder: { icon: 'lucide:banknote', tone: statusTokens.danger },
  totalAmountBarterSalesOrder: { icon: 'lucide:switch-camera', tone: statusTokens.warning },
  // POS
  totalPos: { icon: 'tabler:clipboard-list' },
  totalAmountPos: { icon: 'lucide:gem', tone: statusTokens.info },
  totalAmountPaidPos: { icon: 'lucide:banknote', tone: statusTokens.success },
  totalAmountDebtPos: { icon: 'lucide:banknote', tone: statusTokens.danger }
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

export default function SummaryCustomer() {
  const { dataDashboardSummaryCustomer: data, loadingDashboardSummaryCustomer: loading } = useSelector(
    state => state.dashboard
  )

  if (loading) {
    return (
      <Typography sx={{ fontSize: '0.875rem', color: colors.mutedForeground }}>Memuat ringkasan...</Typography>
    )
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
