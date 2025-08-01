import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardFinanceProfitLossYearly } from 'src/store/apps/dashboard'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chart from 'chart.js/auto'

export default function DashboardProfitLossYearly() {
  const dispatch = useDispatch()
  const { dataDashboardFinanceProfitLossYearly } = useSelector(state => state.dashboard)
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    dispatch(fetchDashboardFinanceProfitLossYearly({}))
  }, [dispatch])

  useEffect(() => {
    if (dataDashboardFinanceProfitLossYearly && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')

      // Prepare data for chart
      const years = dataDashboardFinanceProfitLossYearly.map(item => item.year.toString())
      // const hargaJual = dataDashboardFinanceProfitLossYearly.map(item => item.hargaJual / 1000000000) // Convert to billions
      // const hargaModal = dataDashboardFinanceProfitLossYearly.map(item => item.hargaModal / 1000000000) // Convert to billions
      const gainLoss = dataDashboardFinanceProfitLossYearly.map(item => item.gainLoss / 1000000) // Convert to billions

      // Format currency helper function
      const formatCurrency = value => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
          .format(value * 1000000)
          .replace('IDR', 'Rp')
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            // {
            //   label: 'Harga Jual',
            //   data: hargaJual,
            //   backgroundColor: 'rgba(54, 162, 235, 0.8)',
            //   borderColor: 'rgba(54, 162, 235, 1)',
            //   borderWidth: 1,
            //   barThickness: 40
            // },
            // {
            //   label: 'Harga Modal',
            //   data: hargaModal,
            //   backgroundColor: 'rgba(255, 99, 132, 0.8)',
            //   borderColor: 'rgba(255, 99, 132, 1)',
            //   borderWidth: 1,
            //   barThickness: 40
            // },
            {
              label: 'Gain/Loss',
              data: gainLoss,
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              barThickness: 40
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Grafik Laba Rugi dari tahun ke tahun',
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
                  const value = context.parsed.y
                  return label + ': ' + formatCurrency(value)
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nilai (Ratusan Juta Rupiah)'
              },
              ticks: {
                stepSize: 20,
                callback: function (value) {
                  return 'Rp ' + value + ' juta'
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Tahun'
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      })
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [dataDashboardFinanceProfitLossYearly])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <div style={{ height: '400px', width: '100%' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
