import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardProductQuantityBanyakHilang } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DashboardBanyakQuantityHilang
 * -------------------------------------------------------------------------------------
 * "Total Quantity Produk Outstanding" (Figma: inventory dashboard).
 */
export default function DashboardBanyakQuantityHilang({ query }) {
  const dispatch = useDispatch()

  const {
    dataDashboardProductQuantityBanyakHilang: data,
    loadingDashboardProductQuantityBanyakHilang: loading
  } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardProductQuantityBanyakHilang({ query }))
  }, [dispatch, query])

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii["3xl"]}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 4 }}>
          Total Quantity Produk Outstanding
        </Typography>

        <LoadingSpinner loading={loading} />

        {data.length === 0 && !loading ? (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, textAlign: 'center', py: 6 }}>
            Tidak ada produk yang tercatat di outstanding
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
                  {item.totalQuantityOutstanding}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
