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
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { fetchDashboardFinanceProfitLoss } from 'src/store/apps/dashboard'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardProfitLoss() {
  const dispatch = useDispatch()
  const { dataDashboardFinanceProfitLoss } = useSelector(state => state.dashboard)

  // State untuk filter
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedTypeOfMonth, setSelectedTypeOfMonth] = useState('quarter')
  const [selectedPeriod, setSelectedPeriod] = useState(1)

  // Generate tahun options (5 tahun terakhir sampai tahun depan)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let i = currentYear - 4; i <= currentYear + 1; i++) {
    yearOptions.push(i)
  }

  // Type of month options
  const typeOfMonthOptions = [
    { value: 'quarter', label: 'Quarter' },
    { value: 'semester', label: 'Semester' }
  ]

  // Dynamic period options based on typeOfMonth
  const getPeriodOptions = () => {
    if (selectedTypeOfMonth === 'quarter') {
      return [
        { value: 1, label: 'Quarter 1' },
        { value: 2, label: 'Quarter 2' },
        { value: 3, label: 'Quarter 3' },
        { value: 4, label: 'Quarter 4' }
      ]
    } else if (selectedTypeOfMonth === 'semester') {
      return [
        { value: 1, label: 'Semester 1' },
        { value: 2, label: 'Semester 2' }
      ]
    }
    return []
  }

  // Reset period when typeOfMonth changes
  useEffect(() => {
    setSelectedPeriod(1)
  }, [selectedTypeOfMonth])

  useEffect(() => {
    // Only dispatch if the current period is valid for the selected typeOfMonth
    const validPeriods = getPeriodOptions().map(option => option.value)
    if (validPeriods.includes(selectedPeriod)) {
      dispatch(
        fetchDashboardFinanceProfitLoss({
          year: selectedYear,
          typeOfMonth: selectedTypeOfMonth,
          period: selectedPeriod
        })
      )
    }
  }, [dispatch, selectedYear, selectedTypeOfMonth, selectedPeriod])

  // Prepare chart data
  const chartData = {
    labels: dataDashboardFinanceProfitLoss?.map(item => item.labelMonth) || [],
    datasets: [
      {
        label: 'Harga Jual',
        data: dataDashboardFinanceProfitLoss?.map(item => item.hargaJual / 1000000000) || [], // Convert to billions
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 40
      },
      {
        label: 'Harga Modal',
        data: dataDashboardFinanceProfitLoss?.map(item => item.hargaModal / 1000000000) || [], // Convert to billions
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 40
      },
      {
        label: 'Gain/Loss',
        data: dataDashboardFinanceProfitLoss?.map(item => item.gainLoss / 1000000000) || [], // Convert to billions
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Grafik Laba Rugi - ${
          selectedTypeOfMonth.charAt(0).toUpperCase() + selectedTypeOfMonth.slice(1)
        } ${selectedPeriod} Tahun ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y || 0
            const originalValue = value * 1000000000 // Convert back to original value
            const formattedValue = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
              .format(originalValue)
              .replace('IDR', 'Rp')
            return `${label}: ${formattedValue}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nilai (Miliar Rupiah)'
        },
        ticks: {
          callback: function (value) {
            return 'Rp ' + value.toFixed(0) + ' M'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Bulan'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  // Prepare line chart data
  const lineChartData = {
    labels: dataDashboardFinanceProfitLoss?.map(item => item.labelMonth) || [],
    datasets: [
      {
        label: 'Pendapatan',
        data: dataDashboardFinanceProfitLoss?.map(item => item.pendapatan / 1000000000) || [], // Convert to billions
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: false
      }
    ]
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Pendapatan Bulanan - ${
          selectedTypeOfMonth.charAt(0).toUpperCase() + selectedTypeOfMonth.slice(1)
        } ${selectedPeriod} Tahun ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y || 0
            const originalValue = value * 1000000000 // Convert back to original value
            const formattedValue = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
              .format(originalValue)
              .replace('IDR', 'Rp')
            return `${label}: ${formattedValue}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nilai (Miliar Rupiah)'
        },
        ticks: {
          callback: function (value) {
            return 'Rp ' + value.toFixed(0) + ' M'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Bulan'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant='h6' align='center'>
            Dashboard Profit Loss
          </Typography>
        }
      />
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
                <InputLabel>Type of Month</InputLabel>
                <Select
                  value={selectedTypeOfMonth}
                  label='Type of Month'
                  onChange={e => setSelectedTypeOfMonth(e.target.value)}
                >
                  {typeOfMonthOptions.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select value={selectedPeriod} label='Period' onChange={e => setSelectedPeriod(e.target.value)}>
                  {getPeriodOptions().map(period => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Line Chart Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Card
                sx={{
                  background: '#ffffff',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Line data={lineChartData} options={lineChartOptions} />
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
