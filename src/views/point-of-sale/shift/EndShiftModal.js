import React, { useEffect, useState } from 'react'
import {
  Dialog,
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
import { toast } from 'sonner'
import Icon from 'src/@core/components/icon'
import { priceFormat } from 'src/helpers/priceFormatter'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'

const EndShiftModal = ({ open, onClose, onShiftEnded }) => {
  const router = useRouter()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
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
      toast.error(error.response?.data?.message || 'Failed to load shift summary')
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
        toast.success('Shift ended successfully')
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
      toast.error(error.response?.data?.message || 'Failed to end shift')
    } finally {
      setEnding(false)
    }
  }

  const handleClose = () => {
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

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        scroll='paper'
        maxWidth='md'
        onClose={onClose}
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            height: 'auto',
            maxHeight: '95vh',
            position: 'relative'
          }
        }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(12)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            overflowY: 'auto',
            pt: theme => `${theme.spacing(16)} !important`,
            mb: 3
          }}
        >
          {/* FIXED HEADER WITHIN MODAL */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
              py: theme => `${theme.spacing(3)} !important`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon='mdi:clipboard-text-outline' fontSize={32} />
              <Typography
                variant='h4'
                sx={{
                  margin: 0
                }}
              >
                Ringkasan Shift
              </Typography>
            </Box>
          </Box>
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
                  Setelah mengakhiri shift, Anda akan diarahkan ke halaman pemilihan shift. Anda dapat memilih shift
                  baru atau logout dari sistem.
                </Typography>
              </Alert>
            </Box>
          ) : (
            <Alert severity='error'>Gagal memuat ringkasan shift</Alert>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
            py: theme => `${theme.spacing(2)} !important`,
            zIndex: 1
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Button fullWidth variant='outlined' onClick={onClose}>
                Batal
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={async () => {
                  await swalConfirmationOnly({
                    title: 'Konfirmasi Akhiri Shift',
                    text: 'Apakah Anda yakin ingin mengakhiri shift sekarang? Setelah shift diakhiri, Anda akan kembali ke halaman pemilihan shift.',
                    onClickYes: handleEndShift,
                    successMessage: 'Shift ended successfully'
                  })
                }}
                startIcon={<Icon icon='mdi:logout' />}
              >
                Akhiri Shift
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default EndShiftModal
