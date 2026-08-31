import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'src/configs/axios'
import { toast } from 'sonner'
import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import swal from 'src/pages/sweetalert'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'

const PointOfSaleShiftPage = () => {
  const router = useRouter()
  const auth = UseAuth()
  const theme = useTheme()
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedShift, setSelectedShift] = useState(null)
  const [starting, setStarting] = useState(false)

  // Get current time
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    checkCurrentShift()
  }, [])

  const checkCurrentShift = async () => {
    try {
      setLoading(true)
      // Check if user already has an active shift
      const response = await axios.get('/user-shift/current')
      if (response.data?.success && response.data.data) {
        // User has active shift, redirect to POS
        toast.success('Resuming active shift')
        router.push('/point-of-sale')
        return
      } else {
        // No active shift, proceed to shift selection
        fetchAvailableShifts()
      }
    } catch (error) {
      // Handle errors
      if (error.response?.status === 404 || error.response?.status === 400) {
        fetchAvailableShifts()
      } else {
        console.error('Error checking current shift:', error)
        toast.error('Failed to check active shift')
        setLoading(false)  // Ensure loading is set to false to prevent stuck
      }
    }
  }

  const fetchAvailableShifts = async () => {
    try {
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
        // Redirect to POS page
        router.push('/point-of-sale')
      }
    } catch (error) {
      console.error('Error starting shift:', error)
      toast.error(error.response?.data?.message || 'Failed to start shift')
    } finally {
      setStarting(false)
    }
  }

  const handleLogoutClick = async () => {
    try {
      const result = await swal.fire({
        title: 'Konfirmasi Logout',
        text: 'Apakah Anda yakin ingin keluar dari sistem?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: environtmentColor()
      })

      if (result.isConfirmed) {
        swal.fire({
          title: 'Logging out...',
          text: 'Mohon tunggu sebentar',
          icon: 'info',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          confirmButtonColor: environtmentColor()
        })

        setTimeout(() => {
          auth.logout()
        }, 1000)
      }
    } catch (error) {
      console.error('Error during logout confirmation:', error)
    }
  }

  const formatTime = time => {
    if (!time) return ''
    // Time format is HH:mm:ss, we only need HH:mm
    return time.substring(0, 5)
  }

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        flexDirection='column'
        gap={2}
        sx={{
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant='h6'>Memeriksa shift aktif...</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        py: 4
      }}
    >
      {/* Header with User Info and Logout */}
      <Container maxWidth='lg' sx={{ mb: 3 }}>
        <Card sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Grid container alignItems='center' minHeight={60}>
              {/* Left: User Info */}
              <Grid item xs={4}>
                <Box display='flex' alignItems='center' gap={2} justifyContent='flex-start'>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}
                  >
                    {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Box>
                  <Box>
                    <Typography variant='h6' fontWeight={600} color='text.primary'>
                      {auth.user?.name || 'User'}
                    </Typography>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Typography variant='body2' color='text.secondary' fontWeight={500}>
                        {auth.user?.Role?.name || 'Cashier'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Center: Date & Time */}
              <Grid item xs={4}>
                <Box textAlign='center'>
                  <Typography variant='body2' color='text.secondary' fontWeight={500}>
                    {formatCurrentDate()}
                  </Typography>
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5} mt={0.5}>
                    <Icon icon='mdi:clock-outline' fontSize={18} color={theme.palette.primary.main} />
                    <Typography variant='h6' fontWeight={600} color='primary.main'>
                      {formatCurrentTime()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right: Logout Button */}
              <Grid item xs={4}>
                <Box display='flex' justifyContent='flex-end'>
                  <Tooltip title='Logout'>
                    <IconButton
                      onClick={handleLogoutClick}
                      sx={{
                        border: 2,
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          bgcolor: 'error.light',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon icon='mdi:logout' fontSize={24} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Container maxWidth='lg'>
        <Box sx={{ width: '100%' }}>
          {/* Title Section */}
          <Box textAlign='center' mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Icon icon='mdi:clock-check-outline' fontSize={50} color='primary' />
            </Box>
            <Typography variant='h4' fontWeight={700} color='text.primary' sx={{ mb: 1 }}>
              Pilih Shift Anda
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Silakan pilih shift untuk memulai transaksi
            </Typography>
          </Box>

          {/* Shift Selection Cards */}
          {shifts.length === 0 ? (
            <Card sx={{ maxWidth: 600, mx: 'auto', border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Alert severity='warning'>Tidak ada shift yang tersedia. Silakan hubungi administrator.</Alert>
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3} justifyContent='center' sx={{ mb: 4 }}>
                {shifts.map(shift => (
                  <Grid item xs={12} sm={6} md={4} key={shift.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedShift?.id === shift.id ? 'primary.main' : 'divider',
                        bgcolor: selectedShift?.id === shift.id ? 'primary.lighter' : 'background.paper',
                        boxShadow: selectedShift?.id === shift.id ? 3 : 0,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        },
                        height: '100%'
                      }}
                      onClick={() => setSelectedShift(shift)}
                    >
                      <CardContent>
                        <Box display='flex' flexDirection='column' alignItems='center' textAlign='center' py={2}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              bgcolor: selectedShift?.id === shift.id ? 'primary.main' : 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <Icon
                              icon='mdi:clock-time-four-outline'
                              fontSize={48}
                              color={selectedShift?.id === shift.id ? 'white' : 'grey'}
                            />
                          </Box>
                          <Typography
                            variant='h5'
                            fontWeight={600}
                            sx={{
                              mb: 1,
                              color: selectedShift?.id === shift.id ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {shift.name}
                          </Typography>
                          <Typography
                            variant='h6'
                            color={selectedShift?.id === shift.id ? 'primary.dark' : 'text.secondary'}
                            fontWeight={500}
                          >
                            {formatTime(shift.startShift)} - {formatTime(shift.endShift)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Action Button */}
              <Box display='flex' justifyContent='center' sx={{ pb: 4 }}>
                <Button
                  variant='contained'
                  onClick={handleStartShift}
                  disabled={!selectedShift || starting}
                  startIcon={
                    starting ? <CircularProgress size={20} color='inherit' /> : <Icon icon='mdi:check-circle' />
                  }
                  size='large'
                  sx={{
                    minWidth: { xs: '100%', sm: 300 },
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  {starting ? 'Memulai Shift...' : 'Mulai Shift'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  )
}

// This is required for authentication guard
PointOfSaleShiftPage.acl = {
  action: 'read',
  subject: 'pos-page'
}

export default PointOfSaleShiftPage
