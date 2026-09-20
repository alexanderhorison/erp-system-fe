// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * DashboardPo1
 * -------------------------------------------------------------------------------------
 * "Top 5 Vendor dengan Total Nominal PO Tertinggi" (Figma: purchase-order
 * dashboard — "Top 5 Vendor - Nominal PO Tertinggi").
 */
export default function DashboardPo1({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.vendorName,
    value: Number(item.totalNominal) || 0,
    displayValue: priceFormatWIthCurrency(item.totalNominal, false)
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Vendor dengan Total Nominal PO Tertinggi'
      subtitle='Total nilai purchase order per vendor'
      rows={rows}
      color={colors.link}
      loading={loading}
    />
  )
}
