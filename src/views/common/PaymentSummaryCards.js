// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { priceFormat } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors, radii, status } from 'src/configs/designTokens'

const SummaryCard = ({ label, value, color = colors.foreground, strong }) => (
  <Box
    sx={{
      flex: 1,
      px: 4,
      py: 3,
      borderRadius: `${radii.lg * 2}px`,
      border: `1px solid ${colors.border3}`,
      backgroundColor: '#F5F5F5'
    }}
  >
    <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 1 }}>{label}</Typography>
    <Typography sx={{ fontSize: strong ? '1rem' : '0.9375rem', fontWeight: 600, color }}>
      Rp {priceFormat(value) || 0}
    </Typography>
  </Box>
)

/**
 * Total / Sudah Bayar / Belum Bayar cards shown on top of the payment modals.
 * Total is derived (paid + debt) so it stays right even after partial payments.
 */
export default function PaymentSummaryCards({ label = 'Total', amountPaid, amountDebt }) {
  const debt = Number(amountDebt) || 0
  const paid = Number(amountPaid) || 0

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
      <SummaryCard label={`Total ${label}`} value={debt + paid} strong />
      <SummaryCard label='Total Sudah Bayar' value={paid} color={status.success.fg} />
      <SummaryCard label='Total Belum Bayar' value={debt} color='#EA580C' />
    </Box>
  )
}
