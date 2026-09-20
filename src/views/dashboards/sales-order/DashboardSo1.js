// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * DashboardSo1
 * -------------------------------------------------------------------------------------
 * "Top 5 Customer dengan Total Nominal SO Tertinggi" (Figma: sales-order
 * dashboard — matches the mockup's "Top 5 Vendor - Nominal PO Tertinggi" bar
 * list pattern).
 */
export default function DashboardSo1({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.customerName,
    value: Number(item.totalNominal) || 0,
    displayValue: priceFormatWIthCurrency(item.totalNominal, false)
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Customer dengan Total Nominal SO Tertinggi'
      subtitle='Total nilai sales order per customer'
      rows={rows}
      color={colors.link}
      loading={loading}
    />
  )
}
