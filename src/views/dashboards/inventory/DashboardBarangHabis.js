import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardBarangHabis } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const countChipSx = {
  height: 24,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${statusTokens.danger.border}`,
  backgroundColor: statusTokens.danger.bg,
  '& .MuiChip-label': {
    px: 2,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: statusTokens.danger.fg
  }
}

const stockChipSx = {
  height: 22,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${statusTokens.danger.border}`,
  backgroundColor: statusTokens.danger.bg,
  '& .MuiChip-label': {
    px: 1.5,
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: statusTokens.danger.fg
  }
}

/**
 * DashboardBarangHabis
 * -------------------------------------------------------------------------------------
 * "Daftar Barang Habis" — top 5 out-of-stock products (Figma: inventory
 * dashboard). List rows on shared tokens, replacing the old freepik-image +
 * plain Typography layout.
 */
export default function DashboardBarangHabis({ query }) {
  const dispatch = useDispatch()

  const { dataDashboardBarangHabis: data, loadingDashboardBarangHabis: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboardBarangHabis({ query }))
  }, [dispatch, query])

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
            Daftar Barang Habis
          </Typography>
          <Chip size='small' label={`${data.length} Produk`} sx={countChipSx} />
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 4 }}>
          Perlu segera direstock
        </Typography>

        <LoadingSpinner loading={loading} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}
                  noWrap
                >
                  {item.productName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                  {item.unitName} - {item.rackName || 'default'}
                </Typography>
              </Box>
              <Chip size='small' label={`Stok ${item.quantity}`} sx={stockChipSx} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
