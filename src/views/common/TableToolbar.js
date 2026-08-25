// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Design Tokens
import { colors, shadows } from 'src/configs/designTokens'

/**
 * TableToolbar
 * -------------------------------------------------------------------------------------
 * Shared toolbar above a data table (Figma: table Card header row).
 *
 * Left:  search field, plus an optional "Filters" button when `onOpenFilters` is given.
 * Right: caller-supplied actions.
 *
 * Replaces the per-module `TableHeader*` components. Search props keep the same
 * names those components used (`value`, `onChange`, `clearSearch`, `placeholder`)
 * so DataGrid `slotProps.toolbar` wiring carries over unchanged.
 */
export default function TableToolbar({
  value,
  onChange,
  clearSearch,
  placeholder = 'Search ...',
  onOpenFilters,
  activeFilterCount = 0,
  actions = null,
  children
}) {
  return (
    <Box
      sx={{
        p: 4,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Search + filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <CustomTextField
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon fontSize='1.125rem' icon='tabler:search' />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position='end'>
                <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearSearch}>
                  <Icon fontSize='1.125rem' icon='tabler:x' />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{ width: { xs: '100%', sm: 320 } }}
        />

        {onOpenFilters && (
          <Button
            variant='outlined'
            color='secondary'
            onClick={event => onOpenFilters(event.currentTarget)}
            startIcon={<Icon icon='tabler:filter' fontSize='1rem' />}
            sx={{
              color: colors.foreground,
              borderColor: colors.border3,
              boxShadow: shadows.xs,
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: colors.border3 }
            }}
          >
            {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
          </Button>
        )}
      </Box>

      {/* Actions */}
      {(actions || children) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {actions}
          {children}
        </Box>
      )}
    </Box>
  )
}
