// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'

// ** Helpers
import { formatDiff } from './stockOpnameDiff'

const SummaryRow = ({ label, count, total }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Typography variant='body2' sx={{ color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
      {count} produk ({total === 0 ? 0 : formatDiff(total)})
    </Typography>
  </Box>
)

export default function SummaryStockOpname({ summary }) {
  return (
    <HeaderedCard title='Ringkasan' sx={{ mt: 4 }} contentSx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <SummaryRow label='Selisih Kurang' count={summary.lessCount} total={summary.lessTotal} />
      <SummaryRow label='Selisih Lebih' count={summary.moreCount} total={summary.moreTotal} />
    </HeaderedCard>
  )
}
