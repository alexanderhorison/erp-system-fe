import { Box, Card, CardContent, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

export default function CardRefreshPrinter({ onRefresh, loadingPrinterHealth, lastRefreshed }) {
  const formatTime = date => {
    if (!date) return '-'
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ py: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='subtitle1' fontWeight={600}>
              Status Printer
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Last refresh: {formatTime(lastRefreshed)}
            </Typography>
          </Box>
          <Tooltip title='Refresh status printer'>
            <span>
              <IconButton
                onClick={onRefresh}
                disabled={loadingPrinterHealth}
                size='medium'
                sx={{
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.lighter' }
                }}
              >
                {loadingPrinterHealth ? (
                  <CircularProgress size={20} />
                ) : (
                  <Icon icon='tabler:refresh' width={22} height={22} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}
