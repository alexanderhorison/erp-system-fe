// ** Custom Components Imports
import DashboardRankedBarList from 'src/views/dashboards/common/DashboardRankedBarList'

// designTokens.js has no purple in its ramp. Using a literal Tailwind
// violet-500 here — a deliberate, called-out exception (same precedent as
// `barterTone` in the sales-order form, and DashboardSo4), since this card
// is specifically about barter POs.
const barterBarColor = '#8B5CF6'

/**
 * DashboardPo4
 * -------------------------------------------------------------------------------------
 * "Top 5 Vendor Dengan PO Barter Tertinggi" (Figma: purchase-order dashboard
 * — "Vendor - PO Barter Tertinggi").
 */
export default function DashboardPo4({ data = [], loading = false }) {
  const rows = data.map(item => ({
    label: item.vendorName,
    value: Number(item.totalPoBarter) || 0,
    displayValue: `${item.totalPoBarter} Surat`
  }))

  return (
    <DashboardRankedBarList
      title='Top 5 Vendor Dengan PO Barter Tertinggi'
      subtitle='Jumlah surat purchase order barter per vendor'
      rows={rows}
      color={barterBarColor}
      loading={loading}
    />
  )
}
