import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { fetchDashboardBarangQuantityTerbanyak } from 'src/store/apps/dashboard'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import FilterUnit from 'src/pages/components/filter/FilterUnit'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

/**
 * DashboardBarangQuantityTerbanyak
 * -------------------------------------------------------------------------------------
 * "5 Barang Quantity Terbanyak" — a vertical bar chart of the top 5 products
 * by quantity within a selected unit (Figma: inventory dashboard). Replaces
 * the previous ApexCharts donut with a bar chart, and drops a dead import
 * (`fetchDashboardSlowStock`, which no longer exists in the store).
 */
export default function DashboardBarangQuantityTerbanyak({ query }) {
  const dispatch = useDispatch()
  const theme = useTheme()

  const [unit, setUnit] = useState({ id: 5, name: null })

  const {
    dataDashboardBarangQuantityTerbanyak: data,
    loadingDashboardBarangQuantityTerbanyak: loading
  } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchMasterDataUnit())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchDashboardBarangQuantityTerbanyak({ query, unitId: unit.id }))
  }, [dispatch, unit, query])

  const products = data.length ? data[0]?.products || [] : []

  const labels = products.map(item =>
    query.warehouseId != 0 ? item.productName : `${item.productName} - ${item.warehouseName}`
  )
  const series = products.map(item => parseInt(item.quantity, 10))

  const options = {
    chart: { toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: false
      }
    },
    colors: [colors.foregroundAlt],
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: colors.border,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    // Category names vary a lot in length, and ApexCharts' own label engine
    // (rotation/trim/wrap) can't reliably fit 5 of them without overlapping
    // in a narrow card — so the axis labels are hidden here and a matching
    // legend is rendered below the chart instead, under full CSS control.
    xaxis: {
      categories: labels,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: colors.mutedForeground, fontSize: '0.75rem' } }
    },
    tooltip: { theme: theme.palette.mode }
  }

  return (
    <Card
      elevation={0}
      sx={{ height: '100%', borderRadius: `${radii.lg}px`, border: `1px solid ${colors.border}`, boxShadow: shadows.xs }}
    >
      <CardContent sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
            5 Barang Quantity Terbanyak
          </Typography>
          <FilterUnit data={unit || {}} handleChangeQuery={({ key, value }) => setUnit({ ...unit, [key]: value })} />
        </Box>

        <LoadingSpinner loading={loading} />
        {labels.length === 0 && !loading && (
          <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, textAlign: 'center', py: 8 }}>
            Tidak ada produk
          </Typography>
        )}
        {labels.length > 0 && (
          <>
            <ReactApexcharts type='bar' height={260} options={options} series={[{ name: 'Quantity', data: series }]} />
            <Box sx={{ display: 'flex', gap: 1, px: 1, mt: 2 }}>
              {labels.map((label, index) => (
                <Typography
                  key={`${label}-${index}`}
                  title={label}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'center',
                    fontSize: '0.6875rem',
                    lineHeight: '14px',
                    color: colors.mutedForeground,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
