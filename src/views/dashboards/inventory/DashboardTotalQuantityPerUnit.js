import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardTotalQuantityPerUnit } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * DashboardTotalQuantityPerUnit
 * -------------------------------------------------------------------------------------
 * "Distribusi Quantity per Satuan" — a horizontal bar list of total quantity
 * per unit, ranked by share (Figma: inventory dashboard). Replaces the
 * previous ApexCharts donut with a real bar list matching the design.
 */
export default function DashboardTotalQuantityPerUnit({ query }) {
  const dispatch = useDispatch()

  const { dataDashboardTotalQuantityPerUnit: data, loadingDashboardTotalQuantityPerUnit: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboardTotalQuantityPerUnit({ query }))
  }, [dispatch, query])

  const rows = [...(data || [])]
    .map(item => ({ label: item.unitName, value: parseInt(item.totalQuantity, 10) || 0 }))
    .sort((a, b) => b.value - a.value)

  const total = rows.reduce((sum, row) => sum + row.value, 0)
  const maxValue = rows.length ? rows[0].value : 0

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>
          Distribusi Quantity per Satuan
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 4 }}>
          Distribusi total quantity berdasarkan satuan barang
        </Typography>

        <LoadingSpinner loading={loading} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((row, index) => {
            const percent = total ? Math.round((row.value / total) * 100) : 0
            const widthPercent = maxValue ? Math.max((row.value / maxValue) * 100, 6) : 0

            return (
              <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                <Box sx={{ minWidth: 72, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }} noWrap>
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
                        backgroundColor: index === 0 ? colors.foregroundAlt : stone[300]
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
                    {row.value} - {percent}%
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
