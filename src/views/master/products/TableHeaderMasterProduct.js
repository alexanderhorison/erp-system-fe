// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button } from '@mui/material'

export default function TableHeaderMasterPoduct(props) {
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
      <CustomTextField
        value={props.value}
        placeholder={props?.placeholder || "Cari ..."}
        onChange={props.onChange}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 4, display: 'flex' }}>
              <Icon fontSize='1.25rem' icon='tabler:search' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
              <Icon fontSize='1.25rem' icon='tabler:x' />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          onClick={props.onDownloadTemplate}
          variant='contained'
          disabled={props.loadingDownload}
          sx={{
            '& svg': { mr: 2 }
          }}
        >
          <Icon fontSize='1.125rem' icon='tabler:download' />
          Download Template
        </Button>
        <Button
          variant='contained'
          component='label'
          disabled={props.loadingImport}
          sx={{
            '& svg': { mr: 2 }
          }}
        >
          <Icon fontSize='1.125rem' icon='tabler:upload' />
          Import Template
          <input
            type='file'
            accept='.xlsx,.xls'
            hidden
            onChange={props.onImportTemplate}
          />
        </Button>
        <Button onClick={() => props.openModalAdd(true)} variant='contained' sx={{
          width: '100%',
          '@media (min-width: 600px)': {
            width: 'auto',
          }, '& svg': { mr: 2 }
        }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambahkan Produk
        </Button>
      </Box>
    </Box>
  )
}
