import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { colors } from 'src/configs/designTokens'

/**
 * SectionHeading
 * -------------------------------------------------------------------------------------
 * A numbered circle, a title, and a rule filling the rest of the row —
 * "① Informasi Pribadi ————". Used to mark off numbered sections in a
 * multi-part form or detail page (Figma: numbered section header).
 *
 * Not a page-level heading — pair it above a card, table, or content block,
 * one per logical section.
 */
export default function SectionHeading({ number, title }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <Box
        sx={{
          width: 22,
          height: 22,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.foreground,
          color: colors.primaryForeground,
          fontSize: '0.75rem',
          fontWeight: 600
        }}
      >
        {number}
      </Box>
      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, height: '1px', backgroundColor: colors.border }} />
    </Box>
  )
}
