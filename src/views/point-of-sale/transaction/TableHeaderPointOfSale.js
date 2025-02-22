// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CircularProgress } from '@mui/material'
import { connectToPrinter } from 'src/utils/printerHelper'

export default function TableHeaderPointOfSale(props) {
  const dispatch = useDispatch()
  const { printerConfig, loadingPrinterConfig, printerStatus } = useSelector(state => state.config)

  const isConnected = printerStatus.connected
  const isLoading = printerStatus.loading

  const handleReconnect = () => {
    connectToPrinter({ printerConfig, dispatch })
  }
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
        placeholder={props?.placeholder || 'Search…'}
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

      {/* Status Printer dengan Ikon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon
          fontSize='0.8rem'
          icon={isConnected ? 'tabler:circle-check' : 'tabler:circle-x'}
          style={{ color: isConnected ? 'green' : 'red' }}
        />
        <Typography fontSize={'0.8rem'} sx={{ fontWeight: 400, textWrap: 'nowrap' }}>
          Status Printer: {isLoading ? (<CircularProgress size={14} color="inherit" />) : isConnected ? '(Online)' : '(Offline)'}
        </Typography>
        {/* Button Reconnect */}
        {!isConnected && !isLoading && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={handleReconnect}
            disabled={isLoading} // Tombol dinonaktifkan saat loading
          >
            {isLoading ? <CircularProgress size={14} color="inherit" /> : 'Reconnect'}

            {!isLoading && <Icon icon="tabler:refresh" />}
          </Button>
        )}

      </Box>
    </Box>
  )
}
