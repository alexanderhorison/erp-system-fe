import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box
} from '@mui/material'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { fetchDashboardFinanceRevenue } from 'src/store/apps/dashboard'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

export default function DashboardRevenue() {
  const dispatch = useDispatch()
  const { dataDashboardFinanceRevenue } = useSelector(state => state.dashboard)

  // State untuk filter
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  // Generate tahun options (5 tahun terakhir sampai tahun depan)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let i = currentYear - 4; i <= currentYear + 1; i++) {
    yearOptions.push(i)
  }

  // Bulan options
  const monthOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ]

  // Format currency untuk Indonesia
  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(amount)
      .replace('IDR', 'Rp')
  }

  // Format percentage
  const formatPercentage = percent => {
    // Remove % sign to get numeric value
    const cleanPercent = percent.replace('%', '')
    const numericValue = parseInt(cleanPercent)
    const sign = numericValue >= 0 ? '+' : ''
    return `${sign}${cleanPercent}%`
  }

  // Get color based on percentage
  const getPercentageColor = percent => {
    const numericValue = parseInt(percent.replace('%', ''))
    return numericValue >= 0 ? '#4caf50' : '#f44336'
  }

  useEffect(() => {
    // Dispatch dengan query params
    dispatch(
      fetchDashboardFinanceRevenue({
        month: selectedMonth,
        year: selectedYear
      })
    )
  }, [dispatch, selectedMonth, selectedYear])

  // Additional safety check for nested properties
  const safeData = {
    current: {
      revenue: dataDashboardFinanceRevenue?.current?.revenue + 1000000000000 || 0,
      grossProfit: dataDashboardFinanceRevenue?.current?.grossProfit || 0,
      cost: dataDashboardFinanceRevenue?.current?.cost || 0,
      netProfit: dataDashboardFinanceRevenue?.current?.netProfit || 0
    },
    percentChange: {
      revenue: dataDashboardFinanceRevenue?.percentChange?.revenue || '0%',
      grossProfit: dataDashboardFinanceRevenue?.percentChange?.grossProfit || '0%',
      cost: dataDashboardFinanceRevenue?.percentChange?.cost || '0%',
      netProfit: dataDashboardFinanceRevenue?.percentChange?.netProfit || '0%'
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={<Typography variant='h6'>Dashboard Revenue</Typography>} />
      <CardContent>
        <Box>
          {/* Filter Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tahun</InputLabel>
                <Select value={selectedYear} label='Tahun' onChange={e => setSelectedYear(e.target.value)}>
                  {yearOptions.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Bulan</InputLabel>
                <Select value={selectedMonth} label='Bulan' onChange={e => setSelectedMonth(e.target.value)}>
                  {monthOptions.map(month => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Cards Section */}
          <Grid container spacing={3}>
            {/* Total Revenue Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                    Total Revenue Bulan ini
                  </Typography>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                  >
                    {formatCurrency(safeData.current.revenue)}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: getPercentageColor(safeData.percentChange.revenue),
                      fontWeight: 'bold'
                    }}
                  >
                    {formatPercentage(safeData.percentChange.revenue)} dari bulan sebelumnya
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Gross Profit Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                    Total Gross Profit
                  </Typography>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                  >
                    {formatCurrency(safeData.current.grossProfit)}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: getPercentageColor(safeData.percentChange.grossProfit),
                      fontWeight: 'bold'
                    }}
                  >
                    {formatPercentage(safeData.percentChange.grossProfit)} dari bulan sebelumnya
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Cost Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                    Total Cost
                  </Typography>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                  >
                    {formatCurrency(safeData.current.cost)}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: getPercentageColor(`-${safeData.percentChange.cost}`), // Cost increase is negative
                      fontWeight: 'bold'
                    }}
                  >
                    -{safeData.percentChange.cost} dari bulan sebelumnya
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Net Profit Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                    Total Net Profit
                  </Typography>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                  >
                    {formatCurrency(safeData.current.netProfit)}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: getPercentageColor(safeData.percentChange.netProfit),
                      fontWeight: 'bold'
                    }}
                  >
                    {formatPercentage(safeData.percentChange.netProfit)} dari bulan sebelumnya
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pie Charts Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Gross Profit vs Cost Pie Chart */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardHeader
                  title={
                    <Typography variant='h6' align='center'>
                      Gross Profit vs Cost
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pie
                      data={{
                        labels: ['Gross Profit', 'Cost'],
                        datasets: [
                          {
                            data: [safeData.current.grossProfit, safeData.current.cost],
                            backgroundColor: ['#2196f3', '#e91e63'],
                            borderColor: ['#2196f3', '#e91e63'],
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              generateLabels: function (chart) {
                                const data = chart.data
                                if (data.labels.length && data.datasets.length) {
                                  return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i]
                                    const formattedValue = new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0
                                    })
                                      .format(value)
                                      .replace('IDR', 'Rp')

                                    return {
                                      text: `${label}: ${formattedValue}`,
                                      fillStyle: data.datasets[0].backgroundColor[i],
                                      strokeStyle: data.datasets[0].borderColor[i],
                                      lineWidth: data.datasets[0].borderWidth,
                                      hidden: false,
                                      index: i
                                    }
                                  })
                                }
                                return []
                              }
                            },
                            onHover: function (event, legendItem, legend) {
                              legend.chart.canvas.style.cursor = 'pointer'
                            },
                            onLeave: function (event, legendItem, legend) {
                              legend.chart.canvas.style.cursor = 'default'
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.label || ''
                                const value = context.parsed || 0
                                const formattedValue = new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                })
                                  .format(value)
                                  .replace('IDR', 'Rp')
                                return `${label}: ${formattedValue}`
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue vs Net Profit Pie Chart */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardHeader
                  title={
                    <Typography variant='h6' align='center'>
                      Revenue vs Net Profit
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pie
                      data={{
                        labels: ['Revenue', 'Net Profit'],
                        datasets: [
                          {
                            data: [safeData.current.revenue, safeData.current.netProfit],
                            backgroundColor: ['#2196f3', '#e91e63'],
                            borderColor: ['#2196f3', '#e91e63'],
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              generateLabels: function (chart) {
                                const data = chart.data
                                if (data.labels.length && data.datasets.length) {
                                  return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i]
                                    const formattedValue = new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0
                                    })
                                      .format(value)
                                      .replace('IDR', 'Rp')

                                    return {
                                      text: `${label}: ${formattedValue}`,
                                      fillStyle: data.datasets[0].backgroundColor[i],
                                      strokeStyle: data.datasets[0].borderColor[i],
                                      lineWidth: data.datasets[0].borderWidth,
                                      hidden: false,
                                      index: i
                                    }
                                  })
                                }
                                return []
                              }
                            },
                            onHover: function (event, legendItem, legend) {
                              legend.chart.canvas.style.cursor = 'pointer'
                            },
                            onLeave: function (event, legendItem, legend) {
                              legend.chart.canvas.style.cursor = 'default'
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.label || ''
                                const value = context.parsed || 0
                                const formattedValue = new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                })
                                  .format(value)
                                  .replace('IDR', 'Rp')
                                return `${label}: ${formattedValue}`
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}
