import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'

const TableHeaderMasterEmployee = props => {
  // ** Props
  const { value, clearSearch, onChange, openModalAdd, placeholder, filters = {}, onFilterChange } = props

  const { t } = useTranslation()

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <TextField
          size='small'
          value={value}
          sx={{ minWidth: 250 }}
          placeholder={placeholder || t('Search')}
          onChange={e => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon icon='tabler:search' fontSize='1.25rem' />
              </Box>
            ),
            endAdornment: value && (
              <Box sx={{ alignItems: 'center', cursor: 'pointer' }} onClick={clearSearch}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </Box>
            )
          }}
        />

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => onFilterChange?.('status', e.target.value)}
          >
            <MenuItem value="">
              <em>Semua Status</em>
            </MenuItem>
            <MenuItem value="Tetap">Tetap</MenuItem>
            <MenuItem value="Kontrak">Kontrak</MenuItem>
            <MenuItem value="Magang">Magang</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Status Filter Button - only show when status filter is active */}
        {filters.status && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onFilterChange?.('status', '')}
            startIcon={<Icon icon='tabler:filter-off' />}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Clear
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          color='primary'
          variant='contained'
          startIcon={<Icon icon='tabler:plus' />}
          onClick={() => openModalAdd(true)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            '& svg': { mr: 2 }
          }}
        >
          {t('Tambah')}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeaderMasterEmployee
