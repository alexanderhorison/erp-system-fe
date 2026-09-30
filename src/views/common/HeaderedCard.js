// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

/**
 * HeaderedCard
 * -------------------------------------------------------------------------------------
 * The standard panel. A single rounded, bordered card with a stone-100 header
 * strip (title, optional right-aligned meta / action) and a body below it — one
 * continuous border, not two separately-bordered boxes stacked together.
 *
 * Every titled panel in the app uses this — side-panel cards on detail pages
 * ("Action", "Informasi Tambahan"), "Catatan", and so on. Don't hand-roll a
 * Card with an inline title.
 */
export default function HeaderedCard({ title, meta, action, children, sx, contentSx }) {
  return (
    <Box
      sx={{
        borderRadius: `${radii['3xl']}px`,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        boxShadow: shadows.xs,
        overflow: 'hidden',
        ...sx
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          backgroundColor: stone[100],
          borderTopLeftRadius: `${radii['3xl']}px`,
          borderTopRightRadius: `${radii['3xl']}px`
        }}
      >
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}>
          {title}
        </Typography>
        {meta && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              lineHeight: '16px',
              color: colors.mutedForeground,
              whiteSpace: 'nowrap'
            }}
          >
            {meta}
          </Typography>
        )}
        {action}
      </Box>

      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${colors.border}`,
          borderBottomLeftRadius: `${radii['3xl']}px`,
          borderBottomRightRadius: `${radii['3xl']}px`,
          backgroundColor: colors.background,
          ...contentSx
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
