// ** MUI Imports
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const OPTIONS = [
  { value: 'card', label: 'Tampilan Card', icon: 'tabler:layout-grid' },
  { value: 'table', label: 'Tampilan Tabel', icon: 'tabler:table' }
]

/**
 * ViewModeToggle
 * -------------------------------------------------------------------------------------
 * Pill-shaped switch between the `card` and `table` layouts of a list page.
 * Controlled: the page owns `value` and persists it if it wants to.
 */
export default function ViewModeToggle({ value, onChange }) {
  return (
    <Box
      role='group'
      aria-label='Tampilan daftar'
      sx={{
        p: 0.5,
        gap: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: `${radii.full}px`,
        border: `1px solid ${colors.border3}`,
        backgroundColor: colors.background,
        boxShadow: shadows.xs
      }}
    >
      {OPTIONS.map(option => {
        const selected = option.value === value

        return (
          <Tooltip key={option.value} title={option.label}>
            <IconButton
              size='small'
              aria-label={option.label}
              aria-pressed={selected}
              onClick={() => !selected && onChange?.(option.value)}
              sx={{
                p: 1.5,
                borderRadius: `${radii.full}px`,
                color: selected ? colors.primaryForeground : colors.mutedForeground,
                backgroundColor: selected ? stone[600] : 'transparent',
                '&:hover': { backgroundColor: selected ? stone[600] : stone[100] }
              }}
            >
              <Icon icon={option.icon} fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        )
      })}
    </Box>
  )
}
