import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { returnFormatTime } from 'src/helpers/formatDate'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * DateCell
 * -------------------------------------------------------------------------------------
 * A `DataTable` cell: date over the time it happened, so the column stays
 * narrow. Was copy-pasted into most revamped tables — see
 * docs/REVAMP_BASELINE.md `DataTable`.
 *
 * `date` is the already-formatted display string (e.g. from
 * `returnFormatDateDay`); `timestamp` is the raw value passed to
 * `returnFormatTime` for the caption underneath.
 */
export default function DateCell({ date, timestamp }) {
  if (!date) {
    return (
      <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
        -
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {date}
      </Typography>
      <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
        {returnFormatTime(timestamp)}
      </Typography>
    </Box>
  )
}
