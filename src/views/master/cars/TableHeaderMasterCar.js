// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export default function TableHeaderMasterCar(props) {
  const {
    value,
    placeholder,
    onChange,
    clearSearch,
    openModalAdd,
    filters = {},
    onFilterChange
  } = props

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
          placeholder={placeholder || "Cari nama mobil atau plat nomor"}
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
          size="small"
          sx={{
            minWidth: 130,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => onFilterChange?.('status', e.target.value)}
          >
            <MenuItem value="">
              <em>Semua Status</em>
            </MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Status Filter Button - only show when status filter is active */}
        {filters.status && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onFilterChange?.('status', '')}
            startIcon={<Icon icon='tabler:x' />}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Right side: Add Button */}
      <Button
        onClick={() => openModalAdd(true)}
        variant='contained'
        sx={{
          width: { xs: '100%', sm: 'auto' },
          '& svg': { mr: 2 }
        }}
      >
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        Tambahkan Mobil
      </Button>
    </Box>
  )
}