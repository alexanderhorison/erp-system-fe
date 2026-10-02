import React, { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'src/configs/axios'
import { toast } from 'sonner'
import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import { confirm } from 'src/helpers/confirm'
import { notifyInfo } from 'src/helpers/notify'
import Logo from 'src/icons/logo'
import { PosClock } from 'src/views/point-of-sale/DetailUserPos'
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

const PointOfSaleShiftPage = () => {
  const router = useRouter()
  const auth = UseAuth()
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedShift, setSelectedShift] = useState(null)
  const [starting, setStarting] = useState(false)

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
        toast.success('Melanjutkan shift aktif')
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
        toast.error('Gagal memeriksa shift aktif')
        setLoading(false) // Ensure loading is set to false to prevent stuck
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
      toast.error(error.response?.data?.message || 'Gagal mengambil data shift')
    } finally {
      setLoading(false)
    }
  }

  const handleStartShift = async () => {
    if (!selectedShift) {
      toast.error('Silakan pilih shift terlebih dahulu')
      return
    }

    try {
      setStarting(true)
      const response = await axios.post('/user-shift/start', {
        masterShiftId: selectedShift.id
      })

      if (response.data?.success) {
        toast.success('Shift berhasil dimulai')
        // Redirect to POS page
        router.push('/point-of-sale')
      }
    } catch (error) {
      console.error('Error starting shift:', error)
      toast.error(error.response?.data?.message || 'Gagal memulai shift')
    } finally {
      setStarting(false)
    }
  }

  const handleLogoutClick = async () => {
    try {
      const confirmed = await confirm({
        title: 'Konfirmasi Logout',
        description: 'Apakah Anda yakin ingin keluar dari sistem?',
        confirmLabel: 'Ya, Logout',
        cancelLabel: 'Batal',
        confirmIcon: 'tabler:logout'
      })

      if (confirmed) {
        notifyInfo('Logging out...')

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
        bgcolor: stone[100],
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top bar: brand, clock, user and logout */}
      <Box
        component='header'
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          px: { xs: 3, md: 5 },
          py: 2,
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.background
        }}
      >
        <Logo width={36} height={36} style={{ flexShrink: 0 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <PosClock />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pl: 1,
              pr: 4,
              height: 40,
              borderRadius: 9999,
              border: `1px solid ${colors.border3}`,
              backgroundColor: stone[50],
              boxShadow: shadows.xs
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'primary.contrastText',
                backgroundColor: 'primary.main'
              }}
            >
              {auth.user?.name
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U'}
            </Avatar>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.foreground,
                whiteSpace: 'nowrap'
              }}
            >
              {auth.user?.name || 'User'}{' '}
              <Box component='span' sx={{ fontWeight: 400, color: colors.mutedForeground }}>
                {auth.user?.Role?.name || 'Cashier'}
              </Box>
            </Typography>
          </Box>
          <Tooltip title='Logout'>
            <IconButton
              onClick={handleLogoutClick}
              size='small'
              aria-label='Logout'
              sx={{
                width: 40,
                height: 40,
                color: colors.destructive,
                border: `1px solid ${colors.destructive}`,
                '&:hover': { backgroundColor: statusTokens.danger.bg }
              }}
            >
              <Icon icon='tabler:logout' fontSize='1.125rem' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Shift selection */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          p: { xs: 3, md: 6 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 520,
            height: 'fit-content',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.xs,
            backgroundColor: colors.background
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Icon icon='tabler:clock-hour-4' fontSize='2.25rem' style={{ color: colors.foreground }} />
            <Typography sx={{ mt: 1, fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
              Pilih Shift Anda
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
              Silakan pilih shift untuk memulai transaksi
            </Typography>
          </Box>

          {shifts.length === 0 ? (
            <Alert severity='warning'>Tidak ada shift yang tersedia. Silakan hubungi administrator.</Alert>
          ) : (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 3
                }}
              >
                {shifts.map(shift => {
                  const selected = selectedShift?.id === shift.id

                  return (
                    <Box
                      key={shift.id}
                      role='radio'
                      aria-checked={selected}
                      tabIndex={0}
                      onClick={() => setSelectedShift(shift)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedShift(shift)
                      }}
                      sx={{
                        position: 'relative',
                        p: 3,
                        cursor: 'pointer',
                        borderRadius: `${radii['3xl']}px`,
                        border: `1px solid ${selected ? colors.foreground : colors.border}`,
                        backgroundColor: selected ? stone[50] : colors.background,
                        transition: 'border-color 0.15s',
                        '&:hover': { borderColor: colors.border3 },
                        '&:focus-visible': { outline: `2px solid ${colors.border3}`, outlineOffset: 2 }
                      }}
                    >
                      {/* Radio mark */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: `1px solid ${selected ? colors.foreground : colors.border3}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {selected && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.foreground }} />
                        )}
                      </Box>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: `1px solid ${colors.border}`,
                          color: colors.foreground
                        }}
                      >
                        <Icon icon='tabler:clock-hour-4' fontSize='0.875rem' />
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground }}>
                        {shift.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
                        {formatTime(shift.startShift)}-{formatTime(shift.endShift)}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>

              <Button
                variant='contained'
                fullWidth
                onClick={handleStartShift}
                disabled={!selectedShift || starting}
                startIcon={
                  starting ? (
                    <CircularProgress size={16} color='inherit' />
                  ) : (
                    <Icon icon='tabler:checkbox' fontSize='1rem' />
                  )
                }
                sx={{ height: 44 }}
              >
                {starting ? 'Memulai Shift...' : 'Mulai Shift'}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

// This is required for authentication guard
PointOfSaleShiftPage.acl = {
  action: 'read',
  subject: 'pos-page'
}

export default PointOfSaleShiftPage
