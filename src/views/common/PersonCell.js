import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * PersonCell
 * -------------------------------------------------------------------------------------
 * A `DataTable` cell: person's name over their role. `person` is an object, so
 * the grid cannot sort or filter this column by value — mark the column
 * `sortable: false`. Was copy-pasted into most tables with a "created by" /
 * "approved by" column — see docs/REVAMP_BASELINE.md `DataTable`.
 *
 * Different endpoints name the role field differently (`role` vs `roleName`);
 * both are read here rather than forcing every caller to normalise first.
 */
export default function PersonCell({ person }) {
  if (!person?.name) {
    return (
      <Typography variant='body2' sx={{ color: colors.mutedForeground }}>
        -
      </Typography>
    )
  }

  const roleLabel = person.roleName || person.role

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography noWrap variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
        {person.name}
      </Typography>
      {roleLabel && (
        <Typography noWrap sx={{ fontSize: '0.75rem', lineHeight: '16px', color: colors.mutedForeground }}>
          {roleLabel}
        </Typography>
      )}
    </Box>
  )
}
