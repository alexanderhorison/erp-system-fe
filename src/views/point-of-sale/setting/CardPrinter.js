import { Card, CardContent, CircularProgress, Grid, Typography, Chip } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'

export default function CardPrinter({ printer, printerHealthStatus, handleSelectPrinter }) {
  let selected = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null
  const { loadingPrinterHealth } = useSelector(state => state.printer)

  const isSelected = printer.id === selected?.id

  // Find health status based on IP
  const healthStatus = printerHealthStatus?.find(
    status => status.ip === printer.value_json?.printerHost || status.ip === printer.value_json?.ip
  )

  const isOnline = healthStatus?.status === 'ONLINE'
  const statusLabel = healthStatus?.status === 'ONLINE' ? 'Online' : 'Offline'
  const statusColor = isOnline ? 'success' : 'error'

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        bgcolor: isSelected ? '#d6bdab' : 'background.paper',
        border: isSelected ? '2px solid #8b6f47' : '1px solid transparent',
        position: 'relative'
      }}
      onClick={() => handleSelectPrinter(printer)}
    >
      <CardContent>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item xs={10}>
            <Typography variant='h6'>{printer.value}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {printer.description}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              IP: {printer.value_json.ip || printer.value_json.printerHost}
            </Typography>
            <Typography variant='body2' sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              Status:{' '}
              {loadingPrinterHealth ? (
                <CircularProgress size={16} />
              ) : (
                <Chip label={statusLabel} color={statusColor} size='small' sx={{ height: 20, fontSize: '0.7rem' }} />
              )}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isSelected && (
              <Icon icon='tabler:circle-check-filled' width={32} height={32} style={{ color: '#2e7d32' }} />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
