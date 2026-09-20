import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardBarangTidakBergerak } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DashboardBarangTidakBergerak
 * -------------------------------------------------------------------------------------
 * "Daftar Barang Slow Stock" — top 5 products with the oldest last stock
 * movement (Figma: inventory dashboard).
 */
export default function DashboardBarangTidakBergerak({ query }) {
  const dispatch = useDispatch()

  const { dataDashboardBarangTidakBergerak: data, loadingDashboardBarangTidakBergerak: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboardBarangTidakBergerak({ query }))
  }, [dispatch, query])

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii["3xl"]}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 1 }}>
          Daftar Barang Slow Stock
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 4 }}>
          Belum ada pergerakan dalam waktu lama
        </Typography>

        <LoadingSpinner loading={loading} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }} noWrap>
                  {item.productName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                  {item.unitName} - {item.rackName || 'default'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
                  Terakhir Update
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.foreground }}>{item.dateUpdate}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
