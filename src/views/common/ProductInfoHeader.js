// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, radii, status } from 'src/configs/designTokens'

const baseChipSx = {
  height: 24,
  borderRadius: `${radii.full}px`,
  '& .MuiChip-label': {
    px: 2,
    fontSize: '0.75rem',
    lineHeight: '16px'
  }
}

// ** Neutral chip: outlined, no fill.
const chipSx = {
  ...baseChipSx,
  border: `1px solid ${colors.border}`,
  backgroundColor: 'transparent',
  '& .MuiChip-label': {
    ...baseChipSx['& .MuiChip-label'],
    color: colors.foregroundAlt
  }
}

// ** Tinted chip, for the available-stock reading.
const toneChipSx = tone => ({
  ...baseChipSx,
  border: `1px solid ${tone.border}`,
  backgroundColor: tone.bg,
  '& .MuiChip-label': {
    ...baseChipSx['& .MuiChip-label'],
    color: tone.fg,
    fontWeight: 500
  }
})

/**
 * Stock health, by available quantity against the product's minimum:
 *   0                -> danger    (out of stock)
 *   <= minimumStock  -> warning    (at or below the floor — the next sale drops
 *                                   it under, so the boundary counts as a warning)
 *   >  minimumStock  -> success
 *
 * With no minimum set, only the out-of-stock case is signalled.
 */
export const stockTone = (quantity, minimumStock) => {
  const stock = Number(quantity)
  if (!Number.isFinite(stock) || stock <= 0) return status.danger

  const minimum = Number(minimumStock)
  if (!Number.isFinite(minimum)) return status.success

  return stock <= minimum ? status.warning : status.success
}

/**
 * ProductInfoHeader
 * -------------------------------------------------------------------------------------
 * Product name plus a row of chips summarising its stock levels and unit
 * (Figma: "Sesuaikan Stok" / "Transformasi Produk" dialogs).
 *
 * Available stock leads the row and is colour-coded, so the number that decides
 * whether an adjustment or transformation is possible reads at a glance.
 *
 * Replaces the illustrated `CardAdjustProduct` block, which the redesign drops
 * in favour of this compact header.
 */
export default function ProductInfoHeader({ data }) {
  const hasQuantity = data?.quantity !== undefined && data?.quantity !== null
  const tone = hasQuantity ? stockTone(data.quantity, data.minimumStock) : null

  const chips = [
    data?.minimumStock !== undefined && { key: 'min', label: `Minimum Stock: ${data.minimumStock}` },
    data?.unitName && { key: 'unit', label: `Unit: ${data.unitName}` }
  ].filter(Boolean)

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: '24px', color: colors.foreground, mb: 2 }}>
        {data?.productName || '-'}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {hasQuantity && (
          <Chip label={`Available Stock: ${data.quantity}`} size='small' sx={toneChipSx(tone)} />
        )}
        {chips.map(chip => (
          <Chip key={chip.key} label={chip.label} size='small' sx={chipSx} />
        ))}
      </Box>
    </Box>
  )
}
