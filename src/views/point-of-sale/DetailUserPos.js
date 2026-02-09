import { Card, Typography, IconButton, Tooltip, Avatar, Divider, Chip, Button } from '@mui/material'
import LiveClock from '../common/LiveClock'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import swal from 'src/pages/sweetalert'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'
import ShiftTimer from './shift/ShiftTimer'
import { useState } from 'react'
import EndShiftModal from './shift/EndShiftModal'

export default function DetailUserPos({ user, warehouse, setOpenSetting, currentShift, onShiftEnded }) {
  const auth = UseAuth()
  const [showEndShiftModal, setShowEndShiftModal] = useState(false)

  const handleLogoutClick = async () => {
    try {
      const result = await swal.fire({
        title: 'Konfirmasi Logout',
        text: 'Apakah Anda yakin ingin keluar dari sistem Point of Sale? Semua data yang belum disimpan akan hilang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: environtmentColor()
      })

      if (result.isConfirmed) {
        // Show loading/success message
        swal.fire({
          title: 'Logging out...',
          text: 'Mohon tunggu sebentar',
          icon: 'info',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          confirmButtonColor: environtmentColor()
        })

        // Perform logout after a short delay
        setTimeout(() => {
          auth.logout()
        }, 1000)
      }
    } catch (error) {
      console.error('Error during logout confirmation:', error)
    }
  }

  const handleEndShiftClick = () => {
    setShowEndShiftModal(true)
  }

  const handleShiftEnded = () => {
    setShowEndShiftModal(false)
    if (onShiftEnded) {
      onShiftEnded()
    }
  }

  // Get user initials for avatar
  const getUserInitials = name => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Card
        sx={{
          p: { xs: 1.5, md: 2 },
          height: { xs: 'auto', md: '6rem' },
          minHeight: { xs: '4rem', md: '6rem' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left Section: Shift Area */}
        <Box
          sx={{
            flex: { xs: 'none', md: 1 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            pr: { xs: 0, md: 2 },
            pb: { xs: 1, md: 0 },
            gap: 0.75,
            position: 'relative'
          }}
        >
          {currentShift ? (
            <>
              {/* Header/Label Shift */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Icon icon='mdi:clock-time-four-outline' fontSize='0.9rem' sx={{ color: 'primary.main' }} />
                <Typography
                  variant='subtitle2'
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: 'primary.main'
                  }}
                >
                  {currentShift.Master_Shift?.name || 'Shift'}
                </Typography>
              </Box>

              {/* Informasi Waktu Shift */}
              <Typography
                variant='caption'
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  lineHeight: 1.3
                }}
              >
                Waktu: {currentShift.Master_Shift?.startShift?.substring(0, 5)} -{' '}
                {currentShift.Master_Shift?.endShift?.substring(0, 5)}
              </Typography>

              {/* Informasi Durasi */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon icon='tabler:clock' fontSize='0.7rem' sx={{ color: 'text.secondary' }} />
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    color: 'text.primary'
                  }}
                >
                  <ShiftTimer currentShift={currentShift} onEndShift={handleEndShiftClick} showOnlyDuration />
                </Typography>
              </Box>

              {/* Tombol Aksi (End Shift) */}
              <Button
                onClick={handleEndShiftClick}
                variant='outlined'
                color='warning'
                size='small'
                startIcon={<Icon icon='mdi:logout' fontSize='0.8rem' />}
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 1,
                  py: 0.25,
                  minHeight: 'auto',
                  '&:hover': {
                    bgcolor: 'warning.light',
                    borderColor: 'warning.main',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                End Shift
              </Button>
            </>
          ) : (
            <>
              {/* Header/Label Warehouse */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Icon
                  icon={warehouse?.warehouseName ? 'tabler:building-store' : 'tabler:alert-circle'}
                  fontSize='0.9rem'
                  sx={{ color: warehouse?.warehouseName ? 'primary.main' : 'error.main' }}
                />
                <Typography
                  variant='subtitle2'
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: warehouse?.warehouseName ? 'primary.main' : 'error.main'
                  }}
                >
                  Warehouse
                </Typography>
              </Box>

              {/* Informasi Warehouse */}
              <Typography
                variant='body2'
                sx={{
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  color: warehouse?.warehouseName ? 'text.primary' : 'error.main',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}
              >
                {warehouse?.warehouseName || 'Select warehouse'}
              </Typography>
            </>
          )}
        </Box>

        {/* Divider */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '1px',
            bgcolor: 'divider',
            alignSelf: 'stretch',
            mx: 1
          }}
        />

        {/* Right Section: User Area */}
        <Box
          sx={{
            flex: { xs: 'none', md: 1 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          {/* Area Atas: Avatar + User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', mb: 1 }}>
            {/* Avatar User */}
            <Avatar
              sx={{
                width: { xs: 28, md: 32 },
                height: { xs: 28, md: 32 },
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontSize: { xs: '0.7rem', md: '0.8rem' },
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              {getUserInitials(user?.name)}
            </Avatar>

            {/* Informasi User */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant='subtitle2'
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user?.name || 'Unknown User'}
              </Typography>
              <Chip
                label='Cashier'
                size='small'
                variant='filled'
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 500,
                  borderRadius: 1,
                  mt: 0.25,
                  '& .MuiChip-label': { px: 0.8, py: 0.2 }
                }}
              />
            </Box>
          </Box>

          {/* Area Bawah: Clock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icon icon='tabler:clock' fontSize='0.7rem' sx={{ color: 'text.secondary' }} />
            <Typography
              variant='caption'
              sx={{
                fontSize: '0.65rem',
                color: 'text.secondary',
                fontWeight: 500
              }}
            >
              <LiveClock utcOffset={7} />
            </Typography>
          </Box>

          {/* Logout Button - Absolute Position */}
          <Tooltip title='Logout' placement='left'>
            <IconButton
              onClick={handleLogoutClick}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'text.secondary',
                bgcolor: 'transparent',
                width: 24,
                height: 24,
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'error.main',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              size='small'
            >
              <Icon icon='tabler:logout' fontSize='0.8rem' />
            </IconButton>
          </Tooltip>
        </Box>
      </Card>

      {/* End Shift Modal */}
      <EndShiftModal
        open={showEndShiftModal}
        onClose={() => setShowEndShiftModal(false)}
        onShiftEnded={handleShiftEnded}
      />
    </>
  )
}
