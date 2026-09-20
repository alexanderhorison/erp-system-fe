// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { status as statusTokens } from 'src/configs/designTokens'

/**
 * DashboardPo3
 * -------------------------------------------------------------------------------------
 * "Top 5 Vendor dengan Total Hutang PO Tertinggi" (Figma: purchase-order
 * dashboard).
 */
export default function DashboardPo3({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.vendorName,
    value: Number(item.totalNominalDebt) || 0,
    displayValue: priceFormatWIthCurrency(item.totalNominalDebt, false)
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Vendor dengan Total Hutang PO Tertinggi'
      subtitle='Utang belum terbayar per vendor'
      rows={rows}
      color={statusTokens.warning.fg}
      loading={loading}
    />
  )
}
