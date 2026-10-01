import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// ** Helpers
import { priceFormat } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

const Row = ({ label, value, strong = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Typography
      sx={{ fontSize: strong ? '0.8125rem' : '0.75rem', fontWeight: strong ? 700 : 500, color: colors.foreground }}
    >
      {label}
    </Typography>
    <Typography
      sx={{ fontSize: strong ? '0.8125rem' : '0.75rem', fontWeight: strong ? 700 : 500, color: colors.foreground }}
    >
      {value || '0'}
    </Typography>
  </Box>
)

// ** "Ringkasan" panel: the cart's totals, always broken down.
const TotalSectionPos = ({ getTotals }) => {
  const { totalBarang, totalHutang, grandTotal } = getTotals()

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${statusTokens.success.border}`,
        backgroundColor: statusTokens.success.bg
      }}
    >
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.foreground }}>Ringkasan</Typography>
      <Row label='Total Barang' value={priceFormat(totalBarang)} />
      <Row label='Total Hutang' value={priceFormat(totalHutang)} />
      <Divider sx={{ borderColor: colors.foreground }} />
      <Row label='Grand Total' value={priceFormat(grandTotal)} strong />
    </Box>
  )
}

export default TotalSectionPos
