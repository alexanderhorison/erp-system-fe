import React from 'react'
import { Grid, Typography } from '@mui/material'
import { priceFormat } from 'src/helpers/priceFormatter'

const TotalSectionPos = ({ isLowHeight, getTotals,showBreakdown, setShowBreakdown }) => {
  const { totalBarang, totalHutang, grandTotal } = getTotals()

  const totals = [
    { label: 'Total Barang', value: priceFormat(totalBarang) },
    { label: 'Total Hutang', value: priceFormat(totalHutang) },
    { label: 'Grand Total', value: priceFormat(grandTotal), clickable: true }
  ]

  const visibleTotals = showBreakdown ? totals : totals.slice(-1) 

  return (
    <Grid item xs={12}
    sx={{
        transition: 'height 0.3s ease',
        height: showBreakdown
          ? (isLowHeight ? '100px' : '90px')
          : (isLowHeight ? '55px' : '30px')
      }}
    >
      <Grid
        flexDirection="column"
        justifyContent="center"
        px={3}
        sx={{ height: '100%' }}
      >
        {visibleTotals.map((item, idx) => {
          const isGrandTotal = item.clickable

          // Hide other items if breakdown is not shown
          if (!showBreakdown && !isGrandTotal) return null

          return (
            <Grid
              container
              key={idx}
              justifyContent="space-between"
              alignItems="center"
              onClick={isGrandTotal ? () => setShowBreakdown(prev => !prev) : undefined}
              sx={{
                mb: idx === visibleTotals.length - 1 ? 0 : (isLowHeight ? 0.3 : 0.5),
                cursor: isGrandTotal ? 'pointer' : 'default',
                userSelect: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Typography
                variant={isLowHeight ? 'body2' : 'h6'}
                sx={{
                  fontWeight: 'bold',
                  marginTop: isLowHeight ? '2px' : '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  color: isGrandTotal ? 'primary.main' : 'text.primary'
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant={isLowHeight ? 'body2' : 'h6'}
                sx={{
                  fontWeight: 'bold',
                  color: isGrandTotal ? 'primary.main' : 'text.primary'
                }}
              >
                {item.value || '0'}
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default TotalSectionPos
