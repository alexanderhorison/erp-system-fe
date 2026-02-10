import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { priceFormat } from 'src/helpers/priceFormatter'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

const EndShiftModal = ({ open, onClose, onShiftEnded }) => {
  const router = useRouter()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [ending, setEnding] = useState(false)

  useEffect(() => {
    if (open) {
      fetchShiftSummary()
    }
  }, [open])

  const fetchShiftSummary = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/user-shift/summary')
      if (response.data?.success) {
        setSummary(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching shift summary:', error)
      toast.error(error.response?.data?.message || 'Gagal mengambil ringkasan shift')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleEndShift = async () => {
    try {
      setEnding(true)
      const response = await axios.put('/user-shift/end')

      if (response.data?.success) {
        toast.success('Shift berhasil diakhiri')
        handleClose()

        // Call onShiftEnded callback first
        if (onShiftEnded) {
          onShiftEnded()
        }

        // Redirect to shift selection page
        setTimeout(() => {
          router.push('/point-of-sale-shift')
        }, 500)
      }
    } catch (error) {
      console.error('Error ending shift:', error)
      toast.error(error.response?.data?.message || 'Gagal mengakhiri shift')
    } finally {
      setEnding(false)
    }
  }

  const handleClose = () => {
    setShowConfirmation(false)
    setSummary(null)
    onClose()
  }

  const formatTime = time => {
    if (!time) return '-'
    return time.substring(0, 5)
  }

  const formatDateTime = dateTime => {
    if (!dateTime) return '-'
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm')
  }

  if (showConfirmation) {
    return (
      <Dialog open={open} onClose={!ending ? () => setShowConfirmation(false) : undefined} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={2}>
            <Icon icon='mdi:alert-circle-outline' fontSize={32} color='warning' />
            <Typography variant='h5'>Konfirmasi Akhiri Shift</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin mengakhiri shift sekarang? Setelah shift diakhiri, Anda akan kembali ke halaman
            pemilihan shift.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)} disabled={ending}>
            Batal
          </Button>
          <Button
            onClick={handleEndShift}
            variant='contained'
            color='error'
            disabled={ending}
            startIcon={ending ? <CircularProgress size={20} /> : <Icon icon='mdi:check' />}
          >
            {ending ? 'Mengakhiri...' : 'Ya, Akhiri Shift'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' gap={2}>
          <Icon icon='mdi:clipboard-text-outline' fontSize={32} />
          <Typography variant='h5'>Ringkasan Shift</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
            <CircularProgress />
          </Box>
        ) : summary ? (
          <Box>
            {/* Shift Information Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Informasi Shift
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' color='text.secondary'>
                      Nama Shift
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {summary.shiftName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' color='text.secondary'>
                      Waktu Shift
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {formatTime(summary.masterShiftStartTime)} - {formatTime(summary.masterShiftEndTime)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' color='text.secondary'>
                      Mulai Shift Aktual
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {formatDateTime(summary.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' color='text.secondary'>
                      Durasi Shift
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {(() => {
                        const start = dayjs(summary.createdAt)
                        const now = dayjs()
                        const diff = now.diff(start, 'minute')
                        const hours = Math.floor(diff / 60)
                        const minutes = diff % 60
                        return `${hours} jam ${minutes} menit`
                      })()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Performance Summary Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Ringkasan Performa
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box textAlign='center'>
                      <Typography variant='h3' fontWeight={600} color='primary.main'>
                        {summary.totalTransaction}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Total Transaksi
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box textAlign='center'>
                      <Typography variant='h3' fontWeight={600} color='success.main'>
                        {priceFormat(summary.grandTotalTransaction)}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Grand Total
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Alert severity='info' sx={{ mb: 2 }}>
              <Typography variant='body2'>
                Setelah mengakhiri shift, Anda akan diarahkan ke halaman pemilihan shift. Anda dapat memilih shift baru
                atau logout dari sistem.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Alert severity='error'>Gagal memuat ringkasan shift</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant='outlined'>
          Batal
        </Button>
        <Button
          onClick={() => setShowConfirmation(true)}
          variant='contained'
          color='error'
          startIcon={<Icon icon='mdi:logout' />}
        >
          Akhiri Shift
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EndShiftModal
