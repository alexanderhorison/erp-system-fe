// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, radii } from 'src/configs/designTokens'

const chipSx = {
  height: 24,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${colors.border}`,
  backgroundColor: 'transparent',
  '& .MuiChip-label': {
    px: 2,
    fontSize: '0.75rem',
    lineHeight: '16px',
    color: colors.foregroundAlt
  }
}

/**
 * ProductInfoHeader
 * -------------------------------------------------------------------------------------
 * Product name plus a row of outlined chips summarising its unit and stock
 * levels (Figma: "Sesuaikan Stok" / "Transformasi Produk" dialogs).
 *
 * Replaces the illustrated `CardAdjustProduct` block, which the redesign drops
 * in favour of this compact header.
 */
export default function ProductInfoHeader({ data }) {
  const chips = [
    data?.unitName && { key: 'unit', label: `Unit: ${data.unitName}` },
    data?.quantity !== undefined && { key: 'stock', label: `Stok Tersedia: ${data.quantity}` },
    data?.minimumStock !== undefined && { key: 'min', label: `Stok Minimal: ${data.minimumStock}` }
  ].filter(Boolean)

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: '24px', color: colors.foreground, mb: 2 }}>
        {data?.productName || '-'}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {chips.map(chip => (
          <Chip key={chip.key} label={chip.label} size='small' sx={chipSx} />
        ))}
      </Box>
    </Box>
  )
}
