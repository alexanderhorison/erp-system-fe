import Chip from '@mui/material/Chip'

import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

/**
 * Status pill used across the app. Active renders green (`status.success`);
 * Inactive renders as a plain outlined chip — no fill.
 *
 * Document statuses (Pending, Approved, ...) go through the same pill: pass
 * `label` and a `tone` (`success | danger | warning | info`, or omit for the
 * plain outlined look) instead of `isActive`. `src/@core/components/common/Status`
 * does this mapping for the API's status strings.
 */
export default function StatusChip({ isActive, activeLabel = 'Active', inactiveLabel = 'Inactive', label, tone }) {
  const palette = tone ? statusTokens[tone] : isActive ? statusTokens.success : undefined
  const text = label ?? (isActive ? activeLabel : inactiveLabel)

  return (
    <Chip
      size='small'
      label={text}
      sx={{
        height: 24,
        borderRadius: `${radii.full}px`,
        border: `1px solid ${palette ? palette.border : colors.border}`,
        backgroundColor: palette ? palette.bg : 'transparent',
        '& .MuiChip-label': {
          px: 2,
          fontSize: '0.75rem',
          lineHeight: '16px',
          color: palette ? palette.fg : colors.mutedForeground
        }
      }}
    />
  )
}
