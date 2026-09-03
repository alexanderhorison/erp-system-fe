import Chip from '@mui/material/Chip'

import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

/**
 * Active/Inactive badge used on every master-data table. Active renders green
 * (`status.success`); Inactive renders as a plain outlined chip — no fill.
 */
export default function StatusChip({ isActive, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return (
    <Chip
      size='small'
      label={isActive ? activeLabel : inactiveLabel}
      sx={{
        height: 24,
        borderRadius: `${radii.full}px`,
        border: `1px solid ${isActive ? statusTokens.success.border : colors.border}`,
        backgroundColor: isActive ? statusTokens.success.bg : 'transparent',
        '& .MuiChip-label': {
          px: 2,
          fontSize: '0.75rem',
          lineHeight: '16px',
          color: isActive ? statusTokens.success.fg : colors.mutedForeground
        }
      }}
    />
  )
}
