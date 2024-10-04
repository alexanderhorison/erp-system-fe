// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchDashboardBarangQuantityTerbanyak, fetchDashboardSlowStock } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import FilterUnit from 'src/pages/components/filter/FilterUnit'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useTheme } from '@mui/material/styles'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#1FD5EB',
  series5: '#ffa1a1'
}

export default function DashboardBarangQuantityTerbanyak({ query }) {
  const dispatch = useDispatch()
  const theme = useTheme()

  const [unit, setUnit] = useState({
    id: 5,
    name: null
  })

  const {
    dataDashboardBarangQuantityTerbanyak: data,
    loadingDashboardBarangQuantityTerbanyak: loading,
    errorDashboardBarangQuantityTerbanyak: error
  } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchMasterDataUnit())
  }, [])

  useEffect(() => {
    dispatch(fetchDashboardBarangQuantityTerbanyak({ query, unitId: unit.id }))
  }, [unit, query])

  // Extract labels and series from the data
  const labels = data.length ? data[0]?.products?.map(item => item.productName) : []
  const series = data.length ? data[0]?.products?.map(item => parseInt(item.quantity, 10)) : []

  const options = {
    stroke: { width: 5 },
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
              fontSize: '0.9rem'
            },
            value: {
              fontSize: '2rem',
              color: theme.palette.text.secondary,
              formatter: val => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: 'Total',
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
        title='Daftar 5 Barang Dengan Quantity Terbanyak'
        action={
          <FilterUnit
            data={unit || {}}
            handleChangeQuery={({ key, value }) => { setUnit({ ...unit, [key]: value }) }}
          />
        }
      />
      <CardContent>
        <LoadingSpinner loading={loading} />
        <ReactApexcharts
          type='donut'
          height={330}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  )
}
