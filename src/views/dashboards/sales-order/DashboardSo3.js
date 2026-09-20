// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { status as statusTokens } from 'src/configs/designTokens'

/**
 * DashboardSo3
 * -------------------------------------------------------------------------------------
 * "Top 5 Customer dengan Total Hutang SO Tertinggi" (Figma: sales-order
 * dashboard).
 */
export default function DashboardSo3({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.customerName,
    value: Number(item.totalNominalDebt) || 0,
    displayValue: priceFormatWIthCurrency(item.totalNominalDebt, false)
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Customer dengan Total Hutang SO Tertinggi'
      subtitle='Utang belum terbayar per customer'
      rows={rows}
      color={statusTokens.warning.fg}
      loading={loading}
    />
  )
}
