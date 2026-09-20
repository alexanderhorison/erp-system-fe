// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'

// ** Design Tokens
import { status as statusTokens } from 'src/configs/designTokens'

/**
 * DashboardPo2
 * -------------------------------------------------------------------------------------
 * "Top 5 Vendor dengan Total Surat PO Terbanyak" (Figma: purchase-order
 * dashboard).
 */
export default function DashboardPo2({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.vendorName,
    value: Number(item.totalPo) || 0,
    displayValue: `${item.totalPo} Surat`
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Vendor dengan Total Surat PO Terbanyak'
      subtitle='Jumlah surat purchase order per vendor'
      rows={rows}
      color={statusTokens.success.fg}
      loading={loading}
    />
  )
}
