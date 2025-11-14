// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'

export default function TableHeaderPointOfSale(props) {
  const { printerHealthStatus, loadingPrinterHealth } = useSelector(state => state.printer)
  const printerPos = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null

  // Find health status for selected printer based on IP
  const healthStatus = printerHealthStatus?.find(status => status.ip === printerPos?.ip)

  const isConnected = healthStatus?.status === 'ONLINE'
  const isLoading = loadingPrinterHealth

  // Status printer akan di-fetch dari backend dan masuk ke Redux
  // Tidak perlu manual connect lagi dari frontend

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

      {/* Status Printer - Data dari Backend via Redux */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon
          fontSize='0.8rem'
          icon={isConnected ? 'tabler:circle-check' : 'tabler:circle-x'}
          style={{ color: isConnected ? 'green' : 'red' }}
        />
        <Typography fontSize={'0.8rem'} sx={{ fontWeight: 400, textWrap: 'nowrap' }}>
          Status Printer: "{printerPos?.name}"{' '}
          {isLoading ? <CircularProgress size={14} color='inherit' /> : isConnected ? '(Online)' : '(Offline)'}
        </Typography>
      </Box>
    </Box>
  )
}
