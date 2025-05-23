import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'

const TableHeaderMasterEmployee = props => {
  // ** Props
  const { value, clearSearch, onChange, openModalAdd, placeholder } = props

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
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
        {/* <GridToolbarExport printOptions={{ disableToolbarButton: true }} /> */}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mb: 2 }}
          color='primary'
          variant='contained'
          startIcon={<Icon icon='tabler:plus' />}
          onClick={() => openModalAdd(true)}
        >
          {t('Tambah')}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeaderMasterEmployee
