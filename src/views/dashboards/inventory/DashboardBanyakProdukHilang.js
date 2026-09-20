import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardProductBanyakHilang } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DashboardBanyakProdukHilang
 * -------------------------------------------------------------------------------------
 * "Produk Hilang Di Outstanding" (Figma: inventory dashboard).
 */
export default function DashboardBanyakProdukHilang({ query }) {
  const dispatch = useDispatch()

  const { dataDashboardProductBanyakHilang: data, loadingDashboardProductBanyakHilang: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboardProductBanyakHilang({ query }))
  }, [dispatch, query])

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii["3xl"]}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 4 }}>
          Produk Hilang Di Outstanding
        </Typography>

        <LoadingSpinner loading={loading} />

        {data.length === 0 && !loading ? (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, textAlign: 'center', py: 6 }}>
            Tidak ada produk hilang yang tercatat di outstanding
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }} noWrap>
                    {item.productName} - {item.unitName}
                  </Typography>
                  {query.warehouseId == 0 && (
                    <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                      {item.warehouseName}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
                  {item.totalSuratOutstanding} Surat
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
