import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useFormContext, useWatch } from 'react-hook-form'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const rowSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 3
}

export default function SummaryCost() {
  const { control, setValue } = useFormContext()

  // Watch all cost values from different sections
  const totalCostGeneral = +useWatch({ control, name: 'totalCostGeneral' }) || 0
  const totalCostEmployee = +useWatch({ control, name: 'totalCostEmployee' }) || 0
  const totalCostUnexpected = +useWatch({ control, name: 'totalCostUnexpected' }) || 0

  // Calculate grand total whenever any of the subtotals change
  useEffect(() => {
    const grandTotal = +totalCostGeneral || +totalCostEmployee + totalCostUnexpected
    setValue('grandTotal', grandTotal)
  }, [totalCostGeneral, totalCostEmployee, totalCostUnexpected, setValue])

  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card elevation={0} sx={{ borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}>
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>Ringkasan</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 3 }}>
          Tinjau semua biaya dan selesaikan
        </Typography>

        <Box sx={rowSx}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>Biaya Umum & Deposit</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
            {formatCurrency(totalCostGeneral)}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: colors.border }} />

        <Box sx={rowSx}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>Biaya Karyawan & Bonus</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
            {formatCurrency(totalCostEmployee)}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: colors.border }} />

        <Box sx={rowSx}>
          <Typography sx={{ fontSize: '0.875rem', color: colors.foreground }}>Biaya Tak Terduga</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>
            {formatCurrency(totalCostUnexpected)}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: colors.border, borderBottomWidth: 2 }} />

        <Box sx={{ ...rowSx, pb: 0 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground }}>Grand Total</Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'success.main' }}>
            {formatCurrency(totalCostGeneral + totalCostEmployee + totalCostUnexpected)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
