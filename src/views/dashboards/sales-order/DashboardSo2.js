// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'

// ** Design Tokens
import { status as statusTokens } from 'src/configs/designTokens'

/**
 * DashboardSo2
 * -------------------------------------------------------------------------------------
 * "Top 5 Customer dengan Total Surat SO Terbanyak" (Figma: sales-order
 * dashboard).
 */
export default function DashboardSo2({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.customerName,
    value: Number(item.totalSo) || 0,
    displayValue: `${item.totalSo} Surat`
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Customer dengan Total Surat SO Terbanyak'
      subtitle='Jumlah surat sales order per customer'
      rows={rows}
      color={statusTokens.success.fg}
      loading={loading}
    />
  )
}
