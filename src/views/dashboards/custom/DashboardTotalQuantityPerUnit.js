// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchDashboardTotalQuantityPerUnit } from 'src/store/apps/dashboard'
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#1FD5EB',
  series5: '#ffa1a1'
}

export default function DashboardTotalQuantityPerUnit({ query }) {
  const dispatch = useDispatch()
  const theme = useTheme()

  const {
    dataDashboardTotalQuantityPerUnit: data,
    loadingDashboardTotalQuantityPerUnit: loading,
    errorDashboardTotalQuantityPerUnit: error
  } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardTotalQuantityPerUnit({ query }))
  }, [query])

  // Extract labels and series from the data
  const labels = data ? data.map(item => item.unitName) : []
  const series = data ? data.map(item => parseInt(item.totalQuantity, 10)) : []

  const options = {
    stroke: { width: 0 },
    labels: labels,
    colors: [donutColors.series1, donutColors.series2, donutColors.series3, donutColors.series4, donutColors.series5],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: val => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: labels[0] || 'Total',
              formatter: () => series.reduce((a, b) => a + b, 0),
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  value: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  total: {
                    fontSize: theme.typography.body1.fontSize
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Total 5 Produk Berdasarkan Unit'
      />
      <CardContent>
        <LoadingSpinner loading={loading} />
        <ReactApexcharts type='donut' height={330} options={options} series={series} />
      </CardContent>
    </Card>
  )
}
