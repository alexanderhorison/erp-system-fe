// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, radii } from 'src/configs/designTokens'

/**
 * DashboardSectionLabel
 * -------------------------------------------------------------------------------------
 * Plain section label above a group of dashboard cards (Figma: "Distribusi &
 * Pergerakan Stok" / "Produk & Dokumen") — no number or rule, unlike
 * `SectionHeading`, which is for numbered form sections.
 */
export default function DashboardSectionLabel({ title }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.border, borderRadius: `${radii.full}px` }} />
    </Box>
  )
}
