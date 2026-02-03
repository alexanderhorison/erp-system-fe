// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export default function TableHeaderPosTransaction(props) {
  const { value, placeholder, onChange, clearSearch, filters = {}, onFilterChange } = props

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      {/* Left side: Search and Status Filter */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          minWidth: { xs: '100%', sm: 'auto' }
        }}
      >
        <CustomTextField
          value={value}
          placeholder={placeholder || 'Search…'}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 4, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearSearch}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: '100%',
              sm: 250,
              md: 300
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            }
          }}
        />

        {/* Status Filter */}
        <FormControl
          size='small'
          sx={{
            minWidth: 130,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.paymentType || ''}
            label='Status'
            onChange={e => onFilterChange?.('paymentType', e.target.value)}
          >
            <MenuItem value=''>
              <em>Semua Status</em>
            </MenuItem>
            <MenuItem value='VOID'>VOID</MenuItem>
            <MenuItem value='PAID'>PAID</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Filter Button - only show when filter is active */}
        {filters.paymentType && (
          <Button
            variant='outlined'
            size='small'
            onClick={() => onFilterChange?.('paymentType', '')}
            startIcon={<Icon icon='tabler:filter-off' />}
            sx={{
              minWidth: 'auto',
              px: 2
            }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  )
}
