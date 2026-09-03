import Chip from '@mui/material/Chip'

import { colors, radii, status as statusTokens } from 'src/configs/designTokens'

// ** Employment status has four states, each with its own tone: Tetap green,
// Magang amber, Tidak Aktif red. Kontrak (and any other value) falls through
// to a plain outlined chip — the same "no fill" treatment `StatusChip` uses
// for an inactive record, since a fixed-term contract isn't good or bad.
const STATUS_TONE = {
  Tetap: statusTokens.success,
  Magang: statusTokens.warning,
  'Tidak Aktif': statusTokens.danger
}

/**
 * EmployeeStatusChip
 * -------------------------------------------------------------------------------------
 * Used on both the employee list and the employee detail card, so the badge
 * reads identically wherever it appears.
 */
export default function EmployeeStatusChip({ status, isActive }) {
  const label = isActive ? status || 'Tetap' : 'Tidak Aktif'
  const tone = STATUS_TONE[label]

  return (
    <Chip
      size='small'
      label={label}
      sx={{
        height: 24,
        borderRadius: `${radii.full}px`,
        border: `1px solid ${tone ? tone.border : colors.border}`,
        backgroundColor: tone ? tone.bg : 'transparent',
        '& .MuiChip-label': {
          px: 2,
          fontSize: '0.75rem',
          lineHeight: '16px',
          color: tone ? tone.fg : colors.mutedForeground
        }
      }}
    />
  )
}
