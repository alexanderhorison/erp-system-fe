import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardJumlahSurat } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DashboardJumlahSurat
 * -------------------------------------------------------------------------------------
 * "Daftar Barang Habis" document-count card (Figma: inventory dashboard) — one
 * row per document type with its total count, clickable through to that
 * document's list page.
 */
export default function DashboardJumlahSurat({ query }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { dataDashboardJumlahSurat: data, loadingDashboardJumlahSurat: loading } = useSelector(
    state => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboardJumlahSurat({ query }))
  }, [dispatch, query])

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, mb: 4 }}>
          Daftar Barang Habis
        </Typography>

        <LoadingSpinner loading={loading} />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {data.map((item, index) => (
            <Box
              key={index}
              onClick={() => item.url && router.push(item.url)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2,
                borderBottom: index !== data.length - 1 ? `1px solid ${colors.border}` : 'none',
                cursor: item.url ? 'pointer' : 'default',
                '&:hover': item.url ? { '& .surat-title': { color: colors.link } } : undefined
              }}
            >
              <Typography className='surat-title' sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                {item.title}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.foreground }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
