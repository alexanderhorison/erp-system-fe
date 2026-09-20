// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'

// designTokens.js has no purple in its ramp. Using a literal Tailwind
// violet-500 here — a deliberate, called-out exception (same precedent as
// `barterTone` in the sales-order form), since this card is specifically
// about barter SOs.
const barterBarColor = '#8B5CF6'

/**
 * DashboardSo4
 * -------------------------------------------------------------------------------------
 * "Top 5 Customer Dengan SO Barter Tertinggi" (Figma: sales-order dashboard
 * — matches the mockup's "Vendor - PO Barter Tertinggi" pattern).
 */
export default function DashboardSo4({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.customerName,
    value: Number(item.totalSoBarter) || 0,
    displayValue: `${item.totalSoBarter} Surat`
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Customer Dengan SO Barter Tertinggi'
      subtitle='Jumlah surat sales order barter per customer'
      rows={rows}
      color={barterBarColor}
      loading={loading}
    />
  )
}
