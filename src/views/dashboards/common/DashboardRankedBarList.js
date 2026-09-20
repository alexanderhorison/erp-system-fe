// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * DashboardRankedBarList
 * -------------------------------------------------------------------------------------
 * A ranked horizontal bar list card (Figma: "Top 5 Vendor - Nominal PO
 * Tertinggi" / "Top 5 Customer dengan Total Nominal SO Tertinggi", and the
 * inventory dashboard's "Distribusi Quantity per Satuan"). Shared across the
 * sales-order, purchase-order and inventory dashboards.
 *
 * `rows` is `[{ label, value, displayValue }]`, already in the order to
 * render (does not re-sort) — `displayValue` is the formatted string shown
 * beside the percentage; `value` drives the bar width/percentage math.
 */
export default function DashboardRankedBarList({ title, subtitle, rows = [], color, loading = false, emptyLabel = 'Tidak ada data' }) {
  const total = rows.reduce((sum, row) => sum + (row.value || 0), 0)
  const maxValue = rows.length ? Math.max(...rows.map(row => row.value || 0)) : 0

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
            {title}
          </Typography>
          <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.border, borderRadius: `${radii.full}px` }} />
        </Box>
        {subtitle && (
          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 4 }}>{subtitle}</Typography>
        )}

        <LoadingSpinner loading={loading} />

        {!loading && rows.length === 0 && (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, textAlign: 'center', py: 6 }}>
            {emptyLabel}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((row, index) => {
            const percent = total ? Math.round(((row.value || 0) / total) * 100) : 0
            const widthPercent = maxValue ? Math.max(((row.value || 0) / maxValue) * 100, 6) : 0

            return (
              <Box key={`${row.label}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: stone[100],
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: colors.mutedForeground
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ width: 130, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }} noWrap title={row.label}>
                    {row.label}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 10,
                      borderRadius: `${radii.full}px`,
                      backgroundColor: stone[100],
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${widthPercent}%`,
                        minWidth: 4,
                        borderRadius: `${radii.full}px`,
                        backgroundColor: color
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: colors.foreground,
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {row.displayValue ?? row.value} - {percent}%
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}
