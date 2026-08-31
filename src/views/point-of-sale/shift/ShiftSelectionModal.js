import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import axios from 'src/configs/axios'
import { toast } from 'sonner'
import Icon from 'src/@core/components/icon'

const ShiftSelectionModal = ({ open, onShiftSelected }) => {
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedShift, setSelectedShift] = useState(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (open) {
      fetchAvailableShifts()
    }
  }, [open])

  const fetchAvailableShifts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/user-shift/available')
      if (response.data?.success) {
        setShifts(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching shifts:', error)
      toast.error(error.response?.data?.message || 'Failed to load shift data')
    } finally {
      setLoading(false)
    }
  }

  const handleStartShift = async () => {
    if (!selectedShift) {
      toast.error('Please select a shift first')
      return
    }

    try {
      setStarting(true)
      const response = await axios.post('/user-shift/start', {
        masterShiftId: selectedShift.id
      })

      if (response.data?.success) {
        toast.success('Shift started successfully')
        onShiftSelected(response.data.data)
      }
    } catch (error) {
      console.error('Error starting shift:', error)
      toast.error(error.response?.data?.message || 'Failed to start shift')
    } finally {
      setStarting(false)
    }
  }

  const formatTime = time => {
    if (!time) return ''
    // Time format is HH:mm:ss, we only need HH:mm
    return time.substring(0, 5)
  }

  return (
    <Dialog
      open={open}
      maxWidth='md'
      fullWidth
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' gap={2}>
          <Icon icon='mdi:clock-outline' fontSize={24} />
          <Typography variant='h5'>Pilih Shift</Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          Anda harus memilih shift untuk dapat mengakses Point of Sale
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
            <CircularProgress />
          </Box>
        ) : shifts.length === 0 ? (
          <Alert severity='warning'>Tidak ada shift yang tersedia. Silakan hubungi administrator.</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {shifts.map(shift => (
              <Grid item xs={12} sm={6} md={4} key={shift.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedShift?.id === shift.id ? 2 : 1,
                    borderColor: selectedShift?.id === shift.id ? 'primary.main' : 'divider',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => setSelectedShift(shift)}
                >
                  <CardContent>
                    <Box display='flex' flexDirection='column' alignItems='center' textAlign='center'>
                      <Icon
                        icon='mdi:clock-time-four-outline'
                        fontSize={48}
                        color={selectedShift?.id === shift.id ? 'primary' : 'action'}
                      />
                      <Typography variant='h6' sx={{ mt: 2, mb: 1 }}>
                        {shift.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {formatTime(shift.startShift)} - {formatTime(shift.endShift)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant='contained'
          onClick={handleStartShift}
          disabled={!selectedShift || starting}
          startIcon={starting ? <CircularProgress size={20} /> : <Icon icon='mdi:check' />}
          fullWidth
          size='large'
        >
          {starting ? 'Memulai Shift...' : 'Mulai Shift'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShiftSelectionModal
